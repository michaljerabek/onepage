{{> Tabs [
        {
            name: "backgroundColor",
            text: "Pozadí"
        },
        {
            name: "textColor",
            text: "Text"
        },
        {
            name: "sections",
            text: "Sekce"
        }
    ]
}}

<div class="ResizableBox--scrollable"
    as-ResizableBox="true"
    data-min-resize-width="460"
    data-max-resize-width="460"
    data-max-resize-height="475"
    style="max-width: 240px; max-height: 320px;"
>

    <div class="E_PageElementSettings--scrolling-content ResizableBox--scrolling-content">

        {{#if !~/openTab || ~/openTab === "backgroundColor"}}

            <ColorPicker pathName="backgroundColor" output="{{.data.backgroundColor}}" input="{{.data.backgroundColor || .backgroundColor || .defaultColors.backgroundColor}}" defer="true" noColor="true">

                <ColorPickerPalette title="Nejpoužívanější" colors="{{.mostUsedColors}}" />
                <ColorPickerPalette title="Výchozí" colors="{{@this.Page.get('page.settings.colorPalette.colors')}}" id="defaultColors" />
                <ColorPickerPalette title="Pozadí" image="{{.image}}"  images="{{.sectionsBgImages}}"/>
                <ColorPickerPalette title="Obrázek" image="{{.image2}}"  images="{{.sectionImages}}"/>

            </ColorPicker>

        {{/if}}

        {{#if ~/openTab === "textColor"}}

            <ColorPicker pathName="textColor" output="{{.data.textColor}}" input="{{.data.textColor || .data.autoTextColor || .textColor || .defaultColors.textColor}}" defer="true" noColor="true">

                <ColorPickerPalette title="Nejpoužívanější" colors="{{.mostUsedColors}}" />
                <ColorPickerPalette title="Výchozí" colors="{{@this.Page.get('page.settings.colorPalette.colors')}}" id="defaultColors" />
                <ColorPickerPalette title="Pozadí" image="{{.image}}"  images="{{.sectionsBgImages}}"/>
                <ColorPickerPalette title="Obrázek" image="{{.image2}}"  images="{{.sectionImages}}"/>

            </ColorPicker>

        {{/if}}

        {{#if ~/openTab === "sections"}}

            <div class="E_PageElementSettings--offset">

                {{#each .sections}}

                <div class="E_PageElementMenuSettings--input E_PageElementMenuSettings--input__toggle">

                    {{> ToggleField {
                            size: "small",
                            text: .name ? .name[~/lang] : "",
                            value: "sections." + @key + ".addToMenu"
                        }
                    }}

                </div>

                {{/each}}

                <p class="E_PageElementSettings--note">V případě přidání nového odkazu se jako jeho text použije název dané sekce. Tento text je ovšem nezávislý na názvu, takže ho můžete změnit beze změny názvu sekce.</p>

            </div>

        {{/if}}

    </div>
</div>
