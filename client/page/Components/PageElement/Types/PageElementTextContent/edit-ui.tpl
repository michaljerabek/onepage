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
            <ColorPicker output="{{.data.color}}" input="{{.data.color || 'black'}}" defer="true"></ColorPicker>
        </div>
    </PageElementSettings>
{{/if}}

