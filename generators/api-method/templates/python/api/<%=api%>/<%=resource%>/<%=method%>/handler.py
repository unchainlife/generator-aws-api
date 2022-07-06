# -----------------------------------------------------------------------------
# Make your changes here.
# -----------------------------------------------------------------------------
from pydantic import BaseModel

class Params(BaseModel):
    """
    The Params class defines all the input parameters to be taken from the HTTP
    Request, whether from the Path, Query String or Body.
    All parameters are validated using pydantic, and will result in a 
    400 Bad Request being returned if validation fails.
    To add a new parameter simply add a new pydantic compatible definition
    below, and pydantic should allow for even complex validation logic to be
    supported.
    """
    ord_id: int

class Config(BaseModel):
    """
    The Config class defines all the Environment Variables that are needed for
    the business logic to execute successfully.
    All Environment Variables are validated using pydantic, and will result in
    a 500 Internal Server Error if validation fails.

    To add a new Environment Variable simply a new pydantic compatible
    definition below, and pydantic should allow for even complex validation
    logic to be supported.
    """
    AWS_REGION: str

class Response(BaseModel):
    """
    This is the standard Response that should be returned for a 200 OK.
    """
    message: str
    params: Params
    config: Config

def build_persistent_dependencies(config: Config) -> dict[str, any]:
    """
    AWS Lambdas may be re-used, rather than spinning up a new instance each
    time.  Doing this we can take advantage of state that persists between
    executions.  Any dependencies returned by this function will persist
    between executions and can therefore lead to performance gains.
    This function will be called ONCE in the lambdas lifecycle, which may or
    may not be each execution, depending on how busy the API is.
    These dependencies will be passed through to your `handle` function below.
    """
    return {}

def handle(params: Params, config: Config, **dependencies) -> Response:
    """
    Change this function to handle the lambda request.
    This function will be called EACH TIME the lambda executes.
    Our advice is to place as much of your domain logic as possible into a
    Lambda Layer, and make the Lambda handler itself quite thin, taking the
    role of orchestration only; i.e. being responsible for instantiating 
    dependencies and executing the domain code.
    """
    return Response(
        message="OK",
        params=params,
        config=config
    )
