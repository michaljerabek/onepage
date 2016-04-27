<section class="E_PageSectionSettings"
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
        <button class="E_PageSectionSettings--close"   on-tap="closeThisSettings">&times;</button>
        <button class="E_PageSectionSettings--min-max" on-tap="minmax(event)">M</button>
    </div>
    <div class="E_PageSectionSettings--resizer"
        on-mousedown-touchstart="activateResizer(event)"
    ></div>
</section>
