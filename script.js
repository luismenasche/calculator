const calc = document.getElementById("calc");
const seq = document.getElementById("seq");
const result = document.getElementById("result");

let expr = "";
let decimal = false;
let par = 0; //0 = left, 1 = right
let openPar = 0;

function btClick(ev) {
    const el = ev.target;
    if (!el.classList.contains("button"))
        return;
    let type = el.getAttribute("data-type");
    let l = expr.length;
    let last = (l > 0) ? expr.trim()[l - 1] : null;
    switch (type) {
        case "b":
            expr = expr.slice(0,expr.length - 1);
            break;
        case "c":
            expr = "";
            seq.textContent = "0";
            result.textContent = "0";
            return;
        case "d":
            if (!decimal) {
                if (/[ei)]/.test(last))
                    return;
                else if (!last || /[(+\-*/d]/.test(last))
                    expr += "0.";
                else
                    expr += ".";
                decimal = true;
            }
            break;
        case "e":
            result.textContent = parse(0);
            expr = "";
            return;
        case "h":
            //to do
            break;
        case "n":
            if (/[ei)]/.test(last))
                return;
            par = 1;
            expr += el.getAttribute("data-value");
            break;
        case "o":
            if (/[(.+\-*/d]/.test(last))
                return;
            decimal = false;
            par = 0;
            expr += " " + el.getAttribute("data-value") + " ";
            break;
        case "u":
        case "t":
            if (/[0-9ei.)]/.test(last))
                    return;
            decimal = false;
            par = 0;
            openPar++;
            expr += el.getAttribute("data-value");
            break;
        case "p":
            if (!par) {
                expr += "(";
                openPar++;
            }
            else if (openPar > 0) {
                expr += ")";
                openPar--;
            }
            else {
                par = 0;
                openPar = 1;
                expr += "*(";
            }
            break;
        case "r":
            //to do
            break;
        case "s":
            //to do
            break;
        case "%":
            //to do
            break;
    }
    if (expr == "")
        seq.textContent = "0";
    else
        seq.textContent = expr;
    seq.scrollTo(seq.scrollWidth,0);
    result.textContent = String(parse(expr));
    result.scrollTo(result.scrollWidth,0);
}

function parse(expr) {
    if (expr == "0")
        return 1;
    else 
        return 0;
}

//Freeze the size of the components
seq.style.width = `${seq.offsetWidth}px`;
result.style.width = `${result.offsetWidth}px`;

calc.addEventListener("click", btClick);