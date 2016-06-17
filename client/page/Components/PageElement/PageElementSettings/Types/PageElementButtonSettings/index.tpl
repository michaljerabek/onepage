{{> Tabs [
        {
            name: "color",
            text: .data.fill ? "Pozadí" : "Barva"
        },
        .data.fill ? {
            name: "userTextColor",
            text: "Text"
        } : null,
        {
            name: "action",
            text: "Akce"
        }
    ]
}}

<div class="ResizableBox--scrollable"
    decorator="ResizableBox:true"
    data-min-resize-width="460"
    data-max-resize-width="460"
    data-max-resize-height="475"
    style="max-width: 240px; max-height: 320px;"
>

    <div class="E_PageElementSettings--scrolling-content ResizableBox--scrolling-content">

        {{#if !.openTab || .openTab === "color"}}

            <ColorPicker pathName="color" output="{{.data.color}}" input="{{.data.color || .color || .defaultColors.specialColor}}" defer="true" noColor="true">

                <ColorPickerPalette title="Nejpoužívanější" colors="{{.mostUsedColors}}" />
                <ColorPickerPalette title="Výchozí" colors="{{@this.findParent('Page').get('page.settings.colorPalette.colors')}}" id="defaultColors" />
                <ColorPickerPalette title="Pozadí" image="{{.image}}"  images="{{.sectionsBgImages}}"/>

            </ColorPicker>

        {{/if}}

        {{#if .data.fill && .openTab === "userTextColor"}}

            <ColorPicker pathName="userTextColor" output="{{.data.userTextColor}}" input="{{.data.userTextColor || .data.textColor || .data.color}}" defer="true" noColor="true">

                <ColorPickerPalette title="Nejpoužívanější" colors="{{.mostUsedColors}}" />
                <ColorPickerPalette title="Výchozí" colors="{{@this.findParent('Page').get('page.settings.colorPalette.colors')}}" id="defaultColors" />
                <ColorPickerPalette title="Pozadí" image="{{.image}}"  images="{{.sectionsBgImages}}"/>

            </ColorPicker>

        {{/if}}


        {{#if .openTab === "action"}}

        <div class="E_PageElementSettings--offset">

            {{> Switch {

                    adaptive: true,
                    size: "small",
                    value: ".data.type",
                    options: [
                        {
                            text: "Tlačítko",
                            value: "button",
                            title: "Nastavit jako tlačítko pro přidání produktu to košíku, přesunutí na jinou sekci nebo pro stažení souboru."
                        },
                        {
                            text: "Odkaz",
                            value: "link",
                            title: "Nastavit jako hypertextový odkaz na externí stránku nebo email."
                        }
                    ],
                    className: "E_PageElementButtonSettings--type"
                }
            }}

            {{#if .data.type === "link"}}


                <div class="E_PageElementButtonSettings--link">

                    <div class="E_PageElementButtonSettings--input">

                    <label class="E_PageElementButtonSettings--label" for="E_PageElementButtonSettings--link">URL adresa, email:</label>

                    {{> Text {
                            size: "small",
                            adaptive: true,
                            value: ".data.link",
                            id: "E_PageElementButtonSettings--link"
                        }
                    }}

                    </div>

                    <div class="E_PageElementSettings--note E_PageElementButtonSettings--note">
                        Pro nastavení odkazu na jinou sekci na této stránce, použijte nastavení <q>Tlačítko</q>.
                    </div>

                </div>

            {{/if}}

            {{#if .data.type === "button"}}

            <div class="E_PageElementButtonSettings--button">

                <div class="E_PageElementButtonSettings--input E_PageElementButtonSettings--input__toggle {{#if .data.scrollToSection}}E_PageElementButtonSettings--input__on{{/if}}">

                {{> ToggleField {
                        size: "small",
                        text: "Přesunout na sekci",
                        value: "data.scrollToSection"
                    }
                }}

                </div>

                {{#if .data.scrollToSection}}

                    <div intro="slide" outro="{{#if .data.type === 'button'}}slide{{/if}}:{delay:100}" class="E_PageElementButtonSettings--input E_PageElementButtonSettings--input__select">

                    {{> Select {
                            adaptive: true,
                            size: "small",
                            value: "data.section",
                            options: @this.getSections()
                        }
                    }}

                    </div>

                {{/if}}

                <div class="E_PageElementButtonSettings--input E_PageElementButtonSettings--input__toggle {{#if .data.addToCart}}E_PageElementButtonSettings--input__on{{/if}}">

                {{> ToggleField {
                        size: "small",
                        text: "Vložit produkt do košíku",
                        value: "data.addToCart"
                    }
                }}

                </div>

                {{#if .data.addToCart}}

                    <div intro="slide" outro="{{#if .data.type === 'button'}}slide{{/if}}:{delay:100}" class="E_PageElementButtonSettings--input E_PageElementButtonSettings--input__select">

                    {{> Select {
                            adaptive: true,
                            size: "small",
                            value: "data.product",
                            options: [{
                                text: "Vyberte produkt...",
                                value: ""
                            }]
                        }
                    }}

                    </div>

                {{/if}}

                <div class="E_PageElementButtonSettings--input E_PageElementButtonSettings--input__toggle {{#if .data.download}}E_PageElementButtonSettings--input__on{{/if}}">

                {{> ToggleField {
                        size: "small",
                        text: "Stáhnout soubor",
                        value: "data.download"
                    }
                }}

                </div>

                {{#if .data.download}}

                    <div intro="slide" outro="{{#if .data.type === 'button'}}slide{{/if}}:{delay:100}" class="E_PageElementButtonSettings--input__file E_PageElementButtonSettings--input E_PageElementButtonSettings--input__select">

                    {{> Select {
                            adaptive: true,
                            size: "small",
                            value: "data.file",
                            options: [{
                                text: "Vyberte soubor...",
                                value: ""
                            }].concat(.files || [])
                        }
                    }}

                    <input type="file" name="file" id="E_PageElementButtonSettings--file-input" hidden>

                    {{> Button {
                            text: "Nahrát",
                            title: "Nahrát nový soubor",
                            size: "small",
                            type: .fileButtonType || "default",
                            state: .fileButtonState,
                            icon: "#icon-upload-2",
                            progress: .fileButtonProgress,
                            className: "E_PageElementButtonSettings--file-button",
                            fire: "uploadFile",
                            event: "#E_PageElementButtonSettings--file-input"
                        }
                    }}

                    </div>

                {{/if}}

            </div>

            {{/if}}



        </div>
        {{/if}}

    </div>
</div>
