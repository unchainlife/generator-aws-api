import os
from this import s
from handler import Config
from lambda_utils import validate_params, execute_handler, render_response

# -----------------------------------------------------------------------------
# State that persists between lambda invocations
# -----------------------------------------------------------------------------

config = Config(**{ e: os.environ.get(e) for e in Config.__fields__.keys() })
dependencies = { }

# -----------------------------------------------------------------------------
# Lambda Handler
# -----------------------------------------------------------------------------

def handler(event, context):
    status_code, result = validate_params(event)
    if status_code == 200:
        status_code, result = execute_handler(result, config, **dependencies)
    return render_response(status_code, result)
