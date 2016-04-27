<span on-tap="openPageElementSettings:{{'edit1'}}">upravit</span>

{{#if .openPageElementSettings === 'edit1'}}
    <PageElementSettings
        data="{{.element}}"
        positionElement="{{.pageElementSettingsPositionElement}}"
    >
        <div decorator="PageElementSettingsBox"
            data-min-resize-width="475"
            data-max-resize-width="475"
            data-max-resize-height="475"
            style="max-width: 240px; max-height: 320px;"
        >
            <div class="E_PageElementSettings--scrolling-content">

                <ColorPicker output="{{.data.textColor}}" input="{{.data.textColor || 'black'}}" defer="true" noColor="true">
                    <ColorPickerPalette title="Nejpoužívanější" colors="{{mostUsedColors}}" />
                </ColorPicker>

            </div>
        </div>
    </PageElementSettings>
{{/if}}

