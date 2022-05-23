const seq = document.getElementById("seq");
const result = document.getElementById("result");
const keybd = document.getElementById("keyboard");
const btRadian = document.getElementById("radian");
const hist = document.getElementById("history");

let expr = "";
let token = [];
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
            if (expr[l - 1] == " ")
                l--;
            expr = expr.slice(0,l);
            break;
        case "c":
            seq.textContent = "0";
            result.textContent = "0";
            expr = "";
            token = [];
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
            token = [];
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
            if ((expr == "") || (last == "(") || (/[+\-*/d^]/.test(last))) {
                expr += "(";
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
        seq.scrollTo(seq.scrollWidth,0);
        result.textContent = parse();
    }
}

function parse() {
    console.clear();
    tokenize();
    let res = E();
    if (res == undefined)
        return 0;
    else
        return String(round(res, 6));
}

function tokenize() {
    let i = 0, c;
    token = [];
    while (i < expr.length) {
        c = expr[i];
        if (c == " ")
            c = expr[++i];
        if (c == undefined)
            break;
        if (/[0-9]/.test(c)) {
            let l = i;
            do {
                l++;
            } while ((l < expr.length) && /[0-9.]/.test(expr[l]));
            token.push(expr.slice(i,l));
            i = l;
        }
        else if (/[+\-*/^%()]/.test(c)) {
            token.push(c);
            i++;
        }
        else if (c == "m") { //mod
            token.push(expr.slice(i,i + 3));
            i += 3;
        }
        else { // "wordy" operators
            let l = i;
            do {
                l++;
            } while ((l < expr.length) && /[a-z(]/.test(expr[l]));
            token.push(expr.slice(i,l));
            i = l;
        }
    }
}

//l = false => grammar variable E
//l = true => grammar variable El
//+ and - should be calculated from left to right
function E(l = false) {
    let v1, v2, op, vec = [];
    console.log("E" + (l? "l: ": ": "), token);
    if (l) {
        op = token[0];
        if (!/[+-]/.test(op))
            return;
        vec.push(op);
        token.shift();    
    }
    v1 = T();
    if (v1 == undefined)
        return;
    vec.push(v1);
    v2 = E(true);
    if (v2 != undefined)
        vec = vec.concat(v2);
    if (l)
        return vec;
    else {
        let res = vec[0];
        for (let i = 1; i < vec.length; i += 2) {
            op = vec[i];
            switch (op) {
                case "+":
                    res += vec[i + 1];
                    break;
                case "-":
                    res -= vec[i + 1];
                    break;
            }
        }
        return res;
    }
}

//l = false => grammar variable T
//l = true => grammar variable Tl
//*, / and mod should be calculated from left to right
function T(l = false) {
    let v1, v2, op, vec = [];
    console.log("T" + (l? "l: ": ": "), token);
    if (l) {
        op = token[0];
        if (!/[*/]/.test(op) && (op != "mod"))
            return;
        vec.push(op);
        token.shift();    
    }
    v1 = F();
    if (v1 == undefined)
        return;
    vec.push(v1);
    v2 = T(true);
    if (v2 != undefined)
        vec = vec.concat(v2);
    if (l)
        return vec;
    else {
        let res = vec[0];
        for (let i = 1; i < vec.length; i += 2) {
            op = vec[i];
            switch (op) {
                case "*":
                    res *= vec[i+1];
                    break;
                case "/":
                    res /= vec[i+1];
                    break;
                case "mod":
                    if (res >= 0)
                        res %= vec[i + 1];
                    else
                        res = res % vec[i + 1] + vec[i + 1];
                    break;
            }
        }
        return res;
    }
}

//l = false => grammar variable F
//l = true => grammar variable Fl
//^ should be calculated from right to left
function F(l = false) {
    let v1, v2, op, vec = [];
    console.log("F" + (l? "l: ": ": "), token);
    if (l) {
        op = token[0];
        if (op != "^")
            return;
        vec.push(op);
        token.shift();    
    }
    v1 = B();
    if (v1 == undefined)
        return;
    v2 = F(true);
    if (v2 == undefined)
        return v1;
    else
        return v1 ** v2;
}

function B() {
    console.log("B | ", token);
    let tk = token[0];
    let v1;
    token.shift();
    if (tk == undefined)
        return;
    if (/[0-9]/.test(tk[0])) {
        console.log("B value: ", Number(tk));
        return Number(tk);
    }
    if (tk == "e")
        return Math.E;
    if (tk == "pi")
        return Math.PI;
    v1 = E();
    if (token[0] == ")")
        token.shift();
    if ((v1 == null) || (v1 == undefined))
        return v1;
    switch (tk) {
        case "(":
            return v1;
        case "sqrt(":
            return Math.sqrt(v1);
        case "fact(":
            return fact(v1);
        case "abs(":
            return Math.abs(v1);
        case "log(":
            return Math.log10(v1);
        case "ln(":
            return Math.log(v1);
        case "sin(":
            return Math.sin(v1);
        case "sinh(":
            return Math.sinh(v1);
        case "cos(":
            return Math.cos(v1);
        case "cosh(":
            return Math.cosh(v1);
        case "tan(":
            return Math.tan(v1);
        case "tanh(":
            return Math.tanh(v1);
        case "asin(":
            return Math.asin(v1);
        case "asinh(":
            return Math.asinh(v1);
        case "acos(":
            return Math.acos(v1);
        case "acosh(":
            return Math.acosh(v1);
        case "atan(":
            return Math.atan(v1);
        case "atanh(":
            return Math.atanh(v1);
    }
}

function fact(n) {
    let f = 1;
    if (n < 0)
        return 0;
    for (let i = 2; i <= n; i++)
        f *= i;
    return f;
}

function round(x, d) {
    return Math.round(x * (10 ** d)) / (10 ** d);
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