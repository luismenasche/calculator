const seq = document.getElementById("seq");
const result = document.getElementById("result");
const keybd = document.getElementById("keyboard");
const btRadian = document.getElementById("radian");
const hist = document.getElementById("history");

let expr = "";
let decimal = false;
let par = 0; //0 = left, 1 = right
let openPar = 0;
let radian = false;
let histLength = 0;
let histArray;

function btClick(ev) {
    const el = ev.target;
    if (!el.classList.contains("button"))
        return;
    const type = el.getAttribute("data-type");
    let l = expr.length;
    const last = (l > 0) ? expr[l - 1] : null;
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
            result.textContent = parse(0);
            updateHistory(expr, result.textContent);
            expr = "";
            decimal = false;
            par = 0;
            openPar = 0;
            return;
        case "h":
            hist.classList.add("history--on");
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
                expr += " * (";
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

function updateHistory(first, second, newItem = true) {
    const histItem = document.createElement("li");
    const firstPart = document.createElement("span");
    const secondPart = document.createElement("span");
    histItem.classList.add("history__item");
    histItem.setAttribute("tabindex","0");
    histLength++;
    if (histLength > 100) {
        histArray.shift();
        hist.removeChild(hist.lastElementChild);
    }
    firstPart.textContent = `${histLength}. ${first}`;
    secondPart.classList.add("history__highlight");
    secondPart.textContent = ` = ${second}`;
    histItem.appendChild(firstPart);
    histItem.appendChild(secondPart);
    histItem.addEventListener("dblclick", histRecover);
    hist.firstElementChild.insertAdjacentElement("afterend",histItem);
    if (newItem)
        histArray.push([first, second]);
}

function histRecover(ev) {
    const el = ev.currentTarget;
    const num = el.lastElementChild.textContent.slice(3);
    const l = expr.length;
    const last = (l > 0) ? expr[l - 1] : null;
    if (/[ei0-9.)]/.test(last))
        return;
    par = 1;
    if (/[+\-*/d]/.test(last))
        expr += " ";
    expr += num;
    seq.textContent = expr;
    hist.classList.remove("history--on");
}

//Freeze the size of the components
seq.style.width = `${seq.offsetWidth}px`;
result.style.width = `${result.offsetWidth}px`;
keybd.style.height = `${keybd.offsetHeight}px`;
keybd.style.width = `${keybd.offsetWidth}px`;
hist.style.height = `${keybd.offsetHeight}px`;
hist.style.width = `${keybd.offsetWidth}px`;

histArray = JSON.parse(localStorage.getItem("history")) ?? [];
//Load history
for (let i of histArray)
    updateHistory(i[0], i[1], false);

keybd.addEventListener("click", btClick);
hist.firstElementChild.addEventListener("click", () => {
    hist.classList.remove("history--on");
});
window.addEventListener("beforeunload", () => {
    localStorage.setItem("history", JSON.stringify(histArray));
});