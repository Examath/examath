/**
 * Akin to C# DependencyProperty
 */
class Dependable {
    /**@private */
    Listeners = [];
    /**@private */
    value;
    /**
     * Creates a dependable variable
     * @param {*} value Sets the default value
     * @param {function} callback Adds a listener to the dependable's callback list
     */
    constructor(value, callback = undefined) {
        this.value = value;
        if (callback) {
            this.AddListener(callback);
        }
    }
    /**
     * Gets the value of this dependable, or 
     */
    get Value() {
        return this.value;
    }    
    /**
     * Sets the value of this dependable and calls all it's listeners
     */
    set Value(x) {
        this.value = x;
        this.Listeners.forEach((e) => {
            e();
        })
    }
    /**
     * Subscribes a listening method onto this dependable
     * @param {function} callback The function to run when called back
     */
    AddListener(callback) {
        this.Listeners.push(callback);
    }
}

/**
 * Marks a <input> element as a toggle button controling the specified dependable
 * @param {Element} e The input button element target
 * @param {Dependable} variable A object of the Dependable class of which the toggle button will toggle
 * @example <caption>To define a toggle button, call this function in the onload of a input[type=button]</caption>
 * <input type="button" onload="MarkAsToggle(this, Dep)"/>
 */
function MarkAsToggle(e, variable) {
    e.classList.add("toggle");
    e.addEventListener("click", function () {
        variable.Value = (variable.Value) ? false : true;
    })
    variable.AddListener(function () {        
        SwitchClass(e, "check", variable.Value);
    })
}
/**
 * Flips a toggle input and a variable.
 * @param {Element} e input.toggle target element
 * @param {Boolean} val Initial value
 * @returns {Boolean} Changed value
 * @deprecated since Dependenable Class update
 */
function Check(e, val) {
    SwitchClass(e, "check", val);
    return (val) ? false : true;
}

/**
 * Adds or removes a class
 * @param {Element} e Target element
 * @param {String} clas Class to add or remove
 * @param {Boolean} val True to add, false to remove
 */
function SwitchClass(e, clas, val) {
    if (val) {
        e.classList.add(clas);
    } else {
        e.classList.remove(clas);
    }
}

/**
 * Similar to{@link document.getElementById}
 * @param {String} id Id of target element
 */
function Get(id) {
    return document.getElementById(id);
}

/**
 * Get the value of a meta tag
 * @param {String} name Name of meta tag
 * @param {String} def Value to return if that tag does not exist
 * @returns Content of meta tag
 */
function GetMeta(name, def) {
    var el = document.querySelector(`meta[name="${name}"]`);
    if (el) {
        return el.getAttribute('content');
    }
    return def;
}

var A = {
    Root: document.querySelector(":root"),
    X: 0
}

/**
 * For ASO.css
 * Randomly changes interface colours
 */
function Disco() {
    A.X = setInterval(() => {
        var r = Math.round(Math.random() * 360);
        A.Root.style.setProperty("--Background", HslToHex(r, 100, 25));
        A.Root.style.setProperty("--Foreground", HslToHex(r + 180, 100, 75));
        A.Root.style.setProperty("--Background", HslToHex(r + 90, 100, 50));
        A.Root.style.setProperty("--Panel", HslToHex(r + -90, 100, 50));
        A.Root.style.setProperty("--Panel2", HslToHex(r + 35, 100, 50));
        A.Root.style.setProperty("--PanelFaint", HslToHex(r + 225, 100, 50));
    }, 250);
    return "You asked for it!";
}

/**
 * Converts HSL values into RGB hexadecimal
 * @param {number} h Hue in degrees
 * @param {number} s Saturation in percent
 * @param {number} l Luminosity in percent
 * @author icl7126 on Stack Overflow
 * @returns Hexadecimal colour
 */
function HslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}
// Footer
document.addEventListener("DOMContentLoaded", () => {
    // Version Info
    var vstr = "";
    var vel = document.querySelector(`meta[name="version"]`);
    if (vel) {
        vstr = " | Version " + vel.getAttribute('content');
    }
    document.body.innerHTML += `<div class="notice" title="This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.">Copyright &copy; <a href="https://github.com/alphax10">Paul Cyril</a> ${GetMeta("year", "2021")}</a>, <a href="https://www.gnu.org/licenses/old-licenses/gpl-2.0-standalone.html">GNU GPL v2.0</a>${vstr}</div>`;    
    // Onload on input
    document.querySelectorAll("input[onload]").forEach(function (e) {
        e.dispatchEvent(new Event("load"));
    })
    //
    console.log("ASO.js loaded")
})