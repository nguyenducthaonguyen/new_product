import os
import sys

from aws_cdk import App, Environment
from loguru import logger

from cdk.stacks.device_manager_api_stack import DeviceManagerAPIStack


# Environment configuration - uses AWS CLI configured account/region or environment variables
env = Environment(account=os.getenv("AWS_ACCOUNT_ID"), region=os.getenv("AWS_REGION"))

# Initialize CDK application
app = App()

# Get deployment environment from CDK context (dev, stg, prod)
# This must be provided via command line: cdk deploy -c env=dev
ctx_env: str = app.node.try_get_context("env")
if not ctx_env:
    logger.error(
        "Context 'env' is not set (dev, stg, prod). Please provide it in the context: cdk -c env=<env_name>"
    )
    sys.exit(1)

# Get optional custom prefix from CDK context, fallback to default
# Can be overridden via: cdk deploy -c env=dev -c prefix=CUSTOM
_prefix: str = app.node.try_get_context("prefix")
if not _prefix:
    # Default resource prefix for naming consistency across environments
    _prefix = os.getenv("DEVICE_MANAGER__DEFAULT_PREFIX", "RDV1")
    # Set default prefix in context for consistency across the app
    app.node.set_context("prefix", _prefix)

# Deploy the main DeviceManager API stack with environment-specific naming
# Stack name format: {PREFIX}-{ENV}-DeviceManagerAPIStack (e.g., RDV-dev-DeviceManagerAPIStack)
device_manager_api_stack = DeviceManagerAPIStack(
    scope=app, id=f"{_prefix}-{ctx_env}-DeviceManagerAPIStack", env=env
)

# # Deploy Slack App stack and make it depend on DeviceManager API (for export availability)
# slack_app_stack = SlackAppStack(
#     scope=app, id=f"{_prefix}-{ctx_env}-SlackAppStack", env=env
# )
#
# # Stack name format: {PREFIX}-{ENV}-PeerReviewBuilderStack (e.g., RDV-dev-PeerReviewBuilderStack)
# PeerReviewBuilderStack(
#     scope=app,
#     id=f"{_prefix}-{ctx_env}-PeerReviewBuilderStack",
#     env=env,
# )
#
# # Stack name format: {PREFIX}-{ENV}-PeerReviewRunnerStack (e.g., RDV-dev-PeerReviewRunnerStack)
# PeerReviewRunnerStack(
#     scope=app,
#     id=f"{_prefix}-{ctx_env}-PeerReviewRunnerStack",
#     env=env,
# )
#
# # Stack name format: {PREFIX}-{ENV}-SyncAccountStack (e.g., RDV-dev-SyncAccountStack)
# SyncAccountStack(
#     scope=app,
#     id=f"{_prefix}-{ctx_env}-SyncAccountStack",
#     env=env,
# )

# Generate CloudFormation templates
app.synth()
