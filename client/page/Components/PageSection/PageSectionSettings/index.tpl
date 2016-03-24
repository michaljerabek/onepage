<section class="E_PageSectionSettings" intro="slide:{delay: {{.delayOpening ? 300 : 0}}}" outro="slide">
    <div class="E_PageSectionSettings--wrapper">
        {{> content}}
        <button class="E_PageSectionSettings--close" on-tap="closeThisSettings">&times;</button>
    </div>
    <div on-mousedown-touchstart="activateResizer(event)" class="E_PageSectionSettings--resizer"></div>
</section>
