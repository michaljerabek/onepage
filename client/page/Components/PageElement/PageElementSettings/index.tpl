<div class="E_PageElementSettings--transition-wrapper"
    intro-outro="fade:{
        duration: 200,
        easing: 'linear'
    }"
>
    <div class="E_PageElementSettings">
        <div class="E_PageElementSettings--wrapper">
            <div class="E_PageElementSettings--title-bar">
                <div class="E_PageElementSettings--title" on-mousedown-touchstart="activateMover(event)">{{(settingsTitle ? settingsTitle + ' — ' : '') + section.name}}</div>
                <button class="E_PageElementSettings--close"   on-tap="closeThisSettings">&times;</button>
                <button class="E_PageElementSettings--min-max" on-tap="minmax(event)"    >M</button>
            </div>
            <div class="E_PageElementSettings--content">
                {{> content}}
            </div>
        </div>
        <div class="E_PageElementSettings--resizer E_PageElementSettings--resizer__top-left"     on-mousedown-touchstart="activateResizer(event, 'top-left')"></div>
        <div class="E_PageElementSettings--resizer E_PageElementSettings--resizer__top-right"    on-mousedown-touchstart="activateResizer(event, 'top-right')"></div>
        <div class="E_PageElementSettings--resizer E_PageElementSettings--resizer__bottom-left"  on-mousedown-touchstart="activateResizer(event, 'bottom-left')"></div>
        <div class="E_PageElementSettings--resizer E_PageElementSettings--resizer__bottom-right" on-mousedown-touchstart="activateResizer(event, 'bottom-right')"></div>
        <div class="E_PageElementSettings--resizer E_PageElementSettings--resizer__top"          on-mousedown-touchstart="activateResizer(event, 'top')"></div>
        <div class="E_PageElementSettings--resizer E_PageElementSettings--resizer__bottom"       on-mousedown-touchstart="activateResizer(event, 'bottom')"></div>
        <div class="E_PageElementSettings--resizer E_PageElementSettings--resizer__left"         on-mousedown-touchstart="activateResizer(event, 'left')"></div>
        <div class="E_PageElementSettings--resizer E_PageElementSettings--resizer__right"        on-mousedown-touchstart="activateResizer(event, 'right')"></div>
        <div class="E_PageElementSettings--resizer-hover"></div>
    </div>
</div>
