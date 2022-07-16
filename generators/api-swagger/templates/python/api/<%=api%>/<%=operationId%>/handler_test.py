from handler import handle, Params, Config, Response

def test_handle():
    params = Params()
    config = Config()

    actual = handle(params, config)
    
    assert actual == Response(
        message="OK",
        params=params,
        config=config
    )
