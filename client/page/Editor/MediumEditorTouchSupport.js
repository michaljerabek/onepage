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

                    if (!this.touchSupport.toolbarSwitched && e.touches[2] && this.base.getFocusedElement()) {

                        if (this.base.toolbar.toolbar.classList.contains("medium-editor-toolbar-active")) {

                            e.preventDefault();

                            if (Math.abs(this.touchSupport.startY - e.touches[2].clientY) > 40 / this.touchSupport.zoom) {

                                if (this.touchSupport.startY - e.touches[2].clientY > 0) {

                                    this.base.events.touchSupport.forceDirectionY = "top";

                                } else {

                                    this.base.events.touchSupport.forceDirectionY = "bottom";
                                }

                                directionChanged = true;
                            }
                        }
                    }

                    if (!this.touchSupport.toolbarSwitched && e.touches[2] && this.base.getFocusedElement()) {

                        if (this.base.toolbar.toolbar.classList.contains("medium-editor-toolbar-active")) {

                            e.preventDefault();

                            if (Math.abs(this.touchSupport.startX - e.touches[2].clientX) > 40 / this.touchSupport.zoom) {

                                if (this.touchSupport.startX - e.touches[2].clientX > 0) {

                                    this.base.events.touchSupport.forceDirectionX = "left";

                                } else {

                                    this.base.events.touchSupport.forceDirectionX = "right";
                                }

                                directionChanged = true;
                            }
                        }
                    }

                    if (directionChanged) {

                        this.touchSupport.toolbarSwitched = true;

                        this.base.toolbar.setToolbarPosition();
                    }

                }.bind(this), true);

                this.attachDOMEvent(this.options.ownerDocument.body, 'touchend', function (e) {

                    clearTimeout(this.touchSupport.touchesTimeout);

                    this.touchSupport.touchesTimeout = setTimeout(function () {

                        this.touchSupport.touches = 0;
                        this.touchSupport.toolbarSwitched = false;

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

                        if (!this.touchSupport.bodyTouchmove && focusedEditor &&
                            !$closestToolbar.length && !$closestEditor.length) {

                            this.base.events.touchSupport.forceDirectionY = "top";

                            $(focusedEditor).blur();
                        }

                        if (!this.touchSupport.bodyTouchmove) {

                            this.handleBodyClick.apply(this, arguments);
                        }

                        this.touchSupport.toolbarSwitched = false;
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

                    var args = arguments;

                    clearTimeout(this.touchSupport.selectionTimeout);

                    this.touchSupport.selectionTimeout = setTimeout(function () {

                        if (this.touchSupport.onToolbarTouchend) {

                            return;
                        }

                        this.handleClick.apply(this, args);

                    }.bind(this), 300);

                }.bind(this));

                this.touchSupport.attachedEditableClick = true;
            }

            this._setupListener.apply(this, arguments);
        };
    };
}));

