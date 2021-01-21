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

function Get(id) {
    return document.getElementById(id);
}

function GetMeta(name, def) {
    var el = document.querySelector(`meta[name="${name}"]`);
    if (el) {
        return el.getAttribute('content');
    }
    return def;
}

document.body.innerHTML += `<div class="notice" title="This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.">Copyright &copy; <a href="https://github.com/alphax10">Paul Cyril</a> ${GetMeta("year","2021")}</a>, <a href="https://www.gnu.org/licenses/old-licenses/gpl-2.0-standalone.html">GNU GPL v2.0</a></div>`;