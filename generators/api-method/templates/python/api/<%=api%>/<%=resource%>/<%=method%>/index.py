# -----------------------------------------------------------------------------
# WARNING:  This is a scaffolded file and, while you should feel free to edit
# it, please be aware that future use of the scaffolder could cause changes to
# be lost.
# -----------------------------------------------------------------------------
import os
from this import s
from handler import Config, handle, build_persistent_dependencies
from lambda_utils import validate_params, execute_handler, render_response

# -----------------------------------------------------------------------------
# State that persists between lambda invocations.  If you would like to add
# further dependencies then add them into the `build_persistent_dependencies`
# function in `handler.py`
# -----------------------------------------------------------------------------

config = Config(**{ e: os.environ.get(e) for e in Config.__fields__.keys() })
dependencies = build_persistent_dependencies(config)

# -----------------------------------------------------------------------------
# Lambda Handler
# -----------------------------------------------------------------------------

def handler(event, context):
    status_code, result = validate_params(event)
    if status_code == 200:
        status_code, result = execute_handler(handle, result, config, **dependencies)
    return render_response(status_code, result)
