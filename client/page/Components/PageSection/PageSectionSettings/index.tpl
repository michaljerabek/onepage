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

        <span class="E_PageSectionSettings--close" on-tap="closeThisSettings">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" /></svg>
        </span>

        <span class="E_PageSectionSettings--min-max" on-tap="minmax(event)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M24 13h-2v9h-9v2h11v-11zm-24-13h11v2h-9v9h-2v-11zm20.622 7.621l-13 13 3.378 3.379h-11v-10.999l3.378 3.378 13-13-3.378-3.379h11v10.999l-3.378-3.378z"/></svg>
        </span>

    </div>
    <div class="E_PageSectionSettings--resizer"
        on-mousedown-touchstart="activateResizer(event)"
    ></div>

</section>
