{{> Tabs [
        {
            name: "backgroundColor",
            text: "Barva pozadí"
        },
        {
            name: "textColor",
            text: "Barva textu"
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

        {{#if !.openTab || .openTab === "backgroundColor"}}

            <ColorPicker pathName="backgroundColor" output="{{.data.backgroundColor}}" input="{{.data.backgroundColor || .backgroundColor || .defaultColors.backgroundColor}}" defer="true" noColor="true">

                <ColorPickerPalette title="Nejpoužívanější" colors="{{.mostUsedColors}}" />
                <ColorPickerPalette title="Výchozí" colors="{{@this.Page.get('page.settings.colorPalette.colors')}}" id="defaultColors" />
                <ColorPickerPalette title="Pozadí" image="{{.image}}"  images="{{.sectionsBgImages}}"/>

            </ColorPicker>

        {{/if}}

        {{#if .openTab === "textColor"}}

            <ColorPicker pathName="textColor" output="{{.data.textColor}}" input="{{.data.textColor || .data.autoTextColor || .textColor || .defaultColors.textColor}}" defer="true" noColor="true">

                <ColorPickerPalette title="Nejpoužívanější" colors="{{.mostUsedColors}}" />
                <ColorPickerPalette title="Výchozí" colors="{{@this.Page.get('page.settings.colorPalette.colors')}}" id="defaultColors" />
                <ColorPickerPalette title="Pozadí" image="{{.image}}"  images="{{.sectionsBgImages}}"/>

            </ColorPicker>

        {{/if}}

    </div>
</div>
