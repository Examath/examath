function check() {
    var n, fx;
    n = Number(id("terms").value) - Number(id("preEqu").value);
    if (n > 10000) {invalid("terms");} else {valid("terms");}

    fx = id("Equ").innerHTML;
    valid("Equ");

    try {
        n = eval(fx);
    } catch (error) {
        invalid("Equ");
        id("dts").innerHTML = error;
        id("dts").style.color = "red";
    }

    function valid(x) {
        document.getElementById(x).setAttribute("data-vs", "true");
    }

    function invalid(x) {
        document.getElementById(x).setAttribute("data-vs", "false");
    }
}