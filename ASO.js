function Check(e, val) {
    SwitchClass(e, "check", val);
    return (val) ? false : true;
}

function SwitchClass(e, clas, val) {
    if (val) {        
        e.classList.add(clas);
    } else {
        e.classList.remove(clas);
    }
}

function get(id) {
    return document.getElementById(id);
}