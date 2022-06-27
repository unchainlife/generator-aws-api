from pydantic import BaseModel

class Params(BaseModel):
    """
    All of the standard parameters are defined here and validated using pydantic
    """
    ord_id: int

class Config(BaseModel):
    """
    All of the environment variables are defined here and validated using pydantic
    """
    AWS_REGION: str

class Response(BaseModel):
    """
    The standard response is defined here and validated using pydantic
    """
    message: str
    params: Params
    config: Config

def handle(params: Params, config: Config) -> Response:
    return Response(
        message="OK",
        params=params,
        config=config
    )
