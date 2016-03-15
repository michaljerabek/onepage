/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/

(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        module.exports = factory();

    } else {

        root.MediumEditorTouchSupport = factory();
    }

}(this, function () {

    return function (MediumEditor) {

        MediumEditor.TouchSupport = {};

        MediumEditor.Events.prototype._handleBodyMousedown = MediumEditor.Events.prototype.handleBodyMousedown;

        MediumEditor.Events.prototype.handleBodyMousedown = function () {

            if (this.touchSupport.bodyTouchstart) {

                this.touchSupport.bodyTouchstart = false;

                return;
            }

            this._handleBodyMousedown.apply(this, arguments);
        };

        MediumEditor.Events.prototype._handleBodyClick = MediumEditor.Events.prototype.handleBodyClick;

        MediumEditor.Events.prototype.handleBodyClick = function () {

            if (this.touchSupport.bodyTouchend) {

                this.touchSupport.bodyTouchend = false;

                return;
            }

            this._handleBodyClick.apply(this, arguments);
        };

        MediumEditor.Events.prototype._setupListener = MediumEditor.Events.prototype.setupListener;

        MediumEditor.Events.prototype.setupListener = function (name) {

            this.touchSupport = this.touchSupport || {
                touches: 0
            };

            if (name === "externalInteraction" && !this.touchSupport.attachedExternalInteraction) {

                this.attachDOMEvent(this.options.ownerDocument.body, 'touchstart', function (e) {

                    if (!this.base.toolbar.toolbar.classList.contains("medium-editor-use-touch")) {

                        this.base.toolbar.toolbar.classList.add("medium-editor-use-touch");
                    }

                    this.touchSupport.used = true;
                    this.touchSupport.touches = e.touches.length > this.touchSupport.touches ? e.touches.length : this.touchSupport.touches;
                    this.touchSupport.zoom = document.documentElement.clientWidth / window.innerWidth;

                    if (e.touches.length === 3) {

                        this.touchSupport.startX = e.touches[2].clientX;
                        this.touchSupport.startY = e.touches[2].clientY;
                    }

                    if (e.touches.length === 1) {

                        this.touchSupport.bodyTouchstart = false;

                        this.handleBodyMousedown.apply(this, arguments);

                        this.touchSupport.bodyTouchstart = true;
                    }

                }.bind(this), true);

                this.attachDOMEvent(this.options.ownerDocument.body, 'touchmove', function (e) {

                    this.touchSupport.bodyTouchmove = true;

                    var directionChanged = false;

                    if (!MediumEditor.TouchSupport.toolbarSwitched && e.touches[2] && this.base.getFocusedElement()) {

                        if (this.base.toolbar.toolbar.classList.contains("medium-editor-toolbar-active")) {

                            e.preventDefault();

                            if (Math.abs(this.touchSupport.startY - e.touches[2].clientY) > 40 / this.touchSupport.zoom) {

                                if (this.touchSupport.startY - e.touches[2].clientY > 0) {

                                    MediumEditor.TouchSupport.forceDirectionY = "top";

                                } else {

                                    MediumEditor.TouchSupport.forceDirectionY = "bottom";
                                }

                                directionChanged = true;
                            }
                        }
                    }

                    if (!MediumEditor.TouchSupport.toolbarSwitched && e.touches[2] && this.base.getFocusedElement()) {

                        if (this.base.toolbar.toolbar.classList.contains("medium-editor-toolbar-active")) {

                            e.preventDefault();

                            if (Math.abs(this.touchSupport.startX - e.touches[2].clientX) > 40 / this.touchSupport.zoom) {

                                if (this.touchSupport.startX - e.touches[2].clientX > 0) {

                                    MediumEditor.TouchSupport.forceDirectionX = "left";

                                } else {

                                    MediumEditor.TouchSupport.forceDirectionX = "right";
                                }

                                directionChanged = true;
                            }
                        }
                    }

                    if (directionChanged) {

                        MediumEditor.TouchSupport.toolbarSwitched = true;

                        this.base.toolbar.setToolbarPosition();
                    }

                }.bind(this), true);

                this.attachDOMEvent(this.options.ownerDocument.body, 'touchend', function (e) {

                    clearTimeout(this.touchSupport.touchesTimeout);

                    this.touchSupport.touchesTimeout = setTimeout(function () {

                        this.touchSupport.touches = 0;
                        MediumEditor.TouchSupport.toolbarSwitched = false;

                    }.bind(this), 75);

                    if (this.touchSupport.touches > 1) {

                        return;
                    }

                    if (e.touches.length === 0) {

                        this.touchSupport.bodyTouchend = false;

                        var $target = $(e.target),
                            $closestEditor = $target.closest("[data-medium-editor-element]"),
                            $closestToolbar = $target.closest(".medium-editor-toolbar"),
                            focusedEditor = this.base.getFocusedElement();

                        this.touchSupport.onToolbarTouchend = $closestToolbar.length;

                        if (!this.touchSupport.bodyTouchmove && (!focusedEditor || focusedEditor !== $closestEditor[0])) {

                            $closestEditor.focus();
                        }

                        if (!this.touchSupport.bodyTouchmove && focusedEditor && !$closestToolbar.length && !$closestEditor.length) {

                            MediumEditor.TouchSupport.forceDirectionY = MediumEditor.TouchSupport.forceDirectionY || "top";

                            $(focusedEditor).blur();
                        }

                        if (!this.touchSupport.bodyTouchmove) {

                            this.handleBodyClick.apply(this, arguments);
                        }

                        MediumEditor.TouchSupport.toolbarSwitched = false;
                        this.touchSupport.bodyTouchstart = false;
                        this.touchSupport.bodyTouchmove = false;
                        this.touchSupport.bodyTouchend = true;
                    }

                }.bind(this), true);

                this.touchSupport.attachedExternalInteraction = true;

            } else if (name === "editableClick" && !this.touchSupport.attachedEditableClick) {

                this.attachDOMEvent(this.options.ownerDocument, 'selectionchange', function () {

                    if (!this.touchSupport.used || !this.base.getFocusedElement()) {

                        return;
                    }

                    if (!this.touchSupport.onToolbarTouchend) {

                        this.base.toolbar.checkState();
                    }

                    var args = arguments;

                    clearTimeout(this.touchSupport.selectionTimeout);

                    this.touchSupport.selectionTimeout = setTimeout(function () {

                        if (this.touchSupport.onToolbarTouchend) {

                            return;
                        }

                        this.base.toolbar.checkState();

                        this.handleClick.apply(this, args);

                    }.bind(this), 300);

                }.bind(this));

                this.touchSupport.attachedEditableClick = true;
            }

            this._setupListener.apply(this, arguments);
        };
    };

}));
