/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive");

        module.exports = factory(Ractive);

    } else {

        root.PageSectionTitles = factory(root.Ractive);
    }

}(this, function (Ractive) {

    return function () {

        var texts = this.findAllComponents("PageElementText");

        this.Title = texts[0];
        this.Subtitle = texts[1];

        this.set("titlesEmpty", this.Title.empty && this.Subtitle.empty);

        this.emptyTextListener = this.on("*.emptyText", function () {

            this.set("textsEmpty", this.Title.empty && this.Subtitle.empty);
            this.set("titleNotSubtitle", !this.Title.empty && this.Subtitle.empty);
            this.set("notTitleSubtitle", this.Title.empty && !this.Subtitle.empty);

        }.bind(this));

        if (Ractive.EDIT_MODE) {

            this.elementStateListener = this.on("*.elementState", function () {

                var titleState = this.Title.get("state"),
                    subtitleState = this.Subtitle.get("state");

                this.set("titlesActive", titleState === "active" || subtitleState === "active");
                this.set("subtitleActive", subtitleState === "active");
                this.set("titleActive", titleState === "active");

            }.bind(this));
        }

        return {
            teardown: function () {

                this.emptyTextListener.cancel();

                if (this.elementStateListener) {

                    this.elementStateListener.cancel();
                }
            }
        };

    };

}));

