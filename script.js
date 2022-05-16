const seq = document.getElementById("seq");
const result = document.getElementById("result");
const keybd = document.getElementById("keyboard");
const btRadian = document.getElementById("radian");
const hist = document.getElementById("history");

let expr = "";
let decimal = false;
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
    if (expr[l - 1] == " ")
        l--;
    const last = (l > 0) ? expr[l - 1] : null;
    let value = el.getAttribute("data-value");
    switch (type) {
        case "a":
            if (value == "l")
                seq.scrollBy(-40,0);
            else
                seq.scrollBy(40,0);
            return;
        case "b":
            if (expr[l - 1] == " ")
                l--;
            l--;
            if (last == ".") {
                let laux = l;
                decimal = false;
                while ((laux > 0) && (expr[laux - 1] == "0"))
                    laux--;
                if (!/[1-9]/.test(expr[laux - 1]))
                    l = laux;
            }
            else if (last == ")")
                openPar++;
            else if ((last == "(") || /[a-z]/.test(last)) {
                if (last == "(")
                    openPar --;
                while ((l > 0) && (/[a-z]/.test(expr[l - 1])))
                    l--;
            }
            expr = expr.slice(0,l);
            break;
        case "c":
            seq.textContent = "0";
            result.textContent = "0";
            expr = "";
            decimal = false;
            openPar = 0;
            return;
        case "d":
            if (!decimal) {
                if (/[ei)%]/.test(last))
                    return;
                else if (!last || (last == "(") || (/[+\-*/d^]/.test(last)))
                    expr += "0.";
                else
                    expr += ".";
                decimal = true;
            }
            break;
        case "e":
            if (expr == "")
                break;
            result.textContent = parse();
            updateHistory(expr, result.textContent);
            expr = "";
            decimal = false;
            openPar = 0;
            return;
        case "h":
            hist.classList.add("history--on");
            break;
        case "n":
            if (/[ei)%]/.test(last))
                return;
            if ((/[0-9]/.test(last)) && (/[ep]/.test(value[0])))
                return;
            if (!/[0-9.]/.test(last) && (value == "0")) {
                expr += "0.";
                decimal = true;
            }
            else
                expr += value;
            break;
        case "o":
            if (/[(.]/.test(last))
                return;
            if (/[+\-*/d^]/.test(last)) {
                while (expr[l - 1] != " ")
                    l--;
                expr = expr.slice(0,l) + value + " ";
            }
            else {
                if (expr == "")
                    expr += "0";
                expr += " " + value + " ";
            }
            decimal = false;
            break;
        case "u":
        case "t":
            if (/[0-9ei.)%]/.test(last))
                return;
            decimal = false;
            openPar++;
            expr += value;
            break;
        case "p":
            if ((expr == "") || (last == "(")) {
                expr += "(";
                openPar++;
            }
            else if (/[+\-*/d^]/.test(last)) {
                expr += " (";
                openPar++;
            }
            else if (openPar > 0) {
                expr += ")";
                openPar--;
            }
            else {
                openPar = 1;
                expr += " * (";
            }
            break;
        case "r":
            btRadian.classList.toggle("radian-on");
            radian = !radian;
            break;
        case "s":
            while ((l > 0) && (/[0-9pie.%\s)]/.test(expr[l - 1])))
                l--;
            if (l == 0) {
                expr = "-" + expr;
                break;
            }
            l--;
            switch (expr[l]) {
                case "(":
                    expr = expr.slice(0,l+1) + "-" + expr.slice(l+1);
                    break;
                case "+":
                    expr = expr.slice(0,l) + "-" + expr.slice(l+1);
                    break;
                case "-":
                    if (expr[l + 1] == " ") //binary -
                        expr = expr.slice(0,l) + "+" + expr.slice(l+1);
                    else //unary -    
                        expr = expr.slice(0,l) + expr.slice(l+1);
                    break;
                default:
                    expr = expr.slice(0,l+2) + "-" + expr.slice(l+2);
                    break;
            }
            break;
        case "%":
            if (/[.+\-*/d(^%]/.test(last))
                return;
            decimal = false
            expr += value;
            break;
    }
    if (expr == "") {
        seq.textContent = "0";
        result.textContent = "0";
    }
    else {
        seq.textContent = expr.trimEnd();
        result.textContent = parse();
        seq.scrollTo(seq.scrollWidth,0);
        result.scrollTo(result.scrollWidth,0);
    }
}