module.exports = function (MediumEditor) {

    'use strict';

    MediumEditor.extensions.toolbar.prototype._init = MediumEditor.extensions.toolbar.prototype.init;

    MediumEditor.extensions.toolbar.prototype.init = function () {

        this.base.toolbar = this;

        this._init.apply(this, arguments);
    };

    MediumEditor.extensions.toolbar.prototype._positionToolbar = MediumEditor.extensions.toolbar.prototype.positionToolbar;

    MediumEditor.extensions.toolbar.prototype.positionToolbar = function (selection) {

        if (!this.base.events.touchSupport.used) {

            this._positionToolbar.apply(this, arguments);

            return;
        }

        this.getToolbarElement().style.left = '0';

        var windowWidth = this.window.innerWidth,
            range = selection.getRangeAt(0),
            boundary = range.getBoundingClientRect(),
            middleBoundary = (boundary.left + boundary.right) / 2,
            toolbarElement = this.getToolbarElement(),
            toolbarHeight = toolbarElement.offsetHeight,
            toolbarWidth = toolbarElement.offsetWidth,
            halfOffsetWidth = toolbarWidth / 2,
            buttonHeight = 50,
            defaultLeft = this.diffLeft - halfOffsetWidth;

        if (this.base.events.touchSupport.forceDirection !== "top") {

            if (boundary.bottom < this.window.innerHeight - toolbarHeight) {

                toolbarElement.classList.add('medium-toolbar-arrow-over');
                toolbarElement.classList.remove('medium-toolbar-arrow-under');
                toolbarElement.style.top = buttonHeight + boundary.bottom - this.diffTop + this.window.pageYOffset - toolbarHeight + 'px';

            } else {

                toolbarElement.classList.add('medium-toolbar-arrow-over');
                toolbarElement.classList.remove('medium-toolbar-arrow-under');
                toolbarElement.style.top = buttonHeight + boundary.top - this.diffTop + this.window.pageYOffset - toolbarHeight + 'px';
            }
        } else {

            if (boundary.top > toolbarHeight) {

                toolbarElement.classList.add('medium-toolbar-arrow-under');
                toolbarElement.classList.remove('medium-toolbar-arrow-over');
                toolbarElement.style.top = boundary.top + this.diffTop + this.window.pageYOffset - toolbarHeight + 'px';

            } else {

                toolbarElement.classList.add('medium-toolbar-arrow-under');
                toolbarElement.classList.remove('medium-toolbar-arrow-over');
                toolbarElement.style.top = boundary.bottom + this.diffTop + this.window.pageYOffset - toolbarHeight - buttonHeight + 'px';
            }
        }

        if (middleBoundary < halfOffsetWidth) {

            toolbarElement.style.left = defaultLeft + halfOffsetWidth + 'px';

        } else if ((windowWidth - middleBoundary) < halfOffsetWidth) {

            toolbarElement.style.left = windowWidth + defaultLeft - halfOffsetWidth + 'px';

        } else {

            toolbarElement.style.left = defaultLeft + middleBoundary + 'px';
        }
    };

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

                if (!this.touchSupport.toolbarSwitched && e.touches[2] &&
                        Math.abs(this.touchSupport.startX - e.touches[2].clientX) < 35 / this.touchSupport.zoom &&
                        this.base.getFocusedElement()) {

                    if ($("#medium-editor-toolbar-" + this.base.id).is(".medium-editor-toolbar-active")) {

                        e.preventDefault();

                        if (Math.abs(this.touchSupport.startY - e.touches[2].clientY) > 50 / this.touchSupport.zoom) {

                            this.touchSupport.toolbarSwitched = true;

                            if (this.touchSupport.startY - e.touches[2].clientY > 0) {

                                this.base.events.touchSupport.forceDirection = "top";

                            } else {

                                this.base.events.touchSupport.forceDirection = "bottom";
                            }

                            this.base.toolbar.setToolbarPosition();
                        }
                    }
                }

            }.bind(this), true);

            this.attachDOMEvent(this.options.ownerDocument.body, 'touchend', function (e) {

                clearTimeout(this.touchSupport.touchesTimeout);

                this.touchSupport.touchesTimeout = setTimeout(function () {

                    this.touchSupport.touches = 0;
                    this.touchSupport.toolbarSwitched = false;

                }.bind(this), 75);

                if (this.touchSupport.touches > 1) {

                    return;
                }

                if (e.touches.length === 0) {

                    this.touchSupport.bodyTouchend = false;

                    var $closestEditor = $(e.target).closest("[data-medium-editor-element]"),
                        focusedEditor = this.base.getFocusedElement();

                    if (!this.touchSupport.bodyTouchmove && (!focusedEditor || focusedEditor !== $closestEditor[0])) {

                        $(e.target).closest("[data-medium-editor-element]").focus();
                    }

                    if (!this.touchSupport.bodyTouchmove && focusedEditor &&
                            !$(e.target).closest("[data-medium-editor-element], .medium-editor-toolbar").length) {

                        this.base.events.touchSupport.forceDirection = "bottom";

                        $(focusedEditor).blur();
                    }

                    if (!this.touchSupport.bodyTouchmove) {

                        this.handleBodyClick.apply(this, arguments);
                    }

                    this.touchSupport.toolbarSwitched = false;
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

                var args = arguments;

                clearTimeout(this.touchSupport.selectionTimeout);

                this.touchSupport.selectionTimeout = setTimeout(function () {

                    this.handleClick.apply(this, args);

                }.bind(this), 300);

            }.bind(this));

            this.touchSupport.attachedEditableClick = true;
        }

        this._setupListener.apply(this, arguments);
    };

};
