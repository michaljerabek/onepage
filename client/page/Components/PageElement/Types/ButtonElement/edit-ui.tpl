<span on-tap="@this.fire('openPageElementSettings', event, 'edit1')">upravit</span>

{{#if .openPageElementSettings === 'edit1'}}
    <PageElementSettings
        data="{{.element}}"
        positionElement="{{.pageElementSettingsPositionElement}}"
    >
        <div class="ResizableBox--scrollable" decorator="ResizableBox:true"
            data-min-resize-width="475"
            data-max-resize-width="475"
            data-max-resize-height="475"
            style="max-width: 240px; max-height: 320px;"
        >

            <div class="E_PageElementSettings--scrolling-content ResizableBox--scrolling-content">

                <ColorPicker pathName="color" output="{{.data.color}}" input="{{.data.color || .defaultColors.specialColor}}" defer="true" noColor="true">
                    <ColorPickerPalette title="Nejpoužívanější" colors="{{mostUsedColors}}" />
                </ColorPicker>

            </div>
        </div>
    </PageElementSettings>
{{/if}}

