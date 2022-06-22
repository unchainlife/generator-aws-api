from handler import handle

def test_handle():
    actual = handle()
    assert actual == { "message": "OK" }
