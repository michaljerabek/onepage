/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $, PerfectScrollbar*/

(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        module.exports = factory();

    } else {

        root.MediumEditorAnchor = factory();
    }

}(this, function () {

    return function (MediumEditor) {

        MediumEditor.extensions.anchor.prototype.getTemplate = function () {

            var template = [];

            /*Přepínač tabů*/
            var hideFormElement = "position: absolute; top: 0px; left: 0px; opacity: 0; z-index: -1;";

            template.push(
                '<input type="radio" checked style="', hideFormElement, '" id="medium-editor-open-tab-1-', this.base.id, '" name="medium-editor-open-tab-', this.base.id ,'"/>',
                '<input type="radio" style="', hideFormElement, '" id="medium-editor-open-tab-2-', this.base.id, '" name="medium-editor-open-tab-', this.base.id, '"/>',
                '<div class="medium-editor-form-nav">',
                    '<label class="medium-editor-form-open-tab" for="medium-editor-open-tab-1-', this.base.id, '">Odkaz</label>',
                    '<label class="medium-editor-form-open-tab" for="medium-editor-open-tab-2-', this.base.id, '">Sekce</label>',
                    '<a class="medium-editor-form-nav-close" href="#"><svg><use xlink:href="#icon-x"></use></svg></a>',
                '</div>'
            );

            /*Taby*/
            template.push(
                '<div class="medium-editor-form-tabs">'
            );

            /*Vložení odkazu*/
            template.push(
                '<div class="medium-editor-form-tab medium-editor-form-tab-anchor">'
            );

            var inputId = "medium-editor-toolbar-input-" + this.base.id;

            template.push(
                '<label for="', inputId, '">Odkaz, email, telefon:</label>',
                '<input type="text" id="', inputId, '" class="medium-editor-toolbar-input" placeholder="blog.cz, email@web.cz, &hellip;">'
            );

            /*Tlačítka*/
            template.push(
                '<div class="medium-editor-form-btns">'
            );

            //uložit
            template.push(
                '<a href="#" class="medium-editor-toolbar-save">',
                this.getEditorOption('buttonLabels') === 'fontawesome' ? '<i class="fa fa-check"></i>' : this.formSaveLabel,
                '</a>'
            );

            //zavřít
            template.push(
                '<a href="#" class="medium-editor-toolbar-close">',
                this.getEditorOption('buttonLabels') === 'fontawesome' ? '<i class="fa fa-times"></i>' : this.formCloseLabel,
                '</a>'
            );

            template.push(
                '</div>'//form-btns
            );

            template.push(
                '</div>'//tab-anchor
            );

            /*Výběr sekcí*/
            template.push(
                '<div class="medium-editor-form-tab medium-editor-form-tab-section">'
            );


            this.selectId = "medium-editor-toolbar-section-select-" + this.base.id;
            this.customSelectorId = "medium-editor-form-selector-" + this.base.id;

            //získání sekcí stránky
            var options = this.getSections ? this.getSections() : [],

                optionsTemplate = [
                    '<option value="">nevybráno...</option>'
                ],

                customSelectorTemplate = [
                    '<div id="', this.customSelectorId, '" class="medium-editor-form-selector">'
                ];


            options.forEach(function (section) {

                optionsTemplate.push(
                    '<option value="#', section.internalId, '">', section.name, '</option>'
                );

                customSelectorTemplate.push(
                    '<div class="medium-editor-form-selector-option" data-value="#', section.internalId, '">', $("<span>").html(section.name).text(), '</div>'
                );
            });

            customSelectorTemplate.push(
                "</div>"//selector
            );

            //přidání výběru sekcí do templatu
            template.push(
                '<select style="', hideFormElement, '" class="medium-editor-toolbar-section-select" id="', this.selectId, '">',
                    optionsTemplate.join(""),
                '</select>',
                customSelectorTemplate.join("")
            );

            template.push(
                '</div>'//tab-section
            );

            template.push(
                '</div>'//tabs
            );

            return template.join('');
        };


        MediumEditor.extensions.anchor.prototype._getFormOpts = MediumEditor.extensions.anchor.prototype.getFormOpts;

        MediumEditor.extensions.anchor.prototype.getFormOpts = function () {

            var opts = MediumEditor.extensions.anchor.prototype._getFormOpts.apply(this, arguments);

            //pokud není zadán odkaz použije se hodnota selektu
            if (!this.getInput().value.trim()) {

                opts.url = this.getSelect().value;

                this.getSelect().value = "";

            } else {

                //odkazy, které se neodkazují na interní sekce, se otevírají v novém okně (tabu)
                opts.target = '_blank';
            }

            return opts;
        };

        //vrátí se <select /> sekcí stránky
        MediumEditor.extensions.anchor.prototype.getSelect = function () {

            return this.getForm().querySelector('select.medium-editor-toolbar-section-select');
        };

        MediumEditor.extensions.anchor.prototype._destroy = MediumEditor.extensions.anchor.prototype.destroy;

        MediumEditor.extensions.anchor.prototype.destroy = function () {

            var original = MediumEditor.extensions.anchor.prototype._destroy.apply(this, arguments);

            if (this.customSelectorEventNames) {

                this.$customSelector.off(this.customSelectorEventNames);

                this.$customSelector = null;
                this.$select = null;
            }

            return original;
        };

        MediumEditor.extensions.anchor.prototype._showForm = MediumEditor.extensions.anchor.prototype.showForm;

        MediumEditor.extensions.anchor.prototype.showForm = function () {

            MediumEditor.extensions.anchor.prototype._showForm.apply(this, arguments);

            var self = this;

            this.customSelectorEventNames = "click.medium-editor-form-selector-" + this.base.id + " touchend.medium-editor-form-selector-" + this.base.id + " touchmove.medium-editor-form-selector-" + this.base.id;
            this.formNavCloseEventNames = "click.medium-editor-form-nav-close-" + this.base.id + " touchend.medium-editor-form-nav-close-" + this.base.id;
            this.$customSelector = this.$customSelector || $("#" + this.customSelectorId);
            this.$firstTabOpen = this.$firstTabOpen || $(this.getForm()).find("[id*='medium-editor-open-tab-1']");
            this.$formNavClose = this.$formNavClose || $(this.getForm()).find(".medium-editor-form-nav-close");

            //otevřít první tab
            this.$firstTabOpen.prop("checked", "checked");

            //vlastní zavírací tlačítko
            this.$formNavClose.on(this.formNavCloseEventNames, function (e) {

                self.doFormCancel();

                e.preventDefault();
                return false;
            });

            var moved = false;

            //aktivace vlastního selektrou sekcí
            this.$customSelector.on(this.customSelectorEventNames, ".medium-editor-form-selector-option", function (e) {

                if (e.type === "touchmove") {

                    moved = true;

                    return;
                }

                if (moved) {

                    moved = false;

                    return;
                }

                self.handleSectionSelection.call(self, this);

                e.preventDefault();
                return false;
            });

            this.$customSelector.perfectScrollbar("destroy").perfectScrollbar();

            this.getForm().classList.add("medium-editor-action-createLink-displayed");
        };

        MediumEditor.extensions.anchor.prototype.handleSectionSelection = function (option) {

            var $option = $(option),
                value = $option.data("value");

            this.$select = this.$select || $("#" + this.selectId);

            this.$select.val(value);

            this.getInput().value = "";

            this.doFormSave();
        };

        MediumEditor.extensions.anchor.prototype._hideForm = MediumEditor.extensions.anchor.prototype.hideForm;

        MediumEditor.extensions.anchor.prototype.hideForm = function () {

            MediumEditor.extensions.anchor.prototype._hideForm.apply(this, arguments);

            if (this.customSelectorEventNames) {

                this.$customSelector.perfectScrollbar("destroy");

                this.$customSelector.off(this.customSelectorEventNames);
            }

            if (this.formNavCloseEventNames) {

                this.$formNavClose.off(this.formNavCloseEventNames);
            }

            this.getForm().classList.remove("medium-editor-action-createLink-displayed");
        };

        MediumEditor.extensions.anchor.prototype.isDisplayed = function () {

            return this.getForm().classList.contains("medium-editor-action-createLink-displayed");
        };
    };
}));
