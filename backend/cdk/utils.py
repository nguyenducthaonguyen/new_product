import json
from typing import Literal

from aws_cdk import aws_ssm as ssm, aws_secretsmanager as secrets
from constructs import Construct


def load_config(fp: str) -> dict:
    """Load configuration value by key."""
    try:
        with open(fp, "r") as file:
            config: dict = json.load(file)
        return config

    except FileNotFoundError:
        raise FileNotFoundError(f"Configuration file {fp} does not exist.")
    except json.JSONDecodeError:
        raise ValueError(f"Configuration file {fp} is not a valid JSON.")


def get_parameter_from_ssm(scope: Construct, cred_path: str) -> str:
    """Get parameter from SSM Parameter Store."""
    value = ssm.StringParameter.value_for_string_parameter(scope, cred_path)
    if not value:
        raise ValueError(f"SSM parameter '{cred_path}' is empty or does not exist")

    return value


def get_parameter_from_secret(scope: Construct, cred_path: str, key: str) -> str:
    """Get parameter from Secrets Manager."""
    secret = secrets.Secret.from_secret_name_v2(scope, f"Secret-{cred_path}", cred_path)
    if not secret:
        raise ValueError(f"Secret '{cred_path}' is empty or does not exist")

    return secret.secret_value_from_json(key).to_string()


_Arch = Literal['x86_64', 'arm64']
_PythonVersion = Literal['python39', 'python310', 'python311', 'python312']
_PkgVersion = Literal['V1', 'V2', 'V3']


def generate_lambda_powertools_arn(
    *,
    region: str,
    arn_version: int = 23,
    architecture: _Arch | str = 'x86_64',
    pkg_version: _PkgVersion | str = 'V3',
    python_version: _PythonVersion | str = 'python312',
):
    """
    Document: https://docs.powertools.aws.dev/lambda/python/latest/#python-312
    Example ARN: arn:aws:lambda:us-east-2:017000801446:layer:AWSLambdaPowertoolsPythonV3-python312-x86_64:23
    """

    # Default Aws account ID
    _account_id: str = '017000801446'
    return (
        f"arn:aws:lambda:{region}:{_account_id}:layer:"
        f"AWSLambdaPowertoolsPython{pkg_version}-{python_version}-{architecture}:{arn_version}"
    )
