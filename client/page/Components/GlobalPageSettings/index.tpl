<div class="E_GlobalPageSettings">

    <h2 class="E_PageMenu--title">Globální nastavení <span class="E_PageMenu--show-page" on-touchstart-touchend-hover="showPage">&#x1f441</span></h2>

    <section class="E_GlobalPageSettingss--section">

        <h3 class="
                E_PageMenu--sub-title
                E_PageMenu--sub-title__interactive
                {{#if .openGlobalSettingsWidget === 'font'}}E_PageMenu--sub-title__active{{/if}}
            "
            on-tap="set('openGlobalSettingsWidget', .openGlobalSettingsWidget === 'font' ? null : 'font')"
        >
            Písmo

            {{> dropDownIcon}}

            <span class="E_PageMenu--sub-title-value">
                {{.fontTypes[.settings.fontType].title}} + {{.fontTypes[.settings.fontType].body}}
            </span>
        </h3>

        {{#if .openGlobalSettingsWidget === "font"}}

        <PageMenuInlineWidget initMaxHeight="400" close=".openGlobalSettingsWidget">
            {{>fontSettings}}
        </PageMenuInlineWidget>

        {{/if}}

    </section>

    <section class="E_GlobalPageSettingss--section">

        <h3 class="E_PageMenu--sub-title">Další nadpis</h3>
    </section>

</div>

{{#partial dropDownIcon}}
    <div class="E_PageMenu--sub-title-dropdown">
        <svg><use xlink:href="#icon-triangle"></use></svg>
    </div>
{{/partial}}
