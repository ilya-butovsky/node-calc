const Calculator = require("../lib/Calculator");
require('chai/register-expect');
describe("Calculator", ()=> { // mocha test runner
    describe("#getPostfix", () => {
        it("Get correct postfix", () => {
            const params = [
                {
                    expression: undefined,
                    operations: undefined,
                    expect: [],
                    type: "equal"
                },
                {
                    expression: "",
                    operations: undefined,
                    expect: [],
                    type: "equal"
                },
                {
                    expression: "undefined",
                    operations: undefined,
                    expect: `Unknown operation "u"`,
                    type: "throw"
                },
                {
                    expression: "2+2",
                    operations: undefined,
                    expect: [2, 2, "+"],
                    type: "equal"
                },
                {
                    expression: "2+4",
                    operations: undefined,
                    expect: [2, 4, "+"],
                    type: "equal"
                },
                {
                    expression: "2*4+5",
                    operations: undefined,
                    expect: [2, 4, "*", 5, "+"],
                    type: "equal"
                },
                {
                    expression: "2^4+5",
                    operations: undefined,
                    expect: `Unknown operation "^"`,
                    type: "throw"
                },
                {
                    expression: "2^4+5",
                    operations: {
                        "^": {
                            priority: 2,
                            result: (a, b) => a ** b
                        }
                    },
                    expect: [2, 4, "^", 5, "+"],
                    type: "equal"
                },
                {
                    expression: "(6+10.06-4)/(1+1*2)+1",
                    operations: undefined,
                    expect: [6, 10.06, "+", 4, "-", 1, 1, 2, "*", "+", "/", 1, "+"],
                    type: "equal"
                },
            ];
            params.forEach(param => {
                if (param.type === "equal") {
                    expect(Calculator.getPostfix(param.expression, param.operations)).to.eql(param.expect);
                } else if (param.type === "throw") {
                    expect(() => {
                        Calculator.getPostfix(param.expression, param.operations)
                    }).to.throw(param.expect);
                }
            })
        })
    })
    describe("#getValue", () => {
        it("Get correct value", ()=>{
            const params = [
                {
                    expression: undefined,
                    operations: undefined,
                    expect: 0,
                    type: "equal"
                },
                {
                    expression: "",
                    operations: undefined,
                    expect: 0,
                    type: "equal"
                },
                {
                    expression: "undefined",
                    operations: undefined,
                    expect: `Unknown operation "u"`,
                    type: "throw"
                },
                {
                    expression: "2+2",
                    operations: undefined,
                    expect: 4,
                    type: "equal"
                },
                {
                    expression: "2+4",
                    operations: undefined,
                    expect: 6,
                    type: "equal"
                },
                {
                    expression: "2*4+5",
                    operations: undefined,
                    expect: 13,
                    type: "equal"
                },
                {
                    expression: "2^4+5",
                    operations: undefined,
                    expect: `Unknown operation "^"`,
                    type: "throw"
                },
                {
                    expression: "2^4+5",
                    operations: {
                        "^": {
                            priority: 2,
                            result: (a, b) => a ** b
                        }
                    },
                    expect: 21,
                    type: "equal"
                },
                {
                    expression: "(6+10.06-4)/(1+1*2)+1",
                    operations: undefined,
                    expect: 5.02,
                    type: "equal"
                },
            ];
            params.forEach(param => {
                if (param.type === "equal") {
                    expect(Calculator.getValue(param.expression, param.operations)).to.eql(param.expect);
                } else if (param.type === "throw") {
                    expect(() => {
                        Calculator.getValue
                        (param.expression, param.operations)
                    }).to.throw(param.expect);
                }
            })
        })
    })
})