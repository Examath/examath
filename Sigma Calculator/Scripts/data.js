function id(x) {
    return document.getElementById(x)
}

var csd = {
    "run": false,
    "formula": "",
    "term": 0,
    "mterm": 0,
    "dly": 1,
    "rfs": 1,
    "rfsT": 1,
    "dt": false,
    "start": 0
}

function ftxt (pty) {
    var txt;
    switch (pty) {
        case 1:
            txt = "Danger: Completing the Sigma with " + csd.mterm + 
            " terms will be very dangerous!\nMake sure the number abowe the sigma is less than Ten Thousand\nAre you sure you want to continue?";
            break;
    }
    return txt;
}


function setVal(x, y) {
    var z = Math.round(x / y * 100);
    if (z < 1) { z = 0 } else { z = z * 6 + 10 };
    document.getElementById("prog").setAttribute("width", z);
    document.getElementById("termO").innerHTML = x + "/" + y;
}

function dt() {
    switch (csd.dt) {
        case false:
            id("progBar").style.display = "block";
            csd.dt = true;
            id("dt").innerHTML = "- Less";
            break;
        case true:
            id("progBar").style.display = "none";
            csd.dt = false;
            id("dt").innerHTML = "+ More";
            break;
    }
}

function minsec(params) {
    params /= 1000;
    var m = Math.floor(params / 60);
    var s = params - (m * 60);
    if (m == 0) {
        return s + " seconds";
    }
    return m + " minutes and " + s.toFixed(4) + " seconds";
}