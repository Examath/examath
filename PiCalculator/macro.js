//script
var csd = {
    onRun: false,
    mterm: 0,
    term: 1,
    dly: 1,
    //echo: false,
    typ: 1
}

function id(x) {
    return document.getElementById(x)
}

var PI_Prog = 0;
var TSet;
var n;

function Control() {
    switch (csd.onRun) {
        case false:
            csd.onRun = true;
            //csd.echo = id("Echo_true").checked;
            csd.typ = Number(id("typ").value);
            csd.mterm = Number(id("TermIn").value);
            csd.dly = Number(id("dly").value);
            if (csd.typ = 1) {
                PI_Prog = 3;
                csd.term = 2;
            }
            id("progBar").style.display = "block";
            id('Control').style.backgroundColor = "red";
            id("prog").max = csd.mterm;
            id("Control").value = "Stop Exicution";
            termFnc();
            break;
    
        case true:
            clearTimeout(TSet);
            csd.term = 1;
            PI_Prog = 0;
            csd.onRun = false;
            id("progBar").style.display = "none";
            id("Control").value = "Run Again";
            id('Control').style.backgroundColor = "green";
            break;
    }
}

function termFnc () {
    n = csd.term*4;
    switch (csd.typ) {
        case 2:
            PI_Prog += 4/(n-3) - 4/(n-1);
            break;
    
        case 1:
            PI_Prog += 4/((n-2)*(n-1)*n) - 4/(n*(n+1)*(n+2));
            break;
    }
    id("prog").value = csd.term;
    id("pi").innerHTML = PI_Prog;
    id("termO").innerHTML = csd.term + "/" + csd.mterm + " " + (csd.term/csd.mterm);
    csd.term++;
    if ((csd.term > csd.mterm - 1)) {
        Control();
        ListData();
        return;
    }
    id("errBar").innerHTML = "Error 103: $[UNI]";
}

function ListData() {
    var tn = csd.typ;
    var Ac = Math.PI - PI_Prog;
    id("dtls").innerHTML = "Command Finished<br />Command type: " +
    tn + "Amount of terms completed: " + csd.term + "/" + csd.mterm + "<br/>Accuracy to &pi;: " +
    Ac;
}