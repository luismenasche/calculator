const calc = document.getElementById("calc");
const seq = document.getElementById("seq");
const result = document.getElementById("result");

let expr = "0";
let decimal = false;
let par = 0, parBalance = 0;

function btClick(ev) {
    const el = ev.target;
    if (!el.classList.contains("button"))
        return;
    let type = el.getAttribute("data-type");
    switch (type) {
        case "b":
            expr = expr.slice(0,expr.length - 1);
            if (expr == "")
                expr = "0";
            break;
        case "c":
            expr = "0";
            result.textContent = "0";
            break;
        case "d":
            if (!decimal) {
                expr += ".";
                decimal = true;
            }
            break;
        case "e":
            result.textContent = parse(0);
            seq.textContent = "0";
            expr = "0";
            return;
        case "h":
            //to do
            break;
        case "n":
            par = 1;
            if (expr != "0")
                expr += el.getAttribute("data-value");
            else
                expr = el.getAttribute("data-value");
            break;
        case "o":
        case "t":
            decimal = false;
            par = 0;
            expr += el.getAttribute("data-value");
            break;
        case "p":
            if (!par) {
                expr += "(";
                parBalance++;
            }
            else if (parBalance > 0) {
                expr += ")";
                parBalance--;
            }
            else {
                par = 0;
                parBalance = 1;
                expr += "*(";
            }
            break;
        case "r":
            //to do
            break;
    }
    seq.textContent = expr;
    result.textContent = parse(expr);
}

function parse(expr) {
    if (expr == "0")
        return "1";
    else 
        return "0";
}

calc.addEventListener("click", btClick);