const defaultOperations = { // Базоовый набор операций

    '+':{
        priority: 1,
        result: (a, b)=> a+b,
    },
    '-':{
        priority: 1,
        result: (a, b)=> a-b,
    },

    '*':{
        priority:2,
        result: (a, b)=>a*b,
    },
    '/':{
        priority:2,
        result: (a, b) => a/b,
    }

}


class Calculator{

    _value = undefined;

    constructor({expression, operations}){
        if(expression && typeof(expression)!=='string') throw new Error('expression must be a string');
        this._expression = expression ? expression.replace( /\s/g, '') : '';
        this._operations = { ...defaultOperations, ...operations }
        this._postfix = Calculator.getPostfix(this._expression, this._operations);
    }

    static _strExpressionToArray(expression, operations){ // Метод преобразования выражения из строки в массив
        let result = [];
        if(!expression.length) return [];
        if(expression[0]!=="(") expression = "0"+expression; // Чтобы не обрабатывать унарный минус в начале выражения
        let lpon = 0;
        let rpon = 0;
        let digits = 0;
        let float = false;
        let dInd = false;
        let minus = false;
        for(let index in expression){
            if(expression[index] === "."){ //Обработка вещественных чисел
                if(float) throw new Error("Wrong number format");
                dInd = true;
                float = true;
                if(digits){
                    let lStr = expression.substr(index-digits, digits);
                    lpon = parseInt(lStr);
                    digits=0;
                }
            }
            else if(expression.charCodeAt(index) >= 48 && expression.charCodeAt(index) <= 57 ){
                digits++;
                dInd = true;
            }
            else if([...Object.keys(operations),"(", ")"].indexOf(expression[index])!==-1){
                if(dInd){
                    if(digits){
                        if(!float){
                            let lStr = expression.substr(index-digits, digits);
                            lpon = parseInt(lStr);
                        }
                        else {
                            let rStr = expression.substr(index-digits, digits);
                            rpon = parseInt(rStr)/10**digits;
                        }
                    }
                    result.push(minus ? -(lpon+rpon) : lpon+rpon);
                    minus=false;
                    dInd = false;
                    float = false;
                    lpon = 0;
                    rpon = 0;
                    digits = 0;
                    result.push(expression[index]);

                }
                else {
                    if(expression[index]==="-" && expression[index-1]!==")"){ // Обпработка унарного минуса
                        minus=true;
                    }
                    else result.push(expression[index]);
                }
            }
            else throw new Error(`Unknown operation "${expression[index]}"`)

        }
        if(dInd){ // Обработка числа в конце выражения не попадает в цикл
            if(digits){
                if(!float){
                    let lStr = expression.substr(expression.length-digits, digits);
                    lpon = parseInt(lStr);
                }
                else {
                    let rStr = expression.substr(expression.length-digits, digits);
                    rpon = parseInt(rStr)/10**digits;
                }
            }
            result.push(minus ? -(lpon+rpon) : lpon+rpon);
        }
        return result;
    }

    static getPostfix(expression, operations){ // Метод класса для получения постфиксной записи
        let  fullOperations = { ...defaultOperations, ...operations};
        expression = expression ? expression.replace( /\s/g, '') : "";
        let expressionArray = this._strExpressionToArray(expression, fullOperations);
        let postfixArray = [];
        let operationStack = [];
        for(let element of expressionArray){
            if((!operationStack.length && typeof(element)!=="number")){
                operationStack.push(element);
            }
            else if(element === ")"){
                let findOpen = false;
                while (operationStack.length){
                    if(operationStack[operationStack.length-1]==="("){
                        findOpen = true;
                        operationStack.pop();
                        break;
                    }
                    else {
                        postfixArray.push(operationStack.pop());
                    }
                }
                if(!findOpen) throw new Error("Incorrect expression")
            }
            else if(typeof(element)==="number"){
                postfixArray.push(element);
            }
            else if(operationStack[operationStack.length-1]!=="(" && element !=="(" && (fullOperations[operationStack[operationStack.length-1]].priority >= fullOperations[element].priority)){
                const currentPriority = fullOperations[element].priority;
                while (operationStack.length &&
                        (operationStack[operationStack.length-1] !== "(" &&
                            currentPriority<=fullOperations[operationStack[operationStack.length-1]].priority))
                                postfixArray.push(operationStack.pop());
                operationStack.push(element);
            }
            else operationStack.push(element);
        }
        while (operationStack.length){
            postfixArray.push(operationStack.pop());
        }
        return postfixArray;
    }

    static getValue(expression, operations){ // Результат решения выражения
        let postfixArray = this.getPostfix(expression, operations);
        if(!postfixArray.length) return 0;
        let fullOperations = {...defaultOperations, ...operations};

        let resultArray = [];
        for(let element of postfixArray){
            if(typeof(element) === "number"){
                resultArray.push(element);
            }
            else {
                const rOp = resultArray.pop();
                const lOp = resultArray.pop();
                resultArray.push(fullOperations[element].result(lOp, rOp));
            }
        }
        return Math.floor(resultArray[0]*1000000)/1000000;
    }

    get postfix(){
        return this._postfix;
    }

    get value(){
        if(this._value === undefined){
            this._value = Calculator.getValue(this._expression, this._operations)
        }
        return this._value;
    }

}


module.exports = Calculator;