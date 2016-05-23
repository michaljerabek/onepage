
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
