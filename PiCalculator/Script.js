var csd = {
    onRun: false,
    mterm: 0,
    ps: false,
    term: 1,
    dly: 1,
    typ: 1,
    rf: 10,
    echo: 0
}

function id(x) {
    return document.getElementById(x)
}

function setVal(x, y) {
    var z = Math.round(x / y * 100);
    if (z < 1) { z = 0 } else { z = z * 6 + 10 };
    document.getElementById("prog").setAttribute("width", z);
}

function err(x) {
    id("err" + x).style.display = "inline";
}

var Pi = 0;
var TSet;

function pause() {
    switch (csd.ps) {
        case false:
            csd.ps = true;
            id("ps").value = "Continue";
            id('ps').style.backgroundColor = "green";
            clearInterval(TSet);
            console.
            break;
        case true:
            csd.ps = false;
            id("ps").value = "Pause";
            id('ps').style.backgroundColor = "blue";
            TSet = setInterval(function () { termfunc() }, csd.dly);
            break;
    }
}

function Control() {
    switch (csd.onRun) {
        case false:
            //Setvar
            csd.onRun = true;
            setVal(0, 0);
            csd.mterm = Number(id("TermIn").value);
            csd.dly = Number(id("dly").value);
            csd.typ = Number(id("typ").value);
            csd.rf = Number(id("rf").value);
            csd.echo = Number(id("echo").value);
            id("dtls").innerHTML = "Prosessing...";

            if (csd.typ == 1) {
                Pi = 3;
            } else {
                Pi = 0;
            }
            //Runstyle
            id("progBar").style.display = "block";
            id("val").innerHTML = "";
            id("Control").value = "Stop Exicution";
            id('Control').style.backgroundColor = "red";

            TSet = setInterval(function () { termfunc() }, csd.dly);
            break;
        case true:
            //Resetvar
            csd.onRun = false;
            clearInterval(TSet);
            if (csd.term < csd.mterm) {
                listData("red");
            }
            csd.term = 1;
            Pi = 0;

            //Resetstyle
            id("progBar").style.display = "none";
            id('Control').style.backgroundColor = "green";
            id("Control").value = "Run Again";
            break;
    }
}

function termfunc() {
    //Equation
    var n = csd.term * 2;
    if (csd.typ == 2) {
        Pi += 4 / (n - 3) - 4 / (n - 1);
    } else {
        Pi += (4 / (n * (n + 1) * (n + 2))) * Math.pow(-1,(n/2)) * (-1);
    }
    if (csd.term % csd.rf == 0) {
        refresh();
    }
    csd.term++;
    if (csd.term > csd.mterm) {
        listData("green");
        Control();
        return;
    }
}

function refresh() {
    id("pi").innerHTML = Pi;
    setVal(csd.term, csd.mterm);
    id("termO").innerHTML = csd.term + "/" + csd.mterm;
    switch (csd.echo) {
        case 1:
            id("val").innerHTML += "<tr><td>" + Pi + "</td></tr>";
            break;
        case 2:
            id("val").innerHTML += '<tr><td class="a">' + csd.term + "</td><td>" + Pi + "</td></tr>";
            break;
        case 3:
            id("val").innerHTML += '<tr><td class="a">' + csd.term + "</td></tr>";
    }
    if (csd.echo == 1) {
       
    }
}

function listData(params) {
    var c;
    var pc = Math.PI - Pi;
    var typ;
    if (csd.typ == 1) {
        typ = "Nilakantha";
    } else {
        typ = "Gregory-Libeniz";
    }
    if (params == "green") {
        c = "Congragulations! sigma completed with " + csd.mterm + " terms";
    } else {
        c = "Sigma Aborted! " + csd.term + "/" + csd.mterm + " completed (" + Math.round(csd.term / csd.mterm * 100) + "%)"
    }
    var rt = "Actual: " + Math.PI + "<br />Accuracy: " + pc + "<br />";
    rt += c + "<br /> Using " +
        typ + " infinte series.";
    id("dtls").innerHTML = '<span style="color:' + params + '">' + rt + "</span>";
}