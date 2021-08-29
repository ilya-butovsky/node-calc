const readline = require('readline');
const Calculator = require("./lib/Calculator");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
/*
    Примеры выражений:
        2*2
        2.02*2.02
        -4*-4
        ((1123/22)+188-9*15*(10-5.101)+6.82*-3.02)-255.83+39*-2.45
 */
function requestExpression(){
    rl.question("Type the expression: ", (inputText)=>{
        if(inputText==="exit"){
            rl.close();
        }
        try {
            console.log(`Answer: ${Calculator.getValue(inputText, {
                "^":{ //Добавляем новые операция, не внося изменения исходного кода модуля
                    priority: 2,
                    result: (a,b)=>a**b
                }
            })}\n`)
        }
        catch (e){
            console.log(e.toString())
        }

        requestExpression();
    })
}

requestExpression();