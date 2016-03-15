/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/

(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        module.exports = factory();

    } else {

        root.MediumEditorToolbar = factory();
    }

}(this, function () {

    function getSelectionHtml() {
        var html = "";
        if (typeof window.getSelection !== "undefined") {
            var sel = window.getSelection();
            if (sel.rangeCount) {
                var container = document.createElement("div");
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                    container.appendChild(sel.getRangeAt(i).cloneContents());
                }
                html = container.innerHTML;
            }
        } else if (typeof document.selection != "undefined") {
            if (document.selection.type == "Text") {
                html = document.selection.createRange().htmlText;
            }
        }
        return html;
    }

    return function (MediumEditor, FixedElement) {

        MediumEditor.extensions.toolbar.prototype._init = MediumEditor.extensions.toolbar.prototype.init;

        MediumEditor.extensions.toolbar.prototype.init = function () {

            this.$win = $(window);

            this.base.toolbar = this;

            MediumEditor.extensions.toolbar.prototype._init.apply(this, arguments);

            this.getToolbarActionsElement().classList.add("medium-editor-default-actions-displayed");
            this.toolbar.classList.add("medium-editor-default-actions-displayed");

            //výchozí pozice
            this.toolbar.classList.add("medium-editor-force-left");
            this.toolbar.classList.add("medium-editor-force-top");

            //elementy zajišťující přesun editoru (<ul />), pokud je menší než root element
            this.beforeFill = document.createElement("div");
            this.beforeFill.classList.add("medium-editor-before-fill");

            this.afterFill = document.createElement("div");
            this.afterFill.classList.add("medium-editor-after-fill");

            this.toolbar.appendChild(this.afterFill);
            this.toolbar.insertBefore(this.beforeFill, this.toolbar.children[0]);

            //přiřazení tlačítkům touchend
            this.forEachExtension(function (extenstion) {

                if (extenstion.button) {

                    $(extenstion.button).on("touchend.medium-editor-button", function (e) {

                        if (e.originalEvent.changedTouches.length === 1) {

                            if (!$(e.target).closest("button").prop("disabled")) {

                                this.handleClick.apply(this, arguments);
                            }

                            e.preventDefault();
                            return false;
                        }
                    }.bind(extenstion));
                }
            });
        };

        MediumEditor.extensions.toolbar.prototype._destroy = MediumEditor.extensions.toolbar.prototype.destroy;

        MediumEditor.extensions.toolbar.prototype.destroy = function () {

            var original = MediumEditor.extensions.toolbar.prototype._destroy.apply(this, arguments);

            //odsranění touchendu z tlačítek
            this.forEachExtension(function (extenstion) {

                if (extenstion.button) {

                    $(extenstion.button).off("touchend.medium-editor-button");
                }
            });

            return original;
        };

        MediumEditor.extensions.toolbar.prototype._createToolbarButtons = MediumEditor.extensions.toolbar.prototype.createToolbarButtons;

        MediumEditor.extensions.toolbar.prototype.createToolbarButtons = function () {

            var actionElement = MediumEditor.extensions.toolbar.prototype._createToolbarButtons.apply(this, arguments),
                buttons = actionElement.querySelectorAll("button[class*='medium-editor-action']"),
                b = buttons.length - 1;

            //předání tříd položkám (<li />) tlačítek
            for (b; b >= 0; b--) {

                var actionClass = buttons[b].className.match(/(^medium-editor-action-|\ medium-editor-action-)[^ ]*/)[0];
                buttons[b].parentNode.className = actionClass.replace("editor-action", "editor-has-action");

                //třída více než b tlačítek
                actionElement.classList.add("medium-editor-has-more-then-" + b + "-actions");
            }

            //celkový počet tlačítek
            actionElement.classList.add("medium-editor-has-" + buttons.length + "-actions");

            return actionElement;
        };

        MediumEditor.extensions.toolbar.prototype._checkActiveButtons = MediumEditor.extensions.toolbar.prototype.checkActiveButtons;

        MediumEditor.extensions.toolbar.prototype.checkActiveButtons = function () {

            var original = MediumEditor.extensions.toolbar.prototype._checkActiveButtons.apply(this, arguments);

            var actionElement = this.getToolbarActionsElement(),
                buttons = actionElement.querySelectorAll("button[class*='medium-editor-action']"),
                b = buttons.length - 1;

            //předání aktivního stavu tlačítek položkám (<li />)
            for (b; b >= 0; b--) {

                if (buttons[b].classList.contains("medium-editor-button-active")) {

                    buttons[b].parentNode.classList.add("medium-editor-has-button-active");

                } else {

                    buttons[b].parentNode.classList.remove("medium-editor-has-button-active");
                }
            }

            //zablokování h2, pokud je označen seznam, a zablokování seznamů, pokud je označen h2
            var selection = getSelectionHtml(),

                ordered = this.base.getExtensionByName("orderedlist"),
                unordered = this.base.getExtensionByName("unorderedlist"),
                h2 = this.base.getExtensionByName("h2");

            if (ordered && ordered.button && unordered && unordered.button && h2 && h2.button) {

                ordered.button.disabled = !!h2.button.className.match("-active") || selection.match(/<\/?h2>/i);
                unordered.button.disabled = !!h2.button.className.match("-active") || selection.match(/<\/?h2>/i);
                h2.button.disabled = !!ordered.button.className.match("-active") || unordered.button.className.match("-active") || selection.match(/<\/?(?:ul|ol|li)>/i);
            }

            return original;
        };

        MediumEditor.extensions.toolbar.prototype._showToolbar = MediumEditor.extensions.toolbar.prototype.showToolbar;

        MediumEditor.extensions.toolbar.prototype.showToolbar = function () {

            if (!this.isDisplayed()) {

                //třída označující první zobrazení toolbaru (poté je pouze přesouván, dokud není opět skryt)
                this.$win.off("mousedown.medium-editor-first-show-" + this.base.id);
                this.$win.off("touchstart.medium-editor-first-show-" + this.base.id);

                this.$win.one("mousedown.medium-editor-first-show-" + this.base.id + " " + "touchstart.medium-editor-first-show-" + this.base.id, function () {

                    this.toolbar.classList.remove("medium-editor-first-show");

                }.bind(this));

                this.toolbar.classList.add("medium-editor-first-show");

                if (this.fixedElement) {

                    this.fixedElement.wake();
                }
            }

            return MediumEditor.extensions.toolbar.prototype._showToolbar.apply(this, arguments);
        };

        MediumEditor.extensions.toolbar.prototype._hideToolbar = MediumEditor.extensions.toolbar.prototype.hideToolbar;

        MediumEditor.extensions.toolbar.prototype.hideToolbar = function () {

            if (this.isDisplayed()) {

                this.$win.off("mousedown.medium-editor-first-show-" + this.base.id);
                this.$win.off("touchstart.medium-editor-first-show-" + this.base.id);

                this.toolbar.classList.remove("medium-editor-first-show");

                this.hideExtensionForms();
                this.showToolbarDefaultActions(true);

                if (this.fixedElement) {

                    this.fixedElement.sleep();
                }
            }

           return MediumEditor.extensions.toolbar.prototype._hideToolbar.apply(this, arguments);
        };

        MediumEditor.extensions.toolbar.prototype.isToolbarDefaultActionsDisplayed = function () {

            return this.getToolbarActionsElement().classList.contains("medium-editor-default-actions-displayed");
        };

        MediumEditor.extensions.toolbar.prototype.hideToolbarDefaultActions = function () {

            if (this.isToolbarDefaultActionsDisplayed()) {

                this.getToolbarActionsElement().classList.add("medium-editor-default-actions-hidden");
                this.getToolbarActionsElement().classList.remove("medium-editor-default-actions-displayed");
                this.toolbar.classList.add("medium-editor-default-actions-hidden");
                this.toolbar.classList.remove("medium-editor-default-actions-displayed");
            }
        };

        MediumEditor.extensions.toolbar.prototype.showToolbarDefaultActions = function (dontShowToolbar) {

            this.hideExtensionForms();

            if (!this.isToolbarDefaultActionsDisplayed()) {

                this.getToolbarActionsElement().classList.remove("medium-editor-default-actions-hidden");
                this.getToolbarActionsElement().classList.add("medium-editor-default-actions-displayed");
                this.toolbar.classList.remove("medium-editor-default-actions-hidden");
                this.toolbar.classList.add("medium-editor-default-actions-displayed");
            }

            //při zavření toolbaru se tlačítka zobrazí zpět, pokud byl otevřen anchor; toolbar ale musí zůstat skrytý
            if (dontShowToolbar) {

                return;
            }

            // Using setTimeout + options.delay because:
            // We will actually be displaying the toolbar, which should be controlled by options.delay
            this.delayShowTimeout = this.base.delay(function () {
                this.showToolbar();
            }.bind(this));
        };

        MediumEditor.extensions.toolbar.prototype.hideExtensionForms = function () {

            // Hide all extension forms
            this.forEachExtension(function (extension) {

                if (extension.action === "createLink") {

                    if (extension.isDisplayed()) {

                        //reset formuláře z anchoru
                        extension.getForm().classList.remove("medium-editor-action-createLink-displayed");

                        extension.getInput().value = "";
                    }

                    return;
                }
                if (extension.hasForm && extension.isDisplayed()) {
                    extension.hideForm();
                }
            });
        };

        MediumEditor.extensions.toolbar.prototype.setFillGrow = function (before, after) {
            this.beforeFill.style.webkitFlexGrow = before;
            this.beforeFill.style.mozFlexGrow = before;
            this.beforeFill.style.msFlexGrow = before;
            this.beforeFill.style.oFlexGrow = before;
            this.beforeFill.style.flexGrow = before;
            this.afterFill.style.webkitFlexGrow = after;
            this.afterFill.style.mozFlexGrow = after;
            this.afterFill.style.msFlexGrow = after;
            this.afterFill.style.oFlexGrow = after;
            this.afterFill.style.flexGrow = after;
        };

        MediumEditor.extensions.toolbar.prototype.positionTouchToolbar = function () {

            var toolbarElement = this.getToolbarElement(),
                anchorFormElement = this.base.getExtensionByName("anchor").form;

            toolbarElement.style.top = '';
            toolbarElement.style.left = '';
            anchorFormElement.style.left = '';

            if (this.base.events.touchSupport.used) {

                toolbarElement.classList.remove("medium-editor-force-left");
                toolbarElement.classList.remove("medium-editor-force-right");
                toolbarElement.classList.remove("medium-editor-force-bottom");
                toolbarElement.classList.remove("medium-editor-force-top");

                if (MediumEditor.TouchSupport.forceDirectionX !== "right") {

                    toolbarElement.classList.add("medium-editor-force-left");

                } else {

                    toolbarElement.classList.add("medium-editor-force-right");
                }

                if (MediumEditor.TouchSupport.forceDirectionY !== "bottom") {

                    toolbarElement.classList.add("medium-editor-force-top");

                } else {

                    toolbarElement.classList.add("medium-editor-force-bottom");
                }

                this.fixedElement = this.fixedElement || new FixedElement(this.toolbar);

                //pokud se pozice změní je potřeba zresetovat fixní pozici toolbaru
                if ((MediumEditor.TouchSupport.forceDirectionY !== MediumEditor.TouchSupport.lastForceDirectionY) ||
                    (MediumEditor.TouchSupport.forceDirectionX !== MediumEditor.TouchSupport.lastForceDirectionX)) {

                    this.fixedElement.fix(true, MediumEditor.TouchSupport.forceDirectionY !== MediumEditor.TouchSupport.lastForceDirectionY);
                }

                MediumEditor.TouchSupport.lastForceDirectionX = MediumEditor.TouchSupport.forceDirectionX;
                MediumEditor.TouchSupport.lastForceDirectionY = MediumEditor.TouchSupport.forceDirectionY;
            }
        };

        MediumEditor.extensions.toolbar.prototype.positionToolbar = function (selection) {

            var toolbarElement = this.getToolbarElement(),
                anchorFormElement = this.base.getExtensionByName("anchor").form;

            //dotykové zařízení
            if (toolbarElement.classList.contains("medium-editor-use-touch")) {

                this.positionTouchToolbar.apply(this, arguments);

                return;
            }

            toolbarElement.classList.remove('medium-editor-left-edge');
            toolbarElement.classList.remove('medium-editor-right-edge');

            var range = selection.getRangeAt(0),
                boundary = range.getBoundingClientRect();

            // Handle selections with just images
            if (!boundary || ((boundary.height === 0 && boundary.width === 0) && range.startContainer === range.endContainer)) {
                // If there's a nested image, use that for the bounding rectangle
                if (range.startContainer.nodeType === 1 && range.startContainer.querySelector('img')) {
                    boundary = range.startContainer.querySelector('img').getBoundingClientRect();
                } else {
                    boundary = range.startContainer.getBoundingClientRect();
                }
            }

            var windowWidth = document.documentElement.clientWidth < this.window.innerWidth ? document.documentElement.clientWidth : this.window.innerWidth,
                middleBoundary = (boundary.left + boundary.right) / 2,
                toolbarHeight = toolbarElement.offsetHeight,
                toolbarWidth = toolbarElement.offsetWidth,

                //velikost volného prostoru mezi formulářem anchoru a root elementem
                anchorOffsetWidth = (toolbarWidth - anchorFormElement.offsetWidth) / 2,

                toolbarActionsElement = this.getToolbarActionsElement(),

                //velikost fillafter a fillbefore elementů pro přesun toolbaru až ke kraji
                fillWidth = (toolbarWidth - toolbarActionsElement.offsetWidth) / 2,

                halfOffsetWidth = toolbarWidth / 2,
                defaultLeft = this.diffLeft - halfOffsetWidth;

            //uložení velikosti výplně a formuláře anchoru (u anchoru asi zbytečné),
            //protože velikost toolbaru se mění při otevření formuláře anchoru
            if (this.isToolbarDefaultActionsDisplayed() && this.savedFillWidth) {

                fillWidth = this.savedFillWidth;
                anchorOffsetWidth = this.savedAnchorOffsetWidth;

                this.savedFillWidth = null;
                this.savedAnchorOffsetWidth = null;

            } else if (!this.isToolbarDefaultActionsDisplayed()) {

                fillWidth = this.savedFillWidth || fillWidth;
                anchorOffsetWidth = this.savedAnchorOffsetWidth || anchorOffsetWidth;

                this.savedFillWidth = fillWidth;
                this.savedAnchorOffsetWidth = anchorOffsetWidth;
            }

            //vertikální zarovnání
            if (boundary.top < toolbarHeight) {

                toolbarElement.classList.add('medium-toolbar-arrow-over');
                toolbarElement.classList.remove('medium-toolbar-arrow-under');
                toolbarElement.style.top = toolbarHeight + boundary.bottom - this.diffTop + this.window.pageYOffset - toolbarHeight + 'px';

            } else {

                toolbarElement.classList.add('medium-toolbar-arrow-under');
                toolbarElement.classList.remove('medium-toolbar-arrow-over');
                toolbarElement.style.top = boundary.top + this.diffTop + this.window.pageYOffset - toolbarHeight + 'px';
            }

            //horizontální zarovnání
            var fillGrow = 1;

            //přesahuje levý okraj
            if (middleBoundary < halfOffsetWidth) {

                toolbarElement.classList.add('medium-editor-left-edge');
                toolbarElement.style.left = defaultLeft + halfOffsetWidth + 'px';

                fillGrow = !fillWidth ? 0 : 1 - (Math.max(0, Math.min(fillWidth, halfOffsetWidth - middleBoundary)) / fillWidth);

                this.setFillGrow(fillGrow, 2 - fillGrow);

                anchorFormElement.style.left = (anchorOffsetWidth * fillGrow) + "px";

            //přesahuje pravý okraj
            } else if ((windowWidth - middleBoundary) < halfOffsetWidth) {

                toolbarElement.classList.add('medium-editor-right-edge');
                toolbarElement.style.left = windowWidth - toolbarWidth + "px";

                fillGrow = !fillWidth ? 0 : 1 - (Math.min(fillWidth, Math.max(0, ((halfOffsetWidth + middleBoundary) - windowWidth))) / fillWidth);

                this.setFillGrow(2 - fillGrow, fillGrow);

                anchorFormElement.style.left = (anchorOffsetWidth * (2 - fillGrow)) + "px";

            } else {

                toolbarElement.style.left = (defaultLeft + middleBoundary) + 'px';
                anchorFormElement.style.left = anchorOffsetWidth + "px";

                this.setFillGrow(1, 1);
            }
        };
    };

}));
