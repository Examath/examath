var TSet, Ans, n, nval;

function Control() {
    switch (csd.run) {
        case false:
            csd.run = true;
            csd.formula = id("Equ").innerHTML;
            csd.aterm = Number(id("preEqu").value);
            csd.mterm = Number(id("terms").value) - csd.aterm;
            csd.term = 0;
            csd.dly = Number(id("dly").value);
            csd.rfs = Number(id("rfs").value);
            csd.rfsT = Number(id("output").value);
            
            if (csd.mterm > 10000) {
                var x = window.confirm(ftxt(1));
                if (x == false) {
                    csd.run = false;
                    break;
                }
            }

            csd.start = new Date().getTime();
            Ans = 0;
            setVal(csd.term, csd.mterm);

            id('Control').style.backgroundColor = "red";
            id("Control").value = "Stop";
            id("dts").innerHTML = "Prosessing...";
            id("tpp").innerHTML = "Click 'Stop' to stop";
            id("val").innerHTML = "";

            TSet = setInterval(function () { termfunc() }, csd.dly);
            console.info("Running..");
            break;
        case true:
            csd.run = false;
            clearInterval(TSet);
            id("ans").innerHTML = Ans;
            id('Control').style.backgroundColor = "green";
            id("Control").value = "Run Again";
            id("draw").style.display = "inline";
            if (csd.term > csd.mterm) {
                listData("green");
            } else {
                listData("red");
            }
            break;
    }
}

function termfunc() {
    n = csd.term + csd.aterm;
    nval = eval(csd.formula);
    Ans += nval;
    if (csd.term % csd.rfs == 0) {
        refresh();
    }
    csd.term++
    if (csd.term > csd.mterm) {
        Control();
        return;
    }
}

function listData(params) {
    var c, t;
    if (params == "green") {
        c = "Congragulations! sigma completed!";
        console.info("Sigma completed without error!");
    } else {
        c = "Sigma Aborted! " + Math.round(csd.term / csd.mterm * 100) + "% completed";
        console.info("Sigma aborted safely!");
    }
    id("dts").style.color = params;
    id("dts").innerHTML = c;
    t = new Date().getTime() - csd.start;
    id("tpp").innerHTML = "Total time: " + minsec(t) + " | Prosessing time: " + minsec(t-(csd.dly*csd.term)) + " | Average speed: " + (t/csd.term).toFixed(2) + "ms/t";
}