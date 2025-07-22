import json

def match_json(actual, expect):
    actual_json = json.loads(actual)
    expect_json = json.loads(expect)
    a = json.dumps(actual_json, ensure_ascii=False, sort_keys=True)
    b = json.dumps(expect_json, ensure_ascii=False, sort_keys=True)
    return a == b
