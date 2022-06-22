#!./venv/bin/python
import os
import json
import boto3
from handler import handle

environment_variables = [
    'TABLE_NAME',
    'AWS_REGION'
]
config = { e: os.environ.get(e) for e in environment_variables }

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(config['TABLE_NAME'])

def handler(event, context):

    qs = {
        **event.get("queryStringParameters", {}),
        **event.get("multiValueQueryStringParameters", {})
    }
    print(qs)
    result = handle(None, config, table)
    body = json.dumps(result)
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Content-Length": len(body)
        },
        "body": body
    }

if __name__ == '__main__':
    response = handler({ "queryStringParameters": { "foo": 1 }, "multiValueQueryStringParameters": { "bar": 2 } }, {})
    print(response)
    