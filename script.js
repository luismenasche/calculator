const seq = document.getElementById("seq");
const result = document.getElementById("result");
const keybd = document.getElementById("keyboard");
const btRadian = document.getElementById("radian");
const history = document.getElementById("history");

let expr = "";
let decimal = false;
let par = 0; //0 = left, 1 = right
let openPar = 0;
let radian = false;

function btClick(ev) {
    const el = ev.target;
    if (!el.classList.contains("button"))
        return;
    let type = el.getAttribute("data-type");
    let l = expr.length;
    let last = (l > 0) ? expr[l - 1] : null;
    switch (type) {
        case "a":
            if (el.getAttribute("data-value") == "l")
                seq.scrollBy(-40,0);
            else
                seq.scrollBy(40,0);
            return;
        case "b":
            l--;
            if (last == ".")
                decimal = false;
            else if (last == ")")
                openPar++;
            else if ((last == "(") || /[a-z]/.test(last)) {
                if (last == "(")
                    openPar --;
                while ((l > 0) && (/[a-z]/.test(expr[l - 1])))
                    l--;
            }
            expr = expr.slice(0,l).trim();
            break;
        case "c":
            if (seq.textContent == "0")
                result.textContent = "0";
            else
                seq.textContent = "0";
            expr = "";
            decimal = false;
            par = 0;
            openPar = 0;
            return;
        case "d":
            if (!decimal) {
                if (/[ei)]/.test(last))
                    return;
                else if (!last || (last == "("))
                    expr += "0.";
                else if (/[+\-*/d]/.test(last))
                    expr += " 0.";
                else
                    expr += ".";
                decimal = true;
            }
            break;
        case "e":
            let histItem = document.createElement("li");
            let firstPart = document.createElement("span");
            let secondPart = document.createElement("span");
            let res = parse(0);
            histItem.classList.add("history__item");
            histItem.setAttribute("tabindex","0");
            firstPart.textContent = String(expr);
            secondPart.classList.add("history__highlight");
            secondPart.textContent = ` = ${res}`;
            histItem.appendChild(firstPart);
            histItem.appendChild(secondPart);
            history.insertBefore(histItem, history.lastElementChild);
            result.textContent = res;
            expr = "";
            decimal = false;
            par = 0;
            openPar = 0;
            return;
        case "h":
            history.classList.add("history--on");
            break;
        case "n":
            if (/[ei)]/.test(last))
                return;
            par = 1;
            if (/[+\-*/d]/.test(last))
                expr += " ";
            expr += el.getAttribute("data-value");
            break;
        case "o":
            if (/[(.+\-*/d]/.test(last))
                return;
            decimal = false;
            par = 0;
            if (expr == "")
                expr += "0";
            expr += " " + el.getAttribute("data-value");
            break;
        case "u":
        case "t":
            if (/[0-9ei.)]/.test(last))
                return;
            decimal = false;
            par = 0;
            openPar++;
            if (/[+\-*/d]/.test(last))
                expr += " ";
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
            btRadian.classList.toggle("radian-on");
            radian = !radian;
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
        return 2;
}

//Freeze the size of the components
seq.style.width = `${seq.offsetWidth}px`;
result.style.width = `${result.offsetWidth}px`;
keybd.style.height = `${keybd.offsetHeight}px`;
keybd.style.width = `${keybd.offsetWidth}px`;
history.style.height = `${keybd.offsetHeight}px`;
history.style.width = `${keybd.offsetWidth}px`;

keybd.addEventListener("click", btClick);
history.lastElementChild.addEventListener("click", () => {
    history.classList.remove("history--on")
});