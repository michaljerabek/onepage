<span on-tap="openPageElementSettings:{{'edit1'}}">upravit</span>

{{#if .openPageElementSettings === 'edit1'}}
<PageElementSettings
    data="{{.element}}"
    positionElement="{{.pageElementSettingsPositionElement}}"
>
    <div decorator="ResizableBox:true"
         data-min-resize-width="464"
         data-max-resize-width="464"
         data-max-resize-height="464"
         style="max-width: 272px; max-height: 336px; display: flex"
    >

        <div class="E_PageElementSettings--scrollable ResizableBox--scrollable" style="width: 100%">
            <div class="E_PageElementSettings--scrolling-content ResizableBox--scrolling-content">
                <IconBrowser />
            </div>
        </div>

    </div>
</PageElementSettings>
{{/if}}

