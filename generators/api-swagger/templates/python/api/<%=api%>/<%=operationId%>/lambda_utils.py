# -----------------------------------------------------------------------------
# WARNING:  This is a scaffolded file and, while you should feel free to edit
# it, please be aware that future use of the scaffolder could cause changes to
# be lost.
# -----------------------------------------------------------------------------
import json
from handler import Params, Config
from pydantic import ValidationError

def validate_params(event) -> tuple[int, any]:
    """
    Takes the path and query string parameters and parses them into the Params class, wrapping them in exception handlers
    """
    raw = {
        **(event.get("queryStringParameters", {}) or {}),
        **(event.get("multiValueQueryStringParameters", {}) or {}),
        **(event.get("pathParameters", {}) or {})
    }
    try:
        return 200, Params(**raw)
    except ValidationError as e:
        return 400, { "message": str(e) }
    except Exception as e:
        return 500, { "message": str(e) }

def execute_handler(handle, params: Params, config: Config, **dependencies) -> tuple[int, any]:
    """
    Executes the handler and wraps it in exception handling
    """
    try:
        return 200, handle(params, config, **dependencies).dict()
    except Exception as e:
        return 500, { "message": str(e) }

def render_response(status_code: int, result: any) -> dict:
    """
    Renders the standard http response envelope
    """
    body = json.dumps(result)
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Content-Length": len(body)
        },
        "body": body
    }
