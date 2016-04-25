<span on-tap="openPageElementSettings:{{'edit1'}}">upravit</span>

{{#if .openPageElementSettings === 'edit1'}}
<PageElementSettings
    data="{{.element}}"
    positionElement="{{.pageElementSettingsPositionElement}}"
>
    <div decorator="PageElementSettingsBox:.E_PageElementSettings--scrollable"
         data-min-resize-width="475"
         data-max-resize-width="475"
         data-max-resize-height="475"
         style="max-width: 420px; max-height: 320px; display: flex"
    >

        <div class="E_PageElementSettings--scrollable" style="width: 100%">
            <div class="E_PageElementSettings--scrolling-content">
                <IconBrowser />
            </div>
        </div>

    </div>
</PageElementSettings>
{{/if}}

