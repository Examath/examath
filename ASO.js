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
        if (this.value != x) {
            this.value = x;
            this.Listeners.forEach((e) => {
                e();
            })
        }
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
 * Marks a <input> element as a Toggle button controling the specified dependable
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
    SwitchClass(e, "check", variable.Value);
}

/**
 * Marks a <input> element as a Choice button, akin to a radio box element, controling the specified dependable.
 * All Choice buttons controlling the same Dependable should be next to each other.
 * @param {Element} e The input button element target with the attribute data-value, defining the value the Choice will set it's Dependable to when clicked
 * @param {Dependable} variable A object of the Dependable class of which the toggle button will toggle 
 * @example <caption>To define a choice button, call this function in the onload of a input[type=button]. Remember to define it's value in the attribute data-value.</caption>
 * <input type="button" data-value="A" onload="MarkAsChoice(this, Dep)"/>
 * <input type="button" data-value="B" onload="MarkAsChoice(this, Dep)"/>
*/
function MarkAsChoice(e, variable) {
    e.classList.add("choice");
    e.addEventListener("click", function () {
        variable.Value = e.dataset.value;
    })
    variable.AddListener(function () {
        SwitchClass(e, "check", (variable.Value == e.dataset.value))
    })
    SwitchClass(e, "check", (variable.Value == e.dataset.value))
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
 * Function run after ASO.js is loaded
 */
var Loaded;

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

const A = {
    Root: document.querySelector(":root"),
    X: 0,
    Y: 0,
    MouseX: 0,
    MouseY: 0,
    PanelRoot: null, // For panel (avalon dock) element
    Sections: null, // List of sections (windows) inside panel
    MovingSection: null, // Section that is being dragged
    PanelRect: null, // Overlay?? for panel element
    /**
     * Return the index of the greatest number in an array
     * @param {Number[]} array 
     */
    Highest: function (array) {
        var I = 0;
        var Max = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i] > Max) {
                Max = array[i];
                I = i;
            }
        }
        return I;
    },
    /**
     * Return the index of the lowest number in an array
     * @param {Number[]} array 
     */
    Lowest: function (array) {
        var I = 0;
        var Max = Infinity;
        for (let i = 0; i < array.length; i++) {
            if (array[i] < Max) {
                Max = array[i];
                I = i;
            }
        }
        return I;
    },
    Theme: {
        /**
         * Set style to ASO-L.css (light theme)
         */
        Light: function () {
            A.Theme.Root.href = A.Theme.Root.href.replace(/ASO(.*)/g, "ASO-L.css");
        },
        /**
         * Set style to ASO.css (default, dark theme)
         */
        Dark: function () {
            A.Theme.Root.href = A.Theme.Root.href.replace(/ASO(.*)/g, "ASO.css");
        },
        /**
         * For ASO.css
         * Randomly changes interface colours
         */
        Disco: function () {//document.getElementById("asostyle");
            A.X = setInterval(() => {
                var r = Math.round(Math.random() * 360);
                A.Root.style.setProperty("--Background", A.HslToHex(r, 100, 25));
                A.Root.style.setProperty("--Foreground", A.HslToHex(r + 180, 100, 75));
                A.Root.style.setProperty("--Background", A.HslToHex(r + 90, 100, 50));
                A.Root.style.setProperty("--Panel", A.HslToHex(r + -90, 100, 50));
                A.Root.style.setProperty("--Panel2", A.HslToHex(r + 35, 100, 50));
                A.Root.style.setProperty("--PanelFaint", A.HslToHex(r + 225, 100, 50));
            }, 250);
            return "You asked for it!";
        },
        Root: null,
    },
    /**
     * Converts HSL values into RGB hexadecimal
     * @param {number} h Hue in degrees
     * @param {number} s Saturation in percent
     * @param {number} l Luminosity in percent
     * @author icl7126 on Stack Overflow
     * @returns Hexadecimal colour
     */
    HslToHex: function (h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    },
    PanelDivsDirSet: function (e) {
        var childdir = (!(e.dataset.dir == "vertical"));
        e.childNodes.forEach(element => {
            if (element.nodeName == "DIV") {
                element.dataset.dir = (childdir) ? "vertical" : "horizontal";
                A.PanelDivsDirSet(element);
            }
        });
    },
    PanelDivsDirVir: function (e) {
        var childdir = (!(e.dataset.dir == "vertical"));
        e.childNodes.forEach(element => {
            if (element.nodeName == "DIV") {
                if((element.dataset.dir == "vertical") != (childdir)) {
                    console.error("Panel formating error", element);
                };
                A.PanelDivsDirVir(element);
            }
        });
    }
}
// Footer
document.addEventListener("DOMContentLoaded", () => {
    // Version Info and Styling
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

    // Definitions
    A.Sections = document.querySelectorAll("div.panel section");
    A.PanelRoot = document.querySelector("div.panel");
    A.Theme.Root = document.querySelector(`link[href$="ASO.css"]`);

    // Panel
    var i = 0;
    A.Sections.forEach(function (e) {
        var el = document.createElement("header");
        el.innerHTML = e.dataset.name;
        e.prepend(el);

        //if (!e.id) e.id = i + "Section";
        e.draggable = true;
        e.addEventListener("dragstart", function (event) {
            console.log(event);
            A.MovingSection = event.target;
            A.MovingSection.style.opacity = 0.3;
        })
        i++;
    })

    if (A.PanelRoot) { // If a panel exists
        A.PanelRect = document.createElement("div");
        A.PanelRect.id = "PanelUIRect";
        document.body.appendChild(A.PanelRect);
        A.PanelRoot.children[0].dataset.super = "True";
        if (A.PanelRoot.children[0].dataset.dir == undefined) A.PanelRoot.children[0].dataset.dir = "horizontal";
        A.PanelDivsDirSet(A.PanelRoot.children[0]);
    }

    // Blue UI Ques when dragging panel
    window.addEventListener("dragover", function (event) {
        var Panel = A.PanelRoot.getBoundingClientRect();
        if (event.pageX > Panel.left && event.pageX < Panel.right && event.pageY > Panel.top && event.pageY < Panel.bottom) {
            for (let i = 0; i < A.Sections.length; i++) {
                if (A.Sections[i].dataset.name == A.MovingSection.dataset.name) continue;
                var Section = A.Sections[i].getBoundingClientRect();
                if (event.pageX > Section.left && event.pageX < Section.right && event.pageY > Section.top && event.pageY < Section.bottom) {
                    var DistSet = [
                        event.pageY - Section.top,
                        Section.right - event.pageX,
                        Section.bottom - event.pageY,
                        event.pageX - Section.left,
                    ]
                    var W = 32;
                    var pos = A.Lowest(DistSet);
                    switch (pos) {
                        case 0: // Top
                            A.PanelRect.style.top = Section.top + "px";
                            A.PanelRect.style.left = Section.left + "px";
                            A.PanelRect.style.width = Section.width + "px";
                            A.PanelRect.style.height = W + "px";
                            break;
                        case 1: // Right
                            A.PanelRect.style.top = Section.top + "px";
                            A.PanelRect.style.left = Section.right - W + "px";
                            A.PanelRect.style.width = W + "px";
                            A.PanelRect.style.height = Section.height + "px";
                            break;
                        case 2: // Bottom
                            A.PanelRect.style.top = Section.bottom - W + "px";
                            A.PanelRect.style.left = Section.left + "px";
                            A.PanelRect.style.width = Section.width + "px";
                            A.PanelRect.style.height = W + "px";
                            break;
                        case 3: // Left
                            A.PanelRect.style.top = Section.top + "px";
                            A.PanelRect.style.left = Section.left + "px";
                            A.PanelRect.style.width = W + "px";
                            A.PanelRect.style.height = Section.height + "px";
                            break;
                    }
                    //A.PanelRect.innerHTML = pos;
                    event.preventDefault();
                    A.PanelRect.style.visibility = "visible";
                    return;
                }
            }
            A.PanelRect.style.visibility = "hidden";
        }
        else {
            A.PanelRect.style.visibility = "hidden";
        }
    })

    // When panel drag is stopped.
    window.addEventListener("dragend", function (event) {
        A.MovingSection.style.opacity = 1;
        A.PanelRect.style.visibility = "hidden";

        var Panel = A.PanelRoot.getBoundingClientRect();
        if (event.pageX > Panel.left && event.pageX < Panel.right && event.pageY > Panel.top && event.pageY < Panel.bottom) {
            for (let i = 0; i < A.Sections.length; i++) {
                if (A.Sections[i].dataset.name == A.MovingSection.dataset.name) continue;
                var Section = A.Sections[i].getBoundingClientRect(); // Landing Section Bounding Box
                if (event.pageX > Section.left && event.pageX < Section.right && event.pageY > Section.top && event.pageY < Section.bottom) { // Landing Section found
                    // Get parent containers
                    var MajorFromDiv = A.MovingSection.parentElement.parentElement;
                    var ToDiv = A.Sections[i].parentElement;

                    // Det method
                    var DistSet = [
                        event.pageY - Section.top,
                        Section.right - event.pageX,
                        Section.bottom - event.pageY,
                        event.pageX - Section.left,
                    ]
                    var pos = A.Lowest(DistSet);

                    var IsDeep = (pos == 0 || pos == 2);
                    if (ToDiv.parentElement.dataset.dir == "vertical") IsDeep = !IsDeep;
                    console.log(IsDeep);
                    if (IsDeep) {
                        // Organise ToDiv
                        var SubDiv = document.createElement("div");
                        SubDiv.append(ToDiv.children[0]);
                        ToDiv.append(SubDiv);
                        SubDiv.dataset.dir = (ToDiv.dataset.dir == "vertical") ? "horizontal" : "vertical";
                        A.MovingSection.parentElement.dataset.dir = (ToDiv.dataset.dir == "vertical") ? "horizontal" : "vertical";
                        // Move
                        if (pos == 0 || pos == 3) {
                            ToDiv.prepend(A.MovingSection.parentElement);
                        }
                        else {
                            ToDiv.appendChild(A.MovingSection.parentElement);
                        }
                    }
                    else {
                        A.MovingSection.parentElement.dataset.dir = ToDiv.dataset.dir;
                        if (pos == 0 || pos == 3) {
                            ToDiv.parentElement.insertBefore(A.MovingSection.parentElement, ToDiv);
                        }
                        else {
                            ToDiv.parentElement.insertBefore(A.MovingSection.parentElement, ToDiv.nextSibling);
                        }
                    }

                    // Mop Up
                    console.log(MajorFromDiv);
                    if (MajorFromDiv.childElementCount == 1) {
                        if (MajorFromDiv.dataset.super == "True") MajorFromDiv.children[0].dataset.super = "True";
                        MajorFromDiv.replaceWith(MajorFromDiv.children[0]);
                        A.PanelDivsDirSet(A.PanelRoot.children[0]);
                    }
                    A.PanelDivsDirVir(A.PanelRoot.children[0]);
                    break;
                }
            }
        }
    })

    console.log("ASO.js loaded")

    if (Loaded) {
        Loaded();
        console.log("Defined script loaded")
    }
})

window.addEventListener("mousemove", function (event) {
    A.MouseX = event.pageX;
    A.MouseY = event.pageY;
    //console.log(A.MouseX);
})