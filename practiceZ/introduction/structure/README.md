# AST 结构解析

```js
{
  "type": "Program",
  "start": 0,
  "end": 51,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 3,
      "end": 50,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 9,
          "end": 49,
          "id": {
            "type": "Identifier",
            "start": 9,
            "end": 12,
            "name": "bar"
          },
          "init": {
            "type": "ArrowFunctionExpression",
            "start": 15,
            "end": 49,
            "id": null,
            "expression": false,
            "generator": false,
            "async": false,
            "params": [],
            "body": {
              "type": "BlockStatement",
              "start": 21,
              "end": 49,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 27,
                  "end": 45,
                  "expression": {
                    "type": "CallExpression",
                    "start": 27,
                    "end": 44,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 27,
                      "end": 38,
                      "object": {
                        "type": "Identifier",
                        "start": 27,
                        "end": 34,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 35,
                        "end": 38,
                        "name": "log"
                      },
                      "computed": false
                    },
                    "arguments": [
                      {
                        "type": "Literal",
                        "start": 39,
                        "end": 43,
                        "value": true,
                        "raw": "true"
                      }
                    ]
                  }
                }
              ]
            }
          }
        }
      ],
      "kind": "const"
    }
  ],
  "sourceType": "script"
}
```