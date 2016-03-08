(function ($) {
    'use strict';

    var FontStyleForm = MediumEditor.extensions.form.extend({

        name: 'fontstyle',
        action: 'fontStyle',
        aria: 'change font style',
        contentDefault: 'Style', // ±
        contentFA: '<i class="fa fa-text-height"></i>',

        init: function () {
            MediumEditor.extensions.form.prototype.init.apply(this, arguments);
        },

        // Called when the button the toolbar is clicked
        // Overrides ButtonExtension.handleClick
        handleClick: function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (!this.isDisplayed()) {

                // Get fontStyle of current selection
                var fontStyle = null,

                    element = this.base.getSelectedParentElement();

                if (element) {

                    fontStyle = $(element).closest("font").attr("face");
                }

                this.showForm(fontStyle);
            }

            return false;
        },

        // Called by medium-editor to append form to the toolbar
        getForm: function (jQuery) {
            if (!this.form) {
                this.form = this.createForm();
                this.$form = $(this.form);
            }
            return jQuery ? this.$form : this.form;
        },

        // Used by medium-editor when the default toolbar is to be displayed
        isDisplayed: function () {
            return this.getForm().style.display === 'block';
        },

        hideForm: function () {
            this.getForm().style.display = 'none';
        },

        showForm: function (fontFace) {

            this.getForm(true).find("[data-value]").removeClass(this.base.options.activeButtonClass);

            if (fontFace) {
                this.getForm(true).find("[data-value='" + fontFace.replace(/["']/g, "") + "']").addClass(this.base.options.activeButtonClass);
            }

            this.base.saveSelection();
            this.hideToolbarDefaultActions();
            this.getForm().style.display = 'block';
            this.setToolbarPosition();
        },

        // Called by core when tearing down medium-editor (destroy)
        destroy: function () {
            if (!this.form) {
                return false;
            }

            if (this.form.parentNode) {
                this.form.parentNode.removeChild(this.form);
            }

            delete this.form;
        },

        doFormCancel: function () {
            this.base.restoreSelection();
            this.base.checkSelection();
            this.getForm().style.display = 'none';
        },

        // form creation and event handling
        createForm: function () {

            var template = [];

            template.push("<ul style=style=''>");
            template.push("<li style='width: 100%; box-sizing: border-box'><button style='padding: 0; border: none; line-height: 2.6; border-bottom: 1px solid #bbb; cursor: pointer; background: #ccc; width: 100%' class='medium-editor-action' data-value='title-100-ttu'><font face='title-100-ttu'>title-100-ttu</font></button></li>");
            template.push("<li style='width: 100%; box-sizing: border-box'><button style='padding: 0; border: none; line-height: 2.6; border-bottom: 1px solid #bbb; cursor: pointer; background: #ccc; width: 100%' class='medium-editor-action' data-value='title-600-ttu'><font face='title-600-ttu'>title-600-ttu</font></button></li>");
            template.push("<li style='width: 100%; box-sizing: border-box'><button style='padding: 0; border: none; line-height: 2.6; border-bottom: 1px solid #bbb; cursor: pointer; background: #ccc; width: 100%' class='medium-editor-action' data-value='title-900-ttu'><font face='title-900-ttu'>title-900-ttu</font></button></li>");
            template.push("<li style='width: 100%; box-sizing: border-box'><button style='padding: 0; border: none; line-height: 2.6; border-bottom: 1px solid #bbb; cursor: pointer; background: #ccc; width: 100%' class='medium-editor-action' data-value='title-100-ttn'><font face='title-100-ttn'>title-100-ttn</font></button></li>");
            template.push("<li style='width: 100%; box-sizing: border-box'><button style='padding: 0; border: none; line-height: 2.6; border-bottom: 1px solid #bbb; cursor: pointer; background: #ccc; width: 100%' class='medium-editor-action' data-value='title-600-ttn'><font face='title-600-ttn'>title-600-ttn</font></button></li>");
            template.push("<li style='width: 100%; box-sizing: border-box'><button style='padding: 0; border: none; line-height: 2.6; border-bottom: 1px solid #bbb; cursor: pointer; background: #ccc; width: 100%' class='medium-editor-action' data-value='title-900-ttn'><font face='title-900-ttn'>title-900-ttn</font></button></li>");
            template.push("<li style='width: 100%; box-sizing: border-box'><button style='padding: 0; border: none; line-height: 2.6; border-bottom: 1px solid #bbb; cursor: pointer; background: #ccc; width: 100%' class='medium-editor-action' data-value='text-100-ttu'><font face='text-100-ttu'>text-100-ttu</font></button></li>");
            template.push("<li style='width: 100%; box-sizing: border-box'><button style='padding: 0; border: none; line-height: 2.6; border-bottom: 1px solid #bbb; cursor: pointer; background: #ccc; width: 100%' class='medium-editor-action' data-value='text-600-ttu'><font face='text-600-ttu'>text-600-ttu</font></button></li>");
            template.push("<li style='width: 100%; box-sizing: border-box'><button style='padding: 0; border: none; line-height: 2.6; border-bottom: 1px solid #bbb; cursor: pointer; background: #ccc; width: 100%' class='medium-editor-action' data-value='text-900-ttu'><font face='text-900-ttu'>text-900-ttu</font></button></li>");
            template.push("<li style='width: 100%; box-sizing: border-box'><button style='padding: 0; border: none; line-height: 2.6; border-bottom: 1px solid #bbb; cursor: pointer; background: #ccc; width: 100%' class='medium-editor-action' data-value='text-100-ttn'><font face='text-100-ttn'>text-100-ttn</font></button></li>");
            template.push("<li style='width: 100%; box-sizing: border-box'><button style='padding: 0; border: none; line-height: 2.6; border-bottom: 1px solid #bbb; cursor: pointer; background: #ccc; width: 100%' class='medium-editor-action' data-value='text-600-ttn'><font face='text-600-ttn'>text-600-ttn</font></button></li>");
            template.push("<li style='width: 100%; box-sizing: border-box'><button style='padding: 0; border: none; line-height: 2.6; border-bottom: 1px solid #bbb; cursor: pointer; background: #ccc; width: 100%' class='medium-editor-action' data-value='text-900-ttn'><font face='text-900-ttn'>text-900-ttn</font></button></li>");
            template.push("</ul>");

            var $wrapper = $("<div class='medium-editor-toolbar-form' style='width: 160px; position: absolute; top: -52px; left: -80px; height: 200px; background: black; text-align: center; overflow: auto'>");

            $wrapper.html(template.join(""));

            this.on($wrapper[0], 'click', this.selectFontFace.bind(this));

            return $wrapper[0];//
        },

        selectFontFace: function (e) {

            var $element = $(this.base.getSelectedParentElement()).parentsUntil("[data-medium-editor-element]");

            $element = $element[0] ? $element.last() : $(this.base.getSelectedParentElement());

            this.base.selectElement($element[0]);

            this.base.options.ownerDocument.execCommand('fontname', null, $(e.target).closest("[data-value]").attr("data-value"));
            this.execAction(null);
        }
    });

    MediumEditor.extensions.fontStyle = FontStyleForm;
}(jQuery));
