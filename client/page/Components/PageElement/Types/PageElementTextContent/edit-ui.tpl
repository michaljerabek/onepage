<button on-tap="openPageElementSettings:{{'edit1'}}">upravit</button>

{{#if .openPageElementSettings === 'edit1'}}
    <PageElementSettings data="{{.element}}" positionElement="{{.pageElementSettingsPositionElement}}">
        <div decorator="PageElementSettingsBox" style="max-width: 240px; max-height: 320px; padding-top: 16px;">
            <ColorPicker output="{{.data.color}}" input="{{.data.color || 'black'}}" defer="true"></ColorPicker>
        </div>
    </PageElementSettings>
{{/if}}

