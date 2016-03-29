<section class="E_ColorSettings">

    <nav decorator="PageSectionSettingsBox" class="E_ColorSettings--menu">
        <ul class="E_ColorSettings--menu-list">
            {{>ColorSettingsNavItem {index: 1, settings: this}}}
        </ul>
    </nav>

    <section decorator="PageSectionSettingsBox" class="E_ColorSettings--ColorPicker">
        {{>ColorSettingsTab}}
    </section>

</section>

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
        <ColorPicker defer="true" output="{{this['color' + .openTab]}}" input="{{this['color' + .openTab] || this['color' + .openTab + '-input-default']}}"/>
    {{/if}}

    {{#if !.toggleTab}}
        <ColorPicker defer="true" output="{{this['color' + .openTab]}}" input="{{this['color' + .openTab] || this['color' + .openTab + '-input-default']}}"/>
    {{/if}}

{{/partial}}
