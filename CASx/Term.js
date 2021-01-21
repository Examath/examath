/*Copyright (c) Paul Cyril 2020. GNU GPL v2*/
class Term {
    constructor(term) {
        this.Numerator = 1;
        this.Denominator = 1;
        this.Variables = new Array();
        this.CoefficentSet = false;
        var length = term.length;
        var nbuffer = "";
        var nchar = false;
        var nix = 1;
        var valuable = false;
        for (let i = 0; i < length; i++) {
            const chc = term.charCodeAt(i);
            if (chc == 45 || chc == 46 || chc >= 48 && chc <= 57) {
                nchar = true;
                nbuffer += term.charAt(i);
            }
            else if (chc == 47) {
                ncalc(this);
                nix = (nix > 0) ? -1 : 1
            }
            else if (chc == 42) {
                nix = 1;
            }
            else {
                if (chc != 32) {
                    const char = term.charAt(i);
                    ncalc(this);
                    valuable = true;
                    var j = this.Variables.findIndex((e) => e.Symbol == char);
                    if (j >= 0) {
                        this.Variables[j].Index += nix;
                    }
                    else {
                        this.Variables.push({ Symbol: char, Index: nix })
                    }
                }
            }
        }

        if (nbuffer != "-") ncalc(this);

        for (let i = 0; i < this.Variables.length; i++) {
            if (this.Variables[i].Index == 0) {
                this.Variables.splice(i, 1);
                i--;
            };
        }

        if (!valuable) {
            this.Numerator = 0;
            return;
        }

        var like, ilik;
        like = ilik = "";
        this.Variables.forEach(element => {
            if (element.Index > 0) {
                var i = element.Index;
                while (i > 0) {
                    like += element.Symbol;
                    i--;
                }
            } else {
                var i = element.Index;
                while (i < 0) {
                    ilik += element.Symbol;
                    i++;
                }
            }
        });
        like = like.split('').sort().join('');
        ilik = ilik.split('').sort().join('');
        this.Likeness = `${like}/${ilik}`;

        this.SimplifyCoefficients();

        function ncalc(o) {
            if (nchar) {
                nchar = false;
                if (nix > 0) {
                    o.Numerator *= Number(nbuffer);
                }
                else {
                    o.Denominator *= Number(nbuffer);
                }
                nbuffer = "";
                valuable = true;
                o.CoefficentSet = true;
            }
            else return 1;
        }
    }

    ToString(FirstTerm = false) {
        // +/-
        if (this.Numerator == 0 || this.Denominator == 0) return "";
        var out = (this.Numerator > 0) ? '<span class="sym">+</span>' : '<span class="sym">-</span>';
        if (FirstTerm && this.Numerator > 0) out = "";
        switch (M.Format) {
            case 0: // Decimal
                if (this.CoefficentSet) out += Math.abs(this.Numerator / this.Denominator);
                break;
            case 1: // Fractional
                if (this.CoefficentSet) {
                    if (this.Denominator != 1) out += `<div>${this.Numerator}<hr/>${this.Denominator}</div>`;
                    else out += `<span>${this.Numerator}</span>`;
                };
                break;
            case 2: // All Fractions;
                var out2 = "";
                if (this.CoefficentSet) {
                    out += `<div>${this.Numerator}`;
                    if (this.Denominator != 1) out2 = `${this.Denominator}`;
                };
                this.Variables.forEach(variable => {
                    if (variable.Index > 0) {
                        out += `<span>${variable.Symbol}</span>`;
                        if (variable.Index != 1) out += `<sup>${variable.Index}</sup>`;
                    } else {
                        out2 += `<span>${variable.Symbol}</span>`;
                        if (variable.Index != -1) out2 += `<sup>${0 - variable.Index}</sup>`;
                    }
                })
                if (out2 != "") return `${out}<hr/>${out2}</div>`;
                else return `${out}</div>`;
            default:
                break;
        }
        this.Variables.forEach(variable => {
            out += `<span>${variable.Symbol}</span>`;
            if (variable.Index != 1) out += `<sup>${variable.Index}</sup>`;
        })
        return out;
    }

    Add(x) {
        if (this.Denominator == x.Denominator) this.Numerator += x.Numerator;
        else {
            this.Numerator = this.Numerator * x.Denominator + this.Denominator * x.Numerator;
            this.Denominator *= x.Denominator;
        }
    }

    SimplifyCoefficients() {
        var gcd = function gcd(a, b) {
            return b ? gcd(b, a % b) : a;
        };
        gcd = gcd(this.Numerator, this.Denominator);
        this.Numerator /= gcd;
        this.Denominator /= gcd;
    }
}