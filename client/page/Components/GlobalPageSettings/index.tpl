<div class="E_GlobalPageSettings" outro="attr:{duration: 300}">

    <h2 class="E_PageMenu--title">Nastavení vzhledu</h2>

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
                iconR: .openGlobalSettingsWidget === "colors" ? 180 : 90,
                className: "E_GlobalColorPaletteSettings--palettes-button"
            }
        }}

            {{#with .settings.colorPalette || @ractive.set('settings.colorPalette', @ractive.findParent("Page").get("defaults.settings.colorPalette")) as __def}}

                <div>
                {{#if .openGlobalSettingsWidget === "colors"}}

                    <PageMenuInlineWidget initMaxHeight="320" close=".openGlobalSettingsWidget" connectWith="{id:'colors', opener: 'openGlobalSettingsWidget'}">
                        {{> colorPaletteSettings}}
                    </PageMenuInlineWidget>

                {{/if}}
                </div>

                <div>
                {{#if typeof .openGlobalSettingsWidget === "object" && typeof .openGlobalSettingsWidget.colorKey !== "undefined"}}

                    <PageMenuInlineWidget initMaxHeight="400" close=".openGlobalSettingsWidget" connectWith="{id:'colors', opener: 'openGlobalSettingsWidget'}">

                        {{#if .toggleColorPicker}}
                        <ColorPicker output="{{.settings.colorPalette.colors[.openGlobalSettingsWidget.colorKey]}}" inputType="[[.lastInputType]]" defer="true"/>
                        {{else}}
                        <ColorPicker output="{{.settings.colorPalette.colors[.openGlobalSettingsWidget.colorKey]}}" inputType="[[.lastInputType]]" defer="true"/>
                        {{/if}}

                    </PageMenuInlineWidget>

                {{/if}}
                </div>

            {{/with}}


        {{> Button {
                size: "small",
                text: "Vygenerovat novou kombinaci",
                set: "settings.colorPalette",
                value: {
                    colors: .settings.colorPalette.colors.slice(),
                    headerImg: .settings.colorPalette.headerImg
                },
                className: "E_GlobalColorPaletteSettings--regenerate-button"
            }
        }}

    </section>

    <h2 class="E_PageMenu--title">Nastavení jazyků</h2>

    <section class="E_PageMenu--section E_GlobalPageSettings--language E_GlobalLanguagesSettings">

        <h3 class="
                E_PageMenu--sub-title
                E_PageMenu--sub-title__interactive
                {{#if .openGlobalSettingsWidget === 'currentLang'}}E_PageMenu--sub-title__active{{/if}}
            "
            on-tap="set('openGlobalSettingsWidget', .openGlobalSettingsWidget === 'currentLang' ? null : 'currentLang')"
        >
            Aktuální jazyk
            {{#if .lang === .settings.lang.defaultLang}}
                <svg intro-outro="fade:{duration: 100}" class="E_GlobalLanguagesSettings--default-lang-icon" title="Jazky je nastaven jako výchozí"><use xlink:href="#icon-flag"></use></svg>
            {{/if}}

            {{> dropDownIcon}}

            <span class="E_PageMenu--sub-title-value">
                {{.languages.getName(.lang || "cs")}} ({{.lang || "cs"}})
            </span>
        </h3>

        <div>
        {{#if .openGlobalSettingsWidget === "currentLang"}}

            <PageMenuInlineWidget initMaxHeight="320" close=".openGlobalSettingsWidget">
                {{> languageSelector {
                    languages: Object.keys(.settings.lang.langs),
                    fire: "changeCurrentLang",
                    selected: .lang
                }}}
            </PageMenuInlineWidget>

        {{/if}}
        </div>

        <h3 class="
                E_PageMenu--sub-title
                E_PageMenu--sub-title__2
                E_PageMenu--sub-title__interactive
                {{#if .openGlobalSettingsWidget === 'templateLang'}}E_PageMenu--sub-title__active{{/if}}
            "
            on-tap="set('openGlobalSettingsWidget', .openGlobalSettingsWidget === 'templateLang' ? null : 'templateLang')"
        >
            Jazyk šablony

            {{> dropDownIcon}}

            <span class="E_PageMenu--sub-title-value">
                {{.languages.getName(.tplLang || 'cs')}} ({{.tplLang || 'cs'}})
            </span>
        </h3>

        <div>
        {{#if .openGlobalSettingsWidget === "templateLang"}}

            <PageMenuInlineWidget initMaxHeight="320" close=".openGlobalSettingsWidget">
                {{> languageSelector {
                    languages: .tplLangs,
                    fire: "changeTplLang",
                    selected: .tplLang
                }}}
            </PageMenuInlineWidget>

        {{/if}}
        </div>

        <div class="E_GlobalLanguagesSettings--buttons">

            {{> Button {
                    size: "small",
                    text: "Nastavit jako výchozí",
                    set: "settings.lang.defaultLang",
                    value: .lang,
                    state: .lang === .settings.lang.defaultLang ? "disabled" : "",
                    icon: "#icon-flag",
                    iconR: -6
                }
            }}

            {{> Button {
                    size: "small",
                    title: "Přidat jazyk",
                    set: "openGlobalSettingsWidget",
                    value: .openGlobalSettingsWidget === "newLang" ? null : "newLang",
                    state: .openGlobalSettingsWidget === "newLang" ? "active" : "",
                    icon: "#icon-plus"
                }
            }}

            {{> Button {
                    type: "danger",
                    state: .lang === .settings.lang.defaultLang || !(Object.keys(.settings.lang.langs).length - 1) ? "disabled": "",
                    size: "small",
                    title: "Odstranit jazyk",
                    fire: "showDialog",
                    event: {
                        title: "Odstranit jazyk",
                        text: "Opravdu chcete odstranit jazyk: " + .languages.getName(.lang) + "?",
                        type: "warn",
                        confirm: {
                            text: "Odstranit",
                            fire: "removeLang",
                            event: .lang,
                            context: @ractive
                        },
                        dismiss: {
                            active: 1
                        }
                    },
                    icon: "#icon-trash"
                }
            }}
        </div>

        <div>
        {{#if .openGlobalSettingsWidget === "newLang"}}

            <PageMenuInlineWidget initMaxHeight="320" close=".openGlobalSettingsWidget">
                {{> languageSelector {
                    languages: .languages.getCodes(),
                    fire: "createLang",
                    selected: Object.keys(.settings.lang.langs)
                }}}
            </PageMenuInlineWidget>

        {{/if}}
        </div>

    </section>

</div>

{{#partial dropDownIcon}}
    <div class="E_PageMenu--sub-title-dropdown">
        <svg><use xlink:href="#icon-triangle"></use></svg>
    </div>
{{/partial}}
