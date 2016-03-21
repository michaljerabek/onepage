<div class="ColorPicker">

    <div class="ColorPicker--wrapper-1">
        <div class="ColorPicker--wrapper-2">

            <div class="ColorPicker--widget-wrapper">

                {{>HSV}}

                {{>Input}}

            </div><!--/ColorPicker--widget-wrapper-->

            <div class="ColorPicker--palettes">

                <ColorPickerPalette title="Vybraná / Původní" colors="[{{current}}, {{initial}}]" addNoColor="{{.noColor}}" type="default" />

                {{> content}}

            </div><!--/ColorPicker--palettes-->

        </div><!--/ColorPicker--wrapper-2-->
    </div><!--/ColorPicker--wrapper-1-->

</div><!--/ColorPicker-->

{{#partial HSV}}
<div class="ColorPicker--HSV-wrapper">

    {{>SVBox}}

    {{>HBox}}

</div><!--/ColorPicker--HSV-wrapper-->
{{/partial}}

{{#partial SVBox}}
<div class="ColorPicker--SV-box"
     on-mousedown-touchstart="activateSelector(event, 'SV')"
     style="
            background-image:
            linear-gradient(to bottom, rgba(0, 0, 0, 0), #000),
            linear-gradient(to right, #fff, {{.SVBoxHue}});
        "
>
    <div class="ColorPicker--SV-selector"
         on-mousedown-touchstart="activateSelector(event, 'SV')"
         style="
                transform: translate({{SVSelector.x}}px, {{SVSelector.y}}px);
                transition: {{.animate ? '' : 'none'}};
            "
    ></div>
</div><!--/ColorPicker--SV-box-->
{{/partial}}

{{#partial HBox}}
<div class="ColorPicker--H-box"
     on-mousedown-touchstart="activateSelector(event, 'H')"
 >
    <div class="ColorPicker--H-selector"
         on-mousedown-touchstart="activateSelector(event, 'H')"
         style="
                transform: translateY({{HSelector.y}}px);
                transition: {{.animate ? '' : 'none'}};
            "
    ></div>
</div><!--/ColorPicker--H-box-->
{{/partial}}

{{#partial Input}}
<div class="ColorPicker--input">

    <div class="ColorPicker--input-wrapper-1">
        <div class="ColorPicker--input-wrapper-2">

            <div class="ColorPicker--type-selector-wrapper">

                <select class="ColorPicker--type-selector" value="{{.inputType}}">
                    <option value="{{.TYPE_HEX}}">HEX</option>
                    <option value="{{.TYPE_RGB}}">RGB</option>
                </select>

            </div><!--/ColorPicker--type-selector-wrapper-->

            <div class="ColorPicker--input-text-wrapper">

                {{#if .inputType === .TYPE_HEX}}
                    <input type="text" value="{{.inputTextHEX}}" class="ColorPicker--input-text ColorPicker--input-text__hex" on-keyup="inputTextHEXChanged()" placeholder="RRGGBB">
                {{else}}
                    <input type="text" value="{{.inputTextR}}" class="ColorPicker--input-text ColorPicker--input-text-rgb" on-keyup="inputTextRGBChanged()" placeholder="R" title="Červená [0–255]">
                    <input type="text" value="{{.inputTextG}}" class="ColorPicker--input-text ColorPicker--input-text-rgb" on-keyup="inputTextRGBChanged()" placeholder="G" title="Zelená [0–255]">
                    <input type="text" value="{{.inputTextB}}" class="ColorPicker--input-text ColorPicker--input-text-rgb" on-keyup="inputTextRGBChanged()" placeholder="B" title="Modrá [0–255]">
                {{/if}}

            </div><!--/ColorPicker--input-text-wrapper-->

        </div><!--/ColorPicker--input-wrapper-2-->
    </div><!--/ColorPicker--input-wrapper-1-->

</div><!--/ColorPicker--input-->
{{/partial}}
