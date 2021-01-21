function add() {
    id("Equ").innerHTML = id("tmp").value;
}

function out(params) {
    id("val").innerHTML += "<tr>" + params + "</tr>";
}

function pon() {
    if (nval >= 0) {
        return "+" + nval.toString();
    } else {
        return nval.toString();
    }
}

function refresh() {
    var lrf;
    id("ans").innerHTML = Ans;
    setVal(csd.term, csd.mterm);
    switch (csd.rfsT) {
        case 1:
            out('<td>Term </td><td class="r">' + csd.term + ':</td><td class="r">' + Ans 
            + '</td><td class="r">(' + pon() + ')</td><td> | n = </td><td class="r">' + n + '</td>');
            break;
        case 2:
            out('<td>' + n + '</td>');
            break;
        case 3:
            out('<td>' + nval + '</td>');
            break;
        case 4:
            out('<td>' + Ans + '</td>');
            break;
        case 5:
            
            break;
    }
}