<div class="E_GlobalPageSettings" outro="attr:{duration: 300}">

    <h2 class="E_PageMenu--title">Nastavení stránky</h2>

    <section class="E_PageMenu--section E_GlobalPageSettings--font-settings">

        {{#with @ractive.findParent("Page").get("defaults.settings.fontType") as defaultFontType}}

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
                {{.fontTypes[.settings.fontType || .defaultFontType].title}} + {{.fontTypes[.settings.fontType || .defaultFontType].body}}
            </span>
        </h3>

        {{#if .openGlobalSettingsWidget === "font"}}

        <PageMenuInlineWidget initMaxHeight="800" close=".openGlobalSettingsWidget">
            {{> fontSettings}}
        </PageMenuInlineWidget>

        {{/if}}

        {{/with}}

    </section>

    <section class="E_PageMenu--section E_GlobalPageSettings--underline-title">

        {{> ToggleField {
                text: "Podtržení nadpisů",
                size: "small",
                value: "settings.underlineTitles"
            }
        }}

    </section>

    <section class="E_PageMenu--section E_GlobalPageSettings--roundness">

        <h3 class="E_PageMenu--sub-title">Zaoblení elementů</h3>

        {{> Switch {
                adaptive: true,
                size: "small",
                value: "settings.roundness",
                defaultValue: @ractive.findParent("Page").get("defaults.settings.roundness"),
                options: [
                    {
                        text: "Žádné",
                        value: 0,
                        icon: "#icon-square"
                    },
                    {
                        text: "Mírné",
                        value: 10,
                        icon: "#icon-round-square"
                    },
                    {
                        text: "Střední",
                        value: 20,
                        icon: "#icon-round-square-2"
                    },
                    {
                        text: "Kulaté",
                        value: 30,
                        icon: "#icon-circle"
                    },
                    {
                        text: "Kontrastní",
                        value: 40,
                        icon: "#icon-square-circle"
                    }
                ]
            }
        }}

    </section>

    <section class="E_PageMenu--section E_GlobalPageSettings--animations">

        <h3 class="E_PageMenu--sub-title">Animace</h3>

        {{> Switch {
                adaptive: true,
                size: "small",
                value: "settings.animations",
                defaultValue: @ractive.findParent("Page").get("defaults.settings.animations"),
                options: [
                    {
                        text: "Jemné",
                        value: 0,
                        icon: "#icon-magic-1"
                    },
                    {
                        text: "Normální",
                        value: 10,
                        icon: "#icon-magic-2"
                    },
                    {
                        text: "Rychlé",
                        value: 20,
                        icon: "#icon-magic-3"
                    },
                    {
                        text: "Zábavné",
                        value: 30,
                        icon: "#icon-magic-4"
                    }
                ]
            }
        }}

    </section>

    <section class="E_PageMenu--section E_GlobalPageSettings--color-palette">


        <h3 class="E_PageMenu--sub-title">
            Výchozí barvy

            <ul class="E_GlobalColorPaletteSettings--colors E_GlobalColorPaletteSettings--selected-palette" on-tap="toggle('toggleColorPicker')">

                {{#each .settings.colorPalette.colors}}
                    <li class="E_GlobalColorPaletteSettings--color"
                        style="background-color: {{.}}"
                        on-tap="set('openGlobalSettingsWidget', ~/openGlobalSettingsWidget && ~/openGlobalSettingsWidget.colorKey === @key ? null : { colorKey: @key })"
                    ></li>
                {{/each}}

            </ul>
        </h3>

        {{> Button {
                size: "small",
                text: "Palety",
                title: "Vybrat paletu",
                set: "openGlobalSettingsWidget",
                value: .openGlobalSettingsWidget === "colors" ? null : "colors",
                state: .openGlobalSettingsWidget === "colors" ? "active" : "",
                icon: "#icon-triangle",
                iconW: 10,
                iconH: 10,
                iconR: .openGlobalSettingsWidget === "colors" ? 180 : 90
            }
        }}


        {{#with .settings.colorPalette || @ractive.set('settings.colorPalette', @ractive.findParent("Page").get("defaults.settings.colorPalette")) as __def}}

            {{#if .openGlobalSettingsWidget === "colors"}}

                <PageMenuInlineWidget initMaxHeight="320" close=".openGlobalSettingsWidget" connectWith="{id:'colors', opener: 'openGlobalSettingsWidget'}">
                    {{> colorPaletteSettings}}
                </PageMenuInlineWidget>

            {{elseif typeof .openGlobalSettingsWidget === "object" && typeof .openGlobalSettingsWidget.colorKey !== "undefined"}}

                <PageMenuInlineWidget initMaxHeight="400" close=".openGlobalSettingsWidget" connectWith="{id:'colors', opener: 'openGlobalSettingsWidget'}">

                    {{#if .toggleColorPicker}}
                        <ColorPicker output="{{.settings.colorPalette.colors[.openGlobalSettingsWidget.colorKey]}}"/>
                    {{else}}
                        <ColorPicker output="{{.settings.colorPalette.colors[.openGlobalSettingsWidget.colorKey]}}"/>
                    {{/if}}

                </PageMenuInlineWidget>

            {{/if}}

        {{/with}}

    </section>

</div>

{{#partial dropDownIcon}}
    <div class="E_PageMenu--sub-title-dropdown">
        <svg><use xlink:href="#icon-triangle"></use></svg>
    </div>
{{/partial}}
