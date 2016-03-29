<span class="E_Editor__content" style="color: {{.section.color}}" contenteditable="{{!!editMode}}" value="{{.section.name}}"></span>

{{#if editMode}}

    <button on-tap="openPageElementSettings:{{'edit1'}}">upravit</button>

    {{#if .openPageElementSettings === 'edit1'}}
        <PageElementSettings data="{{.section}}" positionElement="{{.pageElementSettingsPositionElement}}">
            <div decorator="PageElementSettingsBox" style="max-width: 240px; max-height: 320px; padding-top: 16px;">
                <ColorPicker output="{{.data.color}}" input="{{.data.color || 'black'}}" defer="true"></ColorPicker>
            </div>
        </PageElementSettings>
    {{/if}}

{{/if}}

