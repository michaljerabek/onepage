/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/

(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        module.exports = factory();

    } else {

        root.MediumEditorAnchor = factory();
    }

}(this, function () {

    return function (MediumEditor) {

        MediumEditor.extensions.anchor.prototype.getTemplate = function () {
            var template = [
                '<input type="text" class="medium-editor-toolbar-input" placeholder="', this.placeholderText, '">'
            ];

            //získání sekcí stránky
            var options = this.getSections ? this.getSections() : [],
                optionsTemplate = [
                    '<option value="">nevybráno...</option>'
                ];

            options.forEach(function (section) {

                optionsTemplate.push(
                    '<option value="#' + section.internalId + '">' + section.name + '</option>'
                );
            });

            //přidání výběru sekcí do templatu
            template.push(
                '<label for="medium-editor-section-select-' + this.base.id + '">Vyberte sekci:</label>',
                '<select style="width: 100%" name="medium-editor-section-select" class="medium-editor-section-select" id="medium-editor-section-select-' + this.base.id + '">',
                    optionsTemplate.join(),
                '</select>'
            );

            template.push(
                '<a href="#" class="medium-editor-toolbar-save">',
                    this.getEditorOption('buttonLabels') === 'fontawesome' ? '<i class="fa fa-check"></i>' : this.formSaveLabel,
                '</a>'
            );

            template.push(
                '<a href="#" class="medium-editor-toolbar-close">',
                    this.getEditorOption('buttonLabels') === 'fontawesome' ? '<i class="fa fa-times"></i>' : this.formCloseLabel,
                '</a>'
            );

            // both of these options are slightly moot with the ability to
            // override the various form buildup/serialize functions.

            if (this.targetCheckbox) {
                // fixme: ideally, this targetCheckboxText would be a formLabel too,
                // figure out how to deprecate? also consider `fa-` icon default implcations.
                template.push(
                    '<div class="medium-editor-toolbar-form-row">',
                    '<input type="checkbox" class="medium-editor-toolbar-anchor-target">',
                    '<label>',
                    this.targetCheckboxText,
                    '</label>',
                    '</div>'
                );
            }

            if (this.customClassOption) {
                // fixme: expose this `Button` text as a formLabel property, too
                // and provide similar access to a `fa-` icon default.
                template.push(
                    '<div class="medium-editor-toolbar-form-row">',
                    '<input type="checkbox" class="medium-editor-toolbar-anchor-button">',
                    '<label>',
                    this.customClassOptionText,
                    '</label>',
                    '</div>'
                );
            }

            return template.join('');

        };


        MediumEditor.extensions.anchor.prototype._getFormOpts = MediumEditor.extensions.anchor.prototype.getFormOpts;

        MediumEditor.extensions.anchor.prototype.getFormOpts = function () {

            var opts = MediumEditor.extensions.anchor.prototype._getFormOpts.apply(this, arguments);

            if (!opts.url) {

                opts.url = this.getSelect().value;

                this.getSelect().value = "";
            }

            return opts;
        };

        MediumEditor.extensions.anchor.prototype.getSelect = function () {

            return this.getForm().querySelector('select.medium-editor-section-select');
        };

        MediumEditor.extensions.anchor.prototype._showForm = MediumEditor.extensions.anchor.prototype.showForm;

        MediumEditor.extensions.anchor.prototype.showForm = function () {

            MediumEditor.extensions.anchor.prototype._showForm.apply(this, arguments);

            this.getForm().classList.add("medium-editor-action-createLink-displayed");
        };

        MediumEditor.extensions.anchor.prototype._hideForm = MediumEditor.extensions.anchor.prototype.hideForm;

        MediumEditor.extensions.anchor.prototype.hideForm = function () {

            MediumEditor.extensions.anchor.prototype._hideForm.apply(this, arguments);

            this.getForm().classList.remove("medium-editor-action-createLink-displayed");
        };

        MediumEditor.extensions.anchor.prototype.isDisplayed = function () {

            return this.getForm().classList.contains("medium-editor-action-createLink-displayed");
        };

    };

}));
