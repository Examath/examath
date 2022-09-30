//#region Dependable
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

//#endregion

//#region Inputs
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

//#endregion

//#region Old DOM


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

//#endregion

/**
 * Function run after ASO.js is loaded
 */
var Loaded;

const A = {
    //#region Variables
    Root: document.querySelector(":root"),
    X: 0,
    Y: 0,
    MouseX: 0,
    MouseY: 0,
    //#endregion
    //#region Functions
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
    //#endregion
    //#region Theme and Colours
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
    //#endregion
    //#region Panel
    Panel: {
        Layout: "",
        Root: null, // For panel (avalon dock) element
        Display: null,
        Sections: null, // List of sections (windows) inside panel
        MovingSection: null, // Section that is being dragged
        Rect: null, // Overlay for panel element
        DivsDirSet: function (e) {
            var childdir = (!(e.dataset.dir == "vertical"));
            e.childNodes.forEach(element => {
                if (element.nodeName == "DIV") {
                    element.dataset.dir = (childdir) ? "vertical" : "horizontal";
                    A.Panel.DivsDirSet(element);
                }
            });

        },
        DivsDirVir: function (e, top = false) {
            var childdir = (!(e.dataset.dir == "vertical"));
            if (e.childElementCount == 1) {
                console.log(`> ${e.children[0].dataset.name}`);
                return e.children[0].dataset.name;
            }
            else {
                var ret = "";
                e.childNodes.forEach(element => {
                    if (element.nodeName == "DIV") {
                        if ((element.dataset.dir == "vertical") != (childdir)) {
                            console.error("Panel formating error", element);
                        }
                        ret += A.Panel.DivsDirVir(element) + " ";
                    }
                })
                if (top) return ret;
                return `[%00 ${ret}]`;
            }
        },
        /**
         * Readys the Panel
         */
        Load: function () {
            A.Panel.Display = document.createElement("div");
            A.Panel.Root.prepend(A.Panel.Display);
            A.Panel.Display.dataset.super = "True";
            if (A.Panel.Display.dataset.dir == undefined) A.Panel.Display.dataset.dir = "horizontal";

            // Sections
            var i = 0;
            A.Panel.Sections.forEach(function (e) {
                var el = document.createElement("header");
                el.innerHTML = e.dataset.name;
                e.prepend(el);

                //if (!e.id) e.id = i + "Section";
                e.draggable = true;
                e.addEventListener("dragstart", function (event) {
                    //console.log(event);
                    A.Panel.MovingSections = event.target;
                    A.Panel.MovingSections.style.opacity = 0.3;
                })
                i++;
                var container = document.createElement("div");
                container.append(e);
                A.Panel.Display.append(container);
            })
            // Builder

            A.Panel.DivsDirSet(A.Panel.Display);

            // Blue UI Ques when dragging panel
            A.Panel.Rect = document.createElement("div");
            A.Panel.Rect.id = "PanelUIRect";
            document.body.appendChild(A.Panel.Rect);
            window.addEventListener("dragover", A.Panel.DragOver)

            // When panel drag is stopped.
            window.addEventListener("dragend", A.Panel.DragEnd)
        },
        /**
         * Draws Guide Boxes for panel moving
         * @param {*} event 
         */
        DragOver: function (event) {
            var PanelBounds = A.Panel.Root.getBoundingClientRect();
            if (
                event.pageX > PanelBounds.left
                && event.pageX < PanelBounds.right
                && event.pageY > PanelBounds.top
                && event.pageY < PanelBounds.bottom
            ) { // Cursor still inside panel
                for (let i = 0; i < A.Panel.Sections.length; i++) { // For each section
                    if (A.Panel.Sections[i].dataset.name == A.Panel.MovingSections.dataset.name) continue;
                    var Section = A.Panel.Sections[i].getBoundingClientRect();
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
                                A.Panel.Rect.style.top = Section.top + "px";
                                A.Panel.Rect.style.left = Section.left + "px";
                                A.Panel.Rect.style.width = Section.width + "px";
                                A.Panel.Rect.style.height = W + "px";
                                break;
                            case 1: // Right
                                A.Panel.Rect.style.top = Section.top + "px";
                                A.Panel.Rect.style.left = Section.right - W + "px";
                                A.Panel.Rect.style.width = W + "px";
                                A.Panel.Rect.style.height = Section.height + "px";
                                break;
                            case 2: // Bottom
                                A.Panel.Rect.style.top = Section.bottom - W + "px";
                                A.Panel.Rect.style.left = Section.left + "px";
                                A.Panel.Rect.style.width = Section.width + "px";
                                A.Panel.Rect.style.height = W + "px";
                                break;
                            case 3: // Left
                                A.Panel.Rect.style.top = Section.top + "px";
                                A.Panel.Rect.style.left = Section.left + "px";
                                A.Panel.Rect.style.width = W + "px";
                                A.Panel.Rect.style.height = Section.height + "px";
                                break;
                        }
                        //A.Panel.Rect.innerHTML = pos;
                        event.preventDefault();
                        A.Panel.Rect.style.visibility = "visible";
                        return;
                    }
                }
                A.Panel.Rect.style.visibility = "hidden";
            }
            else {
                A.Panel.Rect.style.visibility = "hidden";
            }
        },
        /**
         * Moves individual panels (Sections) around when user releases a drag operation
         * @param {DragEvent} event 
         */
        DragEnd: function (event) {
            A.Panel.MovingSections.style.opacity = 1;
            A.Panel.Rect.style.visibility = "hidden";

            var Panel = A.Panel.Root.getBoundingClientRect();
            if (event.pageX > Panel.left && event.pageX < Panel.right && event.pageY > Panel.top && event.pageY < Panel.bottom) {
                for (let i = 0; i < A.Panel.Sections.length; i++) {
                    if (A.Panel.Sections[i].dataset.name == A.Panel.MovingSections.dataset.name) continue;
                    var Section = A.Panel.Sections[i].getBoundingClientRect(); // Landing Section Bounding Box
                    if (event.pageX > Section.left && event.pageX < Section.right && event.pageY > Section.top && event.pageY < Section.bottom) { // Landing Section found
                        // Get parent containers
                        var MajorFromDiv = A.Panel.MovingSections.parentElement.parentElement;
                        var ToDiv = A.Panel.Sections[i].parentElement;

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
                        //console.log(IsDeep);
                        if (IsDeep) {
                            // Organise ToDiv
                            var SubDiv = document.createElement("div");
                            SubDiv.append(ToDiv.children[0]);
                            ToDiv.append(SubDiv);
                            SubDiv.dataset.dir = (ToDiv.dataset.dir == "vertical") ? "horizontal" : "vertical";
                            A.Panel.MovingSections.parentElement.dataset.dir = (ToDiv.dataset.dir == "vertical") ? "horizontal" : "vertical";
                            // Move
                            if (pos == 0 || pos == 3) {
                                ToDiv.prepend(A.Panel.MovingSections.parentElement);
                            }
                            else {
                                ToDiv.appendChild(A.Panel.MovingSections.parentElement);
                            }
                        }
                        else {
                            A.Panel.MovingSections.parentElement.dataset.dir = ToDiv.dataset.dir;
                            if (pos == 0 || pos == 3) {
                                ToDiv.parentElement.insertBefore(A.Panel.MovingSections.parentElement, ToDiv);
                            }
                            else {
                                ToDiv.parentElement.insertBefore(A.Panel.MovingSections.parentElement, ToDiv.nextSibling);
                            }
                        }

                        // Mop Up
                        console.log(MajorFromDiv);
                        if (MajorFromDiv.childElementCount == 1) {
                            if (MajorFromDiv.dataset.super == "True") {
                                MajorFromDiv.children[0].dataset.super = "True";
                                A.Panel.Display = MajorFromDiv.children[0];
                            }
                            MajorFromDiv.replaceWith(MajorFromDiv.children[0]);
                            A.Panel.DivsDirSet(A.Panel.Display);
                        }
                        console.log(A.Panel.DivsDirVir(A.Panel.Display, true));
                        break;
                    }
                }
            }
        },

    },

    //#endregion
}

//#region Events

document.addEventListener("DOMContentLoaded", () => {
    //#region T
    // Version Info and Styling
    var vstr = "";
    var vel = document.querySelector(`meta[name="version"]`);
    if (vel) {
        vstr = " | Version " + vel.getAttribute('content');
    }
    document.body.innerHTML += `<div class="notice" title="This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.">Copyright &copy; <a href="https://github.com/alphax10">Paul Cyril</a> ${GetMeta("year", "2021")}</a>, <a href="https://www.gnu.org/licenses/old-licenses/gpl-2.0-standalone.html">GNU GPL v2.0</a>${vstr}</div>`;

    // Onload on input
    document.querySelectorAll("button[onload]").forEach(function (e) {
        e.dispatchEvent(new Event("load"));
    })

    // Definitions
    A.Panel.Sections = document.querySelectorAll("div.panel section");
    A.Panel.Root = document.querySelector("div.panel");
    A.Theme.Root = document.querySelector(`link[href$="ASO.css"]`);
    //#endregion
    // Panel

    if (A.Panel.Root) A.Panel.Load();

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

//#endregion