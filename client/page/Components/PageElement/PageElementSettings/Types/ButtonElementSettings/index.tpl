{{> Tabs [
        {
            name: "color",
            text: "Barva"
        },
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

            <ColorPicker pathName="color" output="{{.data.color}}" input="{{.data.color || .defaultColors.specialColor}}" defer="true" noColor="true">

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
                    className: "E_ButtonElementSettings--type"
                }
            }}

            {{#if .data.type === "link"}}


                <div class="E_ButtonElementSettings--link">

                    <div class="E_ButtonElementSettings--input">

                    <label class="E_ButtonElementSettings--label" for="E_ButtonElementSettings--link">URL adresa, email:</label>

                    {{> Text {
                            size: "small",
                            adaptive: true,
                            value: ".data.link",
                            id: "E_ButtonElementSettings--link"
                        }
                    }}

                    </div>

                    <div class="E_PageElementSettings--note E_ButtonElementSettings--note">
                        Pro nastavení odkazu na jinou sekci na této stránce, použijte nastavení <q>Tlačítko</q>.
                    </div>

                </div>

            {{/if}}

            {{#if .data.type === "button"}}

            <div class="E_ButtonElementSettings--button">

                <div class="E_ButtonElementSettings--input E_ButtonElementSettings--input__toggle {{#if .data.scrollToSection}}E_ButtonElementSettings--input__on{{/if}}">

                {{> ToggleField {
                        size: "small",
                        text: "Přesunout na sekci",
                        value: "data.scrollToSection"
                    }
                }}

                </div>

                {{#if .data.scrollToSection}}

                    <div intro="slide" outro="{{#if .data.type === 'button'}}slide{{/if}}:{delay:100}" class="E_ButtonElementSettings--input E_ButtonElementSettings--input__select">

                    {{> Select {
                            adaptive: true,
                            size: "small",
                            value: "data.section",
                            options: @this.getSections()
                        }
                    }}

                    </div>

                {{/if}}

                <div class="E_ButtonElementSettings--input E_ButtonElementSettings--input__toggle {{#if .data.addToCart}}E_ButtonElementSettings--input__on{{/if}}">

                {{> ToggleField {
                        size: "small",
                        text: "Vložit produkt do košíku",
                        value: "data.addToCart"
                    }
                }}

                </div>

                {{#if .data.addToCart}}

                    <div intro="slide" outro="{{#if .data.type === 'button'}}slide{{/if}}:{delay:100}" class="E_ButtonElementSettings--input E_ButtonElementSettings--input__select">

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

                <div class="E_ButtonElementSettings--input E_ButtonElementSettings--input__toggle {{#if .data.download}}E_ButtonElementSettings--input__on{{/if}}">

                {{> ToggleField {
                        size: "small",
                        text: "Stáhnout soubor",
                        value: "data.download"
                    }
                }}

                </div>

                {{#if .data.download}}

                    <div intro="slide" outro="{{#if .data.type === 'button'}}slide{{/if}}:{delay:100}" class="E_ButtonElementSettings--input E_ButtonElementSettings--input__select">

                    {{> Select {
                            adaptive: true,
                            size: "small",
                            value: "data.file",
                            options: [{
                                text: "Vyberte soubor...",
                                value: ""
                            }]
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
