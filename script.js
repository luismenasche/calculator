function add(a,b) {
    return a + b;
}

function sub(a,b) {
    return a - b;
}

function mul(a,b) {
    return a * b;
}

function div(a,b) {
    if (b == 0) {
        return;
    }
    return a / b;
}

window.addEventListener("load", () => {
    const result = document.getElementsByClassName("result")[0];
    const calc = document.getElementsByClassName("calculator")[0];
    result.textContent = `${calc.offsetWidth} x ${calc.offsetHeight}`;
});