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

    <div class="E_PageSectionSettings--wrapper">

        <div class="E_PageSectionSettings--shadow"></div>

        <div class="E_PageSectionSettings--wrapper-2">{{> content}}</div>

        <span class="E_PageSectionSettings--close" on-tap="closeThisSettings" title="Zavřít">
            <svg><use xlink:href="#icon-x"></use></svg>
        </span>

        <span class="E_PageSectionSettings--min-max" on-tap="minmax(event)" title="Zvětšovat podle obsahu">
            <svg><use xlink:href="#icon-maximize"></use></svg>
        </span>

    </div>
    <div class="E_PageSectionSettings--resizer"
        on-mousedown-touchstart="activateResizer(event)"
    ></div>

</section>
