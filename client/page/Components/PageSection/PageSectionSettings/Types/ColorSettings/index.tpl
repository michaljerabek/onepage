<div class="E_ColorSettings"
    decorator="PageSectionSettingsBox:.PageSectionSetitngs--scrollable"
    data-max-resize-height="768"
    style="max-height: 320px"
>

    <nav class="E_ColorSettings--menu PageSectionSetitngs--scrollable">
        <div class="E_PageSectionsSettings--scrolling-content">
            <ul class="E_ColorSettings--menu-list">
                {{>ColorSettingsNavItem {index: 1, settings: this}}}
            </ul>
        </div>
    </nav>

    <div class="E_ColorSettings--ColorPicker PageSectionSetitngs--scrollable">
        <div class="E_PageSectionsSettings--scrolling-content">{{>ColorSettingsTab}}</div>
    </div>

</div>

{{#partial ColorSettingsNavItem}}

    {{#if .settings["color" + .index + "-title"]}}

        <li class="E_ColorSettings--menu-item" on-tap="set('openTab', index)">
            {{.settings["color" + .index + "-title"]}}
        </li>

        {{>ColorSettingsNavItem {index: .index + 1, settings: .settings}}}

    {{/if}}

{{/partial}}

{{#partial ColorSettingsTab}}

    {{#if .toggleTab}}
        <ColorPicker defer="true" noColor="true" output="{{this['color' + .openTab]}}" input="{{this['color' + .openTab] || this['color' + .openTab + '-input-default']}}" inputType="[[.lastInputType]]">
            <ColorPickerPalette title="Nejpoužívanější" colors="{{.mostUsedColors}}" />
            [[#if .imageColors.background]]
                <ColorPickerPalette title="Pozadí" colors="{{.imageColors.background.colors}}" />
            [[/if]]
            [[#if !.imageColors.background]]
                <ColorPickerPalette id="background" title="Pozadí" image="{{.image}}" />
            [[/if]]
        </ColorPicker>
    {{/if}}

    {{#if !.toggleTab}}
        <ColorPicker defer="true" noColor="true" output="{{this['color' + .openTab]}}" input="{{this['color' + .openTab] || this['color' + .openTab + '-input-default']}}" inputType="[[.lastInputType]]">
            <ColorPickerPalette title="Nejpoužívanější" colors="{{.mostUsedColors}}" />
            [[#if .imageColors.background]]
                <ColorPickerPalette title="Pozadí" colors="{{.imageColors.background.colors}}" />
            [[/if]]
            [[#if !.imageColors.background]]
                <ColorPickerPalette id="background" title="Pozadí" image="{{.image}}" delay="[[.toggleTab === undefined ? (delayOpening ? 600 : 300) : 0]]" />
            [[/if]]
        </ColorPicker>
    {{/if}}

{{/partial}}
