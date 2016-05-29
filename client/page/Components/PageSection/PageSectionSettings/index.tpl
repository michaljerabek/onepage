<section class="E_PageSectionSettings {{#if .multipleTabs}}E_PageSectionSettings__multiple-tabs{{/if}}"
    intro="slide:{
        delay   : {{ .delayOpening ? 300 : 0 }},
        easing  : 'cubic-bezier(0.1, 0.4, 0.4, 1)'
    }"
    outro="slide:{
        easing  : 'cubic-bezier(0.1, 0.4, 0.4, 1)'
    }"
>
    <ProgressBar id="{{.data.internalId}}" />

    <div class="E_PageSectionSettings--wrapper ResizableBox">

        <div class="E_PageSectionSettings--shadow"></div>

        <div class="E_PageSectionSettings--wrapper-2">

            {{#if @this.partials.pageSectionSettingsContent}}

                {{> pageSectionSettingsContent}}

            {{else}}

                {{> content}}

            {{/if}}

        </div>

        <span class="E_PageSectionSettings--close ResizableBox--close" on-tap="closeThisSectionSettings" title="Zavřít">
            <svg><use xlink:href="#icon-x"></use></svg>
        </span>

        {{#if !.notResizable}}
            <span class="E_PageSectionSettings--min-max ResizableBox--min-max" on-tap="minmax(event)" title="Zvětšovat podle obsahu">
                <svg><use xlink:href="#icon-maximize"></use></svg>
            </span>
        {{/if}}

    </div>

    <div class="E_PageSectionSettings--resizer ResizableBox--resizer"
        on-mousedown-touchstart="activateResizer(event, 'bottom')"
    ></div>

</section>
