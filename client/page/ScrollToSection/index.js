/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/

var MODES = {
        PAGE: 0,
        EDIT: 1,
        ADMIN: 2
    },

    CLASS = {
        BUTTON: "P_PageElementButton",

        actionsActive: "E_actions-active"
    },

    EVENT_NS = "ScrollToSection",

    $scrollElement,
    $eventElement;

var getAnchorSelector = function (prefix) {

    prefix = prefix || "";

    return "a[href^='#" + prefix + "'], " + "a[href^='" + window.location.origin.replace(/\/$|\\$/, "") + "/#" + prefix + "'], a[data-href^='#" + prefix + "']";
};

var rewriteInternalRefs = function () {

    var selector = getAnchorSelector(this.internalSectionPrefix);

    $(selector).each(function (i, a) {

        var href = (a.href || "").split("#")[1],

            sectionInternalId = href || "";

        if (!this.isInternalId(sectionInternalId)) {

            sectionInternalId = (a.getAttribute("data-href") || "").split("#")[1];
        }

        var sectionId = $("[data-page-section-internal-id='" + sectionInternalId + "']").attr("id");

        a.href = "#" + sectionId;

    }.bind(this));
};

var initScrollAnim = function (requireCtrl) {

    var selector = getAnchorSelector(),
        events = "click." + EVENT_NS + " touchend." + EVENT_NS;

    $eventElement.on(events, selector, function (e) {

        if (requireCtrl && !e.ctrlKey) {

            return true;
        }

        var id = this.getIdFromURL(e.target.href || e.currentTarget.href);

        if (this.scrollToSectionById(id)) {

            e.preventDefault();
            return false;
        }

    }.bind(this));
};

var initMouseOver = function () {

    var selector = getAnchorSelector() + ", ." + CLASS.BUTTON,
        mouseEvents = "mouseover." + EVENT_NS + " mouseout." + EVENT_NS,
        keyEvents = "keydown." + EVENT_NS + " keyup." + EVENT_NS,

        $a = null;

    $eventElement
        .on(mouseEvents, selector, function (e) {

            if (e.type === "mouseover") {

                $a = $(e.target);

                $a.css({
                    cursor: e.ctrlKey ? "pointer": ""
                });

            } else if (e.type === "mouseout") {

                $a.css({
                    cursor: ""
                });

                $a = null;
            }
        })
        .on(keyEvents, function (e) {

            if (e.which === 17 /*CTRL*/ && $a) {

                $a.css({
                    cursor: $a && e.ctrlKey ? "pointer": ""
                });
            }

            if (e.which === 17) {

                $eventElement[e.type === "keydown" ? "addClass" : "removeClass"](CLASS.actionsActive);
            }
        });
};

var init = function () {

    if (!window.location.origin) {

        window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port: "");
    }

    if (this.mode === MODES.PAGE) {

        rewriteInternalRefs.call(this);
    }

    if (this.mode >= MODES.EDIT) {

        initMouseOver.call(this);
    }

    initScrollAnim.call(this, this.mode >= MODES.EDIT);
};

var ScrollToSection = function ScrollToSection(mode, internalSectionPrefix, easing, duration) {

    this.mode = mode || MODES.PAGE;
    this.internalSectionPrefix = internalSectionPrefix || "section-";

    this.setAnimation(easing || "easeOutSine", duration || 300);

    $scrollElement = $("html, body");
    $eventElement = $("body");

    init.call(this);
};

ScrollToSection.MODES = MODES;

ScrollToSection.prototype.setAnimation = function (easing, duration) {

    if ($.isArray(easing)) {

        this.easing = $.bez(easing);

    } else {

        this.easing = $.easing[easing] ? easing : "swing";
    }

    this.duration = duration || 300;
};

ScrollToSection.prototype.getIdFromURL = function (URL) {

    return URL.split("#")[1];
};

ScrollToSection.prototype.isInternalId = function (hash) {
    return hash.indexOf(this.internalSectionPrefix) === 0;
};

ScrollToSection.prototype.findSectionById = function (id) {
    return $("#" + id);
};

ScrollToSection.prototype.findSectionByInternalId = function (id) {
    return $("[data-page-section-internal-id='" + id + "']");
};

ScrollToSection.prototype.scrollToSectionById = function (id, cb) {

    var $section;

    if (this.isInternalId(id)) {

        $section = this.findSectionByInternalId(id);

        id = $section.attr("id");

    } else {

        $section = this.findSectionById(id);
    }

    if (this.scrollToSection($section, cb)) {

        return true;
    }

    return false;
};

ScrollToSection.prototype.scrollToSection = function ($section, cb) {

    if ($section.length) {

        this.scrolling = true;

        var id = $section.attr("id");
        $section.attr("id", "");

        var scrollTop = $scrollElement.scrollTop(),
            scrollTo = Math.min(document.documentElement.scrollHeight - window.innerHeight, $section.offset().top);

        $scrollElement.stop().animate({
            scrollTop: scrollTo
        }, this.duration + (Math.abs(scrollTop - scrollTo) / 20), this.easing, function () {

            this.scrolling = false;

            if (cb) {

                cb();
            }

        }.bind(this));

        window.location.href = "#" + id;
        $section.attr("id", id);

        return true;
    }

    return false;
};

ScrollToSection.prototype.isScrolling = function () {

    return this.scrolling;
};

ScrollToSection.prototype.destroy = function () {

    $eventElement.off([
        "click.", EVENT_NS,
        " touchend.", EVENT_NS,
        " mouseover.", EVENT_NS,
        " mouseout.", EVENT_NS,
        " keydown.", EVENT_NS,
        " keyup.", EVENT_NS
    ].join(""));
};

ScrollToSection.prototype.refresh = function () {

    this.destroy();

    init.call(this);
};

module.exports = ScrollToSection;