function parse() {
    let input = expr.slice(0);
    function getToken() {
        if (input == "")
            return "";
        let c = input[0];
        let token;
        if (/[0-9]/.test(c)) {
            let l = 0;
            do {
                l++;
            } while ((l < input.length) && /[0-9.]/.test(input[l]));
            token = input.slice(0,l);
            input = input.slice(l).trimStart();
            return token;
        }
        else if (/[+\-*/^%()]/.test(c)) {
            input = input.slice(1).trimStart();
            return c;
        }
        else if (c == "m") { //mod
            token = input.slice(0,3);
            input = input.slice(4);
            return token;
        }
        else { // "wordy" operators
            let l = 0;
            do {
                l++;
            } while ((l < input.length) && /[a-z]/.test(input[l]));
            token = input.slice(0,l);
            input = input.slice(l);
            return token;
        }
    }
    function E() {
        let vt = T();
        let vel = El();
    }
    function El() {
        let op = getToken();
        if (op == "")
            return;
        else {
            let vt = T();
            let vel = El();
        }
    }
    function T() {
        let vf = F();
        let vtl = Tl();
    }
    function Tl() {
        let op = getToken();
        if (op == "")
            return;
        else {
            let vf = F();
            let vtl = Tl();
        }
    }
    function F() {
        let vb = B();
        let vfl = Fl();
    }
    function Fl() {
        let op = getToken();
        if (op == "")
            return;
        else {
            let vb = B();
            let vfl = Fl();
        }
    }
    function B() {
        let token = getToken();

    }
    let token = [];
    while (input.length > 0) {
        token.push(getToken());
    }
    return token;
}

function updateHistory(first, second, newItem = true) {
    const histItem = document.createElement("li");
    const firstPart = document.createElement("span");
    const secondPart = document.createElement("span");
    const thirdPart = document.createElement("span");
    histItem.classList.add("history__item");
    histItem.setAttribute("tabindex","0");
    histLength++;
    if (histLength > 100) {
        histArray.shift();
        hist.removeChild(hist.lastElementChild);
    }
    firstPart.textContent = `${histLength}. ${first}`;
    secondPart.textContent = ` = ${second}`;
    thirdPart.textContent = "\u{1F5D1}";
    firstPart.classList.add("no-pointer");
    secondPart.classList.add("no-pointer");
    secondPart.classList.add("history__highlight");
    thirdPart.classList.add("trash");
    thirdPart.setAttribute("data-li", String(histLength));
    histItem.appendChild(firstPart);
    histItem.appendChild(secondPart);
    histItem.appendChild(thirdPart);
    hist.children[0].insertAdjacentElement("afterend",histItem);
    if (newItem)
        histArray.push([first, second]);
}

//Events

//Load history
window.addEventListener("load", () => {
    histArray = JSON.parse(localStorage.getItem("history")) ?? [];
    for (let i of histArray)
        updateHistory(i[0], i[1], false);
});
//Save history
window.addEventListener("beforeunload", () => {
    localStorage.setItem("history", JSON.stringify(histArray));
});
//Keyboard buttons
keybd.addEventListener("click", btClick);
//History -> Back
hist.children[0].children[0].addEventListener("click", ev => {
    hist.classList.remove("history--on");
    ev.stopPropagation();
});
//History -> Clear
hist.children[0].children[1].addEventListener("click", ev => {
    localStorage.removeItem("history");
    histArray = [];
    histLength = 0;
    hist.replaceChildren(hist.children[0]);
    ev.stopPropagation();
});
//History -> Retrieve
hist.addEventListener("dblclick", ev => {
    const el = ev.target;
    const num = el.children[1].textContent.slice(3);
    const l = expr.length;
    const last = (l > 0) ? expr[l - 1] : null;
    if (/[ei)]/.test(last))
        return;
    expr += num;
    seq.textContent = expr;
    hist.classList.remove("history--on");
});
//History -> Delete
hist.addEventListener("click", ev => {
    const el = ev.target;
    const item = Number(el.getAttribute("data-li")) - 1;
    if (!el.classList.contains("trash"))
        return;
    histArray.splice(item, 1);
    //Rebuild history
    histLength = 0;
    hist.replaceChildren(hist.children[0]); 
    for (let i of histArray)
        updateHistory(i[0], i[1], false);
});