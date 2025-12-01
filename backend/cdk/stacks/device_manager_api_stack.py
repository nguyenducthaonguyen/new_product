"""
AWS CDK Stack for DeviceManager API Infrastructure

This module defines the DeviceManagerAPIStack class which creates AWS resources
for a DeviceManager API including Lambda functions, API Gateway, and VPC configuration.

The stack supports multiple deployment environments and configuration methods
including SSM Parameter Store, AWS Secrets Manager, and direct credentials.

Usage:
    Deploy with custom config:
    cdk deploy -c env=prod -c prefix=myapp -c config_filepath=configs/prod.json
"""

import os
from typing import Literal, Dict, Optional

from aws_cdk import (
    Stack,
    aws_ssm as ssm,
    aws_ec2 as ec2,
    aws_iam as iam,
    aws_apigateway as apigateway,
    aws_lambda as _lambda,
    Duration,
)
from constructs import Construct

from cdk.utils import generate_lambda_powertools_arn, load_config


class DeviceManagerAPIStack(Stack):
    """
    AWS CDK Stack for DeviceManager API Infrastructure

    This stack creates and configures the following AWS resources:
    - Lambda function for handling DeviceManager API requests
    - API Gateway (HTTP API) for routing requests
    - VPC and security group configurations (when specified in config)
    - Lambda layers including PowerTools and optional custom DeviceManager API layer
    - Environment variables and database credential management

    The stack supports three credential management approaches:
    1. SSM Parameter Store (recommended for production) - encrypted, IAM-controlled
    2. AWS Secrets Manager (recommended for production) - automatic rotation support
    3. Direct credentials (development/testing only) - plain text env vars

    Attributes:
        _config (dict): Configuration dictionary loaded from file
        _prefix (str): Resource naming prefix from CDK context
        _env (str): Environment name from CDK context
        _vpc (ec2.IVpc): VPC instance for Lambda deployment (optional)
        _vpc_subnets (ec2.SubnetSelection): Subnet selection for VPC (optional)
        _security_groups (list): Security groups for Lambda (optional)
        api_gateway (apigatewayv2.HttpApi): The created API Gateway instance

    Example:
        ```python
        # Deploy to production environment
        cdk deploy -c env=prod -c config_filepath=configs/dev.json
        ```
    """

    _config: dict = {}
    _prefix: str = None
    _env: str = None

    # Networking components - initialized as None, set up conditionally based on config
    _vpc = None
    _vpc_subnets = None
    _security_groups = None

    def __init__(
        self,
        scope: Construct,
        id: str,
        **kwargs,
    ) -> None:
        """
        Initialize the DeviceManagerAPIStack

        Creates all necessary AWS resources for the device manager API including Lambda function,
        API Gateway, VPC configuration, and environment variable setup.

        Args:
            scope (Construct): The parent construct (usually App)
            id (str): The construct ID for this stack
            **kwargs: Additional keyword arguments passed to Stack parent class

        Context Parameters:
            env (str): Environment name (dev/staging/prod)
            prefix (str): Resource naming prefix (company/project name)
            config_filepath (str): Path to configuration file
        """

        super().__init__(scope, id, **kwargs)

        # Step 1: Initialize context and configuration
        self._load_context_and_config()

        # Step 2: Setup networking if configured
        self._setup_networking()

        # Step 3: Create Lambda layers
        lambda_layers = self._create_lambda_layers(
            runtime=_lambda.Runtime.PYTHON_3_12,  # type: ignore
            architecture=_lambda.Architecture.ARM_64,  # type: ignore
        )

        # Step 4: Create Lambda function
        device_manager_function = self._create_device_manager_function(
            runtime=_lambda.Runtime.PYTHON_3_12,  # type: ignore
            architecture=_lambda.Architecture.ARM_64,  # type: ignore
            layers=list(lambda_layers.values()),
            # VPC configuration (optional) - enables access to private resources like RDS
            # Set to None if no VPC configuration provided
            vpc=self._vpc,
            vpc_subnets=self._vpc_subnets,
            security_groups=self._security_groups,
            memory_size=512,
        )

        # Step 5: Configure database credentials
        self._configure_database_credentials(device_manager_function)

        # Step 6: Create API Gateway
        self.api_gateway = self._create_api_gateway(device_manager_function)

    def _load_context_and_config(self) -> None:
        """
        Load CDK context values and configuration file.

        Sets up:
        - Environment and prefix from CDK context
        - Configuration dictionary from file (if specified)
        """

        # Get environment and prefix from CDK context
        # These are typically set via: cdk deploy -c env=prod -c prefix=name
        self._env: str = self.node.try_get_context("env")
        self._prefix: str = self.node.try_get_context("prefix")

        # Load configuration from file path specified in context
        # This allows environment-specific configurations (dev.json, prod.json, etc.)
        config_filepath: Optional[str] = self.node.try_get_context("config_filepath")

        if config_filepath:
            self._config: Dict = load_config(fp=config_filepath)
        else:
            self._config: Dict = {}

    def _setup_networking(self) -> None:
        """
        Setup VPC configuration if networking section exists in config.

        Initializes networking components and optionally configures VPC
        based on configuration file settings. This is optional - Lambda
        can run without VPC for simpler architectures.
        """

        # Initialize networking components - set up conditionally based on config
        self._vpc = None
        self._vpc_subnets = None
        self._security_groups = None

        # Setup VPC configuration if networking section exists in config
        network_config: Optional[Dict] = self._config.get("network")

        if network_config:
            # Validate network config if present
            required = [
                "vpc_id",
                "availability_zones",
                "private_subnet_ids",
                "security_group_ids",
            ]
            missing = [k for k in required if k not in self._config["network"]]
            if missing:
                raise ValueError(f"Missing network config: {missing}")

            # Extract network configuration parameters
            vpc_id = network_config["vpc_id"]
            availability_zones = network_config["availability_zones"]
            private_subnet_ids = network_config["private_subnet_ids"]
            security_group_ids = network_config["security_group_ids"]

            # Create VPC reference from existing VPC attributes
            # This allows CDK to understand the VPC structure without managing it
            self._vpc = ec2.Vpc.from_vpc_attributes(
                scope=self,
                id=f"{self._prefix}-{self._env}-PrivateVPC",
                vpc_id=vpc_id,
                availability_zones=availability_zones,
                private_subnet_ids=private_subnet_ids,
            )

            # Configure Lambda to use private subnets with egress (internet access via NAT Gateway)
            self._vpc_subnets = ec2.SubnetSelection(
                subnet_type=ec2.SubnetType.PRIVATE_WITH_EGRESS
            )

            # Import existing security groups for Lambda network access control
            # Each security group is imported as a separate CDK construct
            self._security_groups = [
                ec2.SecurityGroup.from_security_group_id(
                    scope=self,
                    id=f"{self._prefix}-{self._env}-security-group-{idx + 1}",
                    security_group_id=security_group_id,
                )
                for idx, security_group_id in enumerate(security_group_ids)
            ]

    def _create_lambda_layers(
        self,
        *,
        runtime: _lambda.Runtime,
        architecture: _lambda.Architecture,
        **kwargs,
    ) -> Dict[str, _lambda.ILayerVersion]:
        """
        Create Lambda layers for the device manager API function.

        Creates two layers:
        - PowerTools layer for observability and utilities
        - Custom device manager API layer built via Docker with dependencies

        Args:
            runtime: Lambda runtime environment
            architecture: Instruction set architecture (ARM_64 recommended)
            **kwargs: Additional options including powertools_options

        Returns:
            Dict mapping layer names to layer versions ('powertools', 'device_manager_api')
        """

        # Configure Lambda architecture and runtime
        # Using x86_64 for compatibility, Python 3.12 for latest features and performance
        lambda_layers: Dict[str, _lambda.ILayerVersion] = {}

        # Create AWS Lambda PowerTools layer for observability and utilities
        # PowerTools provides: structured logging, metrics, tracing, parameter retrieval

        kw_powertools_options = kwargs.pop("powertools_options", None) or {}

        powertools_arn = generate_lambda_powertools_arn(
            region=self.region,
            architecture=architecture.name,
            **kw_powertools_options,
        )

        lambda_powertools_layer: _lambda.ILayerVersion = (
            _lambda.LayerVersion.from_layer_version_arn(
                scope=self,
                id=f"{self._prefix}-{self._env}-LambdaPowerToolsLayer",
                layer_version_arn=powertools_arn,
            )
        )
        lambda_layers["powertools"] = lambda_powertools_layer

        # Build custom layer using Docker for consistent dependency management
        # Docker build ensures reproducible layer with exact dependency versions

        layer_ = _lambda.LayerVersion(
            scope=self,
            id=f"{self._prefix}-{self._env}-DeviceManagerAPILayer",
            code=_lambda.AssetCode.from_docker_build(
                path=".",  # Build from project root directory
                image_path="asset-output",
                file="lambda_layers/Dockerfile-DeviceManagerAPI",
            ),
            compatible_runtimes=[runtime],
            compatible_architectures=[architecture],
            layer_version_name=f"{self._prefix}-{self._env}-DeviceManagerAPILayer",
            description="Custom layer containing Device Manager API dependencies, utilities, and shared code",
            **kwargs,
        )
        lambda_layers["device_manager_api"] = layer_  # type: ignore

        return lambda_layers

    def _create_device_manager_function(
        self,
        *,
        architecture: _lambda.Architecture,
        runtime: _lambda.Runtime,
        timeout: int = 60,
        **kwargs,
    ) -> _lambda.Function:
        """
        Create the main Lambda function for handling Device Manager API requests.

        Creates a Lambda function that processes HTTP requests from API Gateway,
        handles Device Manager operations, and connects to configured databases.

        Args:
            architecture: Instruction set architecture for the function
            runtime: Lambda runtime environment
            **kwargs: Additional configuration (layers, VPC, memory, etc.)

        Returns:
            The configured Lambda function for the Device Manager API
        """
        function_name = f"{self._prefix}-{self._env}-DeviceManagerAPIFunction"

        function = _lambda.Function(
            scope=self,
            id=f"{self._prefix}-{self._env}-DeviceManagerAPIFunction",
            code=_lambda.Code.from_asset(
                "functions/product_manager/app"
            ),  # Source code directory
            handler="lambda_function.lambda_handler",  # Entry point: file.function
            runtime=runtime,  # type: ignore
            architecture=architecture,  # type: ignore
            function_name=function_name,
            timeout=Duration.seconds(timeout),
            **kwargs,
        )

        return function

    def _configure_database_credentials(
        self, device_manager_function: _lambda.Function
    ) -> None:
        """
        Configure database credentials and environment variables for the Lambda function.

        Supports three credential management approaches:
        1. SSM Parameter Store (recommended) - encrypted storage, IAM-controlled access
        2. AWS Secrets Manager (recommended) - automatic rotation, encrypted storage
        3. Direct credentials (development only) - plain text environment variables

        Args:
            device_manager_function: The Lambda function to configure
        """

        # Extract and validate database credentials from configuration
        # Multiple credential sources are supported (see class documentation)
        db_credentials: dict = self._config.get("database", {}).get("credentials")

        # Dictionary to store environment variables for Lambda function
        # These will be available as os.environ in the Lambda runtime
        envs: Dict[str, str] = {}

        # Configure database credentials based on provider type
        # Three approaches supported: SSM Parameter Store, Secrets Manager, Direct credentials
        if db_credentials:
            creds_provider = db_credentials.get("provider")
            creds_expose: Optional[bool] = db_credentials.get("expose")

            if creds_provider in ("ssm", "secret"):
                # Handle SSM Parameter Store or AWS Secrets Manager credentials (RECOMMENDED)
                # These approaches provide encryption at rest and IAM-based access control

                parameter_name = db_credentials.get("parameter_name")
                if not parameter_name:
                    raise ValueError("parameter_name required for SSM/Secrets Manager")

                if creds_expose:
                    # Option 1: Directly expose credentials as environment variable
                    # LESS SECURE: Credentials are resolved at deployment time and stored as plaintext env vars
                    # Use only when Lambda needs credentials immediately available without API calls

                    db_credentials_json: str = (
                        ssm.StringParameter.value_for_typed_string_parameter_v2(
                            scope=self,
                            parameter_name=parameter_name,
                            type=ssm.ParameterValueType.STRING,
                        )
                    )
                    envs.update({"DATABASE_CREDENTIALS": db_credentials_json})

                else:
                    # Option 2: Store parameter reference for runtime retrieval (RECOMMENDED)
                    # MORE SECURE: Credentials are fetched at runtime using IAM permissions
                    # Lambda code must implement parameter retrieval logic

                    envs.update(
                        {
                            "PARAMETERS_PROVIDER_NAME": creds_provider,  # "ssm" or "secret"
                            "DATABASE_CREDENTIALS_PARAMETER": parameter_name,
                        }
                    )

                    # Grant Lambda IAM permissions to read the specific parameter/secret
                    self._grant_parameter_access(
                        func=device_manager_function,
                        provider=creds_provider,
                        parameter_name=parameter_name,
                    )

                    # Enable parameter decryption if specified in config
                    # Required for SecureString parameters in SSM
                    creds_decrypt: Optional[bool] = db_credentials.get("decrypt")
                    if creds_decrypt:
                        envs.update({"PARAMETERS_PROVIDER_DECRYPT": "true"})

            else:
                # Handle direct database credentials from config file
                # LEAST SECURE: Credentials stored as plaintext in config and environment variables
                # Use only for development/testing environments

                required_creds = ["dbname", "host", "username", "password"]
                missing_creds = [
                    cred for cred in required_creds if cred not in db_credentials
                ]

                if missing_creds:
                    print(f"Missing required database credentials: {missing_creds}")
                else:
                    envs.update(
                        {
                            "POSTGRES_DB": db_credentials["dbname"],
                            "POSTGRES_HOST": db_credentials["host"],
                            "POSTGRES_PORT": db_credentials.get("port", "5432"),
                            "POSTGRES_USER": db_credentials["username"],
                            "POSTGRES_PASSWORD": db_credentials["password"],
                        }
                    )

        else:
            # Fallback: Handle direct database credentials from deployment environment variables
            # Used when no config file is provided - credentials come from CI/CD environment

            required_env_vars = [
                "DEVICE_MANAGER__DATABASE_NAME",
                "DEVICE_MANAGER__DATABASE_HOST",
                "DEVICE_MANAGER__DATABASE_USER",
                "DEVICE_MANAGER__DATABASE_PASSWORD",
            ]

            missing_vars = [var for var in required_env_vars if var not in os.environ]
            if missing_vars:
                print(
                    f"Missing environment variables: "
                    f"{', '.join(missing_vars)}\n"
                    f"These variables are required when no database config is provided."
                )

            else:
                pass
                envs.update(
                    {
                        "POSTGRES_DB": os.environ["DEVICE_MANAGER__DATABASE_NAME"],
                        "POSTGRES_HOST": os.environ["DEVICE_MANAGER__DATABASE_HOST"],
                        "POSTGRES_PORT": os.environ.get(
                            "DEVICE_MANAGER__DATABASE_PORT", "5432"
                        ),
                        "POSTGRES_USER": os.environ["DEVICE_MANAGER__DATABASE_USER"],
                        "POSTGRES_PASSWORD": os.environ["DEVICE_MANAGER__DATABASE_PASSWORD"],
                    }
                )

        # Apply all collected environment variables to the Lambda function
        # Each key-value pair becomes available as os.environ[key] in Lambda runtime

        for key, value in envs.items():
            # Don't log sensitive values
            if any(
                sensitive in key.lower()
                for sensitive in ["password", "secret", "credential"]
            ):
                pass
            else:
                pass
            device_manager_function.add_environment(key=key, value=value)

    def _create_api_gateway(self, device_manager_function: _lambda.Function):
        """
        Create HTTP API Gateway and configure routing to the Lambda function.

        Creates HTTP API (faster and cheaper than REST API) with catch-all routing
        that forwards all requests to the Lambda function for internal processing.

        Args:
            device_manager_function: The Lambda function to route requests to
        """
        api_name = f"{self._prefix}-{self._env}-DeviceManagerAPI"

        api_gateway = apigateway.RestApi(
            self,
            id=f"{self._prefix}-{self._env}-DeviceManagerAPI",
            rest_api_name=api_name,
            description="REST API Gateway for DeviceManager API Lambda function",
            deploy=True,
            deploy_options=apigateway.StageOptions(stage_name=self._env),
        )

        # Add catch-all resource and method to forward all requests to Lambda function
        # The {proxy+} pattern captures any path segments
        # Lambda receives the full request context and handles internal routing

        # Create the Lambda integration
        lambda_integration = apigateway.LambdaIntegration(
            handler=device_manager_function,  # type: ignore
            proxy=True,  # Enable proxy integration to pass all request details to Lambda
        )

        # Add the catch-all resource
        proxy_resource = api_gateway.root.add_resource("{proxy+}")

        # Add ANY method to handle all HTTP methods (GET, POST, PUT, DELETE, etc.)
        proxy_resource.add_method("ANY", lambda_integration)

        # Also handle requests to the root path
        api_gateway.root.add_method("ANY", lambda_integration)

        # TODO: Add security measures:
        #   - JWT/API Key authorization for authentication
        #   - Request throttling and rate limiting
        #   - CORS configuration for browser clients
        #   - Request/response validation
        #   - Usage plans for different access tiers

        return api_gateway

    def _grant_parameter_access(
        self,
        func: _lambda.Function,
        provider: Literal["ssm", "secret"],
        parameter_name: str,
    ) -> None:
        """
        Grant Lambda function permission to read from SSM Parameter Store or Secrets Manager

        This method implements the principle of least privilege by granting access only to
        the specific parameter or secret needed by the Lambda function.

        Args:
            func: The Lambda function to grant permissions to
            provider: The credential provider type ('ssm' or 'secret')
            parameter_name: The name/path of the parameter or secret

        Note:
            SSM Parameter Store is suitable for configuration values and simple secrets.
            Secrets Manager provides additional features like automatic rotation.
        """

        # Remove leading slash for consistent ARN construction
        original_name = parameter_name
        parameter_name = parameter_name.strip("/")

        if original_name != parameter_name:
            print(
                f"Normalized parameter name from '{original_name}' to '{parameter_name}'"
            )

        if provider == "ssm":
            # Grant permission to read specific SSM parameter
            # Uses GetParameter action for standard and SecureString parameters
            arn = f"arn:aws:ssm:{self.region}:{self.account}:parameter/{parameter_name}"

            func.add_to_role_policy(
                iam.PolicyStatement(actions=["ssm:GetParameter"], resources=[arn])
            )

        else:
            # Grant permission to read specific Secrets Manager secret
            # Secrets Manager ARNs require wildcards for version suffixes
            arn = f"arn:aws:secretsmanager:{self.region}:{self.account}:secret:{parameter_name}"

            func.add_to_role_policy(
                iam.PolicyStatement(
                    actions=["secretsmanager:GetSecretValue"], resources=[arn]
                )
            )
