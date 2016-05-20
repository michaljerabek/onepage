<div class="E_ColorSettings"
    decorator="ResizableBox"
    data-max-resize-height="768"
    style="max-height: 320px"
>

    <div class="E_ColorSettings--menu E_PageSectionSettings--scrollable ResizableBox--scrollable">
        <div class="E_PageSectionSettingsMenu E_PageSectionSettings--scrolling-content ResizableBox--scrolling-content">
            <ul class="E_PageSectionSettingsMenu--list E_ColorSettings--menu-list">
                {{>ColorSettingsNavItem {index: 1, settings: this}}}
            </ul>

            {{> Button {
                    size: "small",
                    text: "Vygenerovat z výchozích",
                    fire: "generateRandomColors",
                    title: "Vybere barvy z výchozí palety a všechny nastavené barvy přepíše",
                    className: "E_ColorSettings--random-colors-button"
                }
            }}

        </div>
    </div>

    <div class="E_ColorSettings--ColorPicker E_PageSectionSettings--scrollable ResizableBox--scrollable">
        <div class="E_PageSectionSettings--scrolling-content ResizableBox--scrolling-content">{{>ColorSettingsTab}}</div>
    </div>

</div>

{{#partial ColorSettingsNavItem}}

    {{#if .settings["color" + .index + "-title"]}}

        <li class="E_PageSectionSettingsMenu--item
                {{#if ~/openTab === .index}}E_PageSectionSettingsMenu--item__active{{/if}}
                E_ColorSettings--menu-item
            "
            on-tap="set('openTab', .index)"
        >
            <span class="E_PageSectionSettingsMenu--title">{{.settings["color" + .index + "-title"]}}</span>
            <span class="E_PageSectionSettingsMenu--subtitle">{{.settings["color" + .index + "-subtitle"]}}</span>
        </li>

        {{>ColorSettingsNavItem {index: .index + 1, settings: .settings}}}

    {{/if}}

{{/partial}}

{{#partial ColorSettingsTab}}

    {{#if .toggleTab}}
        <ColorPicker pathName="{{this['color' + .openTab + '-pathName']}}" defer="true" noColor="true" output="{{this['color' + .openTab]}}" input="{{this['color' + .openTab] || this['color' + .openTab + '-input-default']}}" inputType="[[.lastInputType]]">
            <ColorPickerPalette title="Nejpoužívanější" colors="{{.mostUsedColors}}" />
            <ColorPickerPalette title="Výchozí" colors="{{@ractive.findParent('Page').get('page.settings.colorPalette.colors')}}" id="defaultColors" />
            [[#if .imageColors.background]]
                <ColorPickerPalette title="Pozadí" colors="{{.imageColors.background.colors}}" />
            [[/if]]
            [[#if !.imageColors.background]]
                <ColorPickerPalette id="background" title="Pozadí" image="{{.image}}" />
            [[/if]]
        </ColorPicker>
    {{/if}}

    {{#if !.toggleTab}}
        <ColorPicker pathName="{{this['color' + .openTab + '-pathName']}}" defer="true" noColor="true" output="{{this['color' + .openTab]}}" input="{{this['color' + .openTab] || this['color' + .openTab + '-input-default']}}" inputType="[[.lastInputType]]">
            <ColorPickerPalette title="Nejpoužívanější" colors="{{.mostUsedColors}}" />
            <ColorPickerPalette title="Výchozí" colors="{{@ractive.findParent('Page').get('page.settings.colorPalette.colors')}}" id="defaultColors" />
            [[#if .imageColors.background]]
                <ColorPickerPalette title="Pozadí" colors="{{.imageColors.background.colors}}" />
            [[/if]]
            [[#if !.imageColors.background]]
                <ColorPickerPalette id="background" title="Pozadí" image="{{.image}}" delay="[[.toggleTab === undefined ? (delayOpening ? 600 : 300) : 0]]" />
            [[/if]]
        </ColorPicker>
    {{/if}}

{{/partial}}
