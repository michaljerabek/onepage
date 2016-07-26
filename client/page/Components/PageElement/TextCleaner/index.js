/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        module.exports = factory();

    } else {

        root.TextCleaner = factory();
    }

}(this, function () {

    function TextCleaner(pageElement, maxLength) {

        if (!pageElement.checkLength) {

            pageElement.checkLength = function (length) {

                return !maxLength ? 0 : length - maxLength;
            };
        }
    }

    TextCleaner.prototype.observer = function (currentValue, prevValue, path) {

        if (this.skipTextObserver || this.removing) {

            return;
        }

        var inputValue = currentValue,

            moveCaret = 0;

        //odstranit počáteční mezery
        if (currentValue && currentValue.match(/^(?:\s+|\&nbsp\;)+/ig)) {

            currentValue = currentValue.replace(/^(?:\s+|\&nbsp\;)+/ig, "");

            moveCaret--;
        }

        if (currentValue && currentValue.match(/(<([^>]+)>)/ig)) {

            //nahradit <br> mezerou
            currentValue = currentValue.replace(/(\s{0}<(br[^>]+)>\s{0})/ig, " ");

            //odstranit všechny tagy
            currentValue = currentValue.replace(/(<([^>]+)>)/ig, "");
        }

        if (currentValue && currentValue.match(/(?:\&nbsp\;|\s)(?:\&nbsp\;|\s)+/ig)) {

            //dvě mezery nahradit jednou
            currentValue = currentValue.replace(/(?:\&nbsp\;|\s)(?:\&nbsp\;|\s)+/ig, " ");

            moveCaret--;
        }

        if (currentValue) {

            //omezit maximállní délku textu, $nbsp; je potřeba počítat jako 1 znak
            var nbsp = currentValue.match(/\&nbsp\;/ig),

                length = currentValue.length - (nbsp ? nbsp.length * 5 : 0);

            if (this.checkLength(length) > 0) {

                /*IE11*/
                if (!!window.MSInputMethodContext && !!document.documentMode) {

                    currentValue = currentValue.substr(0, currentValue.length - this.checkLength(length));

                } else {

                    currentValue = prevValue;
                }

                moveCaret--;
            }
        }
    };

    TextCleaner.prototype.numberObserver = function (currentValue, prevValue, path) {

        if (this.skipTextObserver || this.removing) {

            return;
        }

        var inputValue = currentValue,

            moveCaret = 0;

        //odstranit počáteční mezery
        if (currentValue && currentValue.match(/^(?:\s+|\&nbsp\;)+/ig)) {

            currentValue = currentValue.replace(/^(?:\s+|\&nbsp\;)+/ig, "");

            moveCaret--;
        }

        if (currentValue && currentValue.match(/(<([^>]+)>)/ig)) {

            //nahradit <br> mezerou
            currentValue = currentValue.replace(/(\s{0}<(br[^>]+)>\s{0})/ig, " ");

            //odstranit všechny tagy
            currentValue = currentValue.replace(/(<([^>]+)>)/ig, "");
        }

        if (currentValue && currentValue.match(/(?:\&nbsp\;|\s)(?:\&nbsp\;|\s)+/ig)) {

            //dvě mezery nahradit jednou
            currentValue = currentValue.replace(/(?:\&nbsp\;|\s)(?:\&nbsp\;|\s)+/ig, " ");

            moveCaret--;
        }


        if (currentValue && currentValue.match(/[^0-9,. °Ω×~+-\/*\\><±∆∑∞%′″#@:]/ig)) {

            //odstranit "nečíselné" znaky
            currentValue = currentValue.replace(/[^0-9,. °Ω×~+-\/*\\><±∆∑∞%′″#@:]/ig, "");

            moveCaret--;
        }

        if (currentValue) {

            //omezit maximállní délku textu, $nbsp; je potřeba počítat jako 1 znak
            var nbsp = currentValue.match(/\&nbsp\;/ig),

                length = currentValue.length - (nbsp ? nbsp.length * 5 : 0);

            if (this.checkLength(length) > 0) {

                /*IE11*/
                if (!!window.MSInputMethodContext && !!document.documentMode) {

                    currentValue = currentValue.substr(0, currentValue.length - this.checkLength(length));

                } else {

                    currentValue = prevValue;
                }

                moveCaret--;
            }
        }


        if (currentValue !== inputValue) {

            var selection = TextCleaner.getSelection(),

                caret = selection ? TextCleaner.getSelection().endOffset + moveCaret : 0,
                element = this.find(":focus");

            this.skipTextObserver = true;

            clearTimeout(this.fixTextTimeout);

            this.fixTextTimeout = setTimeout(function () {

                this.skipTextObserver = true;

                this.set(path, currentValue);

                if (selection) {

                    try {

                        TextCleaner.setCaretPosition.call(this, element, caret);

                    } catch (e) {

                        TextCleaner.placeCaretAtEnd.call(this, element);
                    }
                }

                this.skipTextObserver = false;

            }.bind(this), 0);
        }
    };

    TextCleaner.getSelection = function () {

        var savedRange;

        if (window.getSelection && window.getSelection().rangeCount > 0) {

            savedRange = window.getSelection().getRangeAt(0).cloneRange();

        } else if (document.selection) {

            savedRange = document.selection.createRange();
        }

        return savedRange;
    };

    TextCleaner.setCaretPosition = function (node, pos) {

        if (!node) {

            return;
        }

        node.focus();

        var textNode = node.firstChild,
            range = document.createRange();

        range.setStart(textNode, pos);
        range.setEnd(textNode, pos);

        var sel = window.getSelection();

        sel.removeAllRanges();
        sel.addRange(range);
    };

    TextCleaner.placeCaretAtEnd = function (node) {

        if (!node) {

            return;
        }

        node.focus();

        if (typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {

            var range = document.createRange();
            range.selectNodeContents(node);
            range.collapse(false);

            var sel = window.getSelection();

            sel.removeAllRanges();
            sel.addRange(range);

        } else if (typeof document.body.createTextRange !== "undefined") {

            var textRange = document.body.createTextRange();

            textRange.moveToElementText(node);
            textRange.collapse(false);
            textRange.select();
        }
    };

    TextCleaner.destroy = function () {

        clearTimeout(this.fixTextTimeout);
        clearTimeout(this.fixSpansTimeout);
    };

    return TextCleaner;

}));
