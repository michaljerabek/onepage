<div intro-outro="fade" class="E_PageElementSettings">
    <div class="E_PageElementSettings--wrapper">
        <button class="E_PageElementSettings--close" on-tap="closeThisSettings">&times;</button>
        <button class="E_PageElementSettings--move" on-mousedown-touchstart="activateMover(event)">M</button>
        {{> content}}
    </div>
    <div on-mousedown-touchstart="activateResizer(event, 'top-left')" class="E_PageElementSettings--resizer E_PageElementSettings--resizer__top-left"></div>
    <div on-mousedown-touchstart="activateResizer(event, 'top-right')" class="E_PageElementSettings--resizer E_PageElementSettings--resizer__top-right"></div>
    <div on-mousedown-touchstart="activateResizer(event, 'bottom-left')" class="E_PageElementSettings--resizer E_PageElementSettings--resizer__bottom-left"></div>
    <div on-mousedown-touchstart="activateResizer(event, 'bottom-right')" class="E_PageElementSettings--resizer E_PageElementSettings--resizer__bottom-right"></div>
    <div on-mousedown-touchstart="activateResizer(event, 'top')" class="E_PageElementSettings--resizer E_PageElementSettings--resizer__top"></div>
    <div on-mousedown-touchstart="activateResizer(event, 'bottom')" class="E_PageElementSettings--resizer E_PageElementSettings--resizer__bottom"></div>
    <div on-mousedown-touchstart="activateResizer(event, 'left')" class="E_PageElementSettings--resizer E_PageElementSettings--resizer__left"></div>
    <div on-mousedown-touchstart="activateResizer(event, 'right')" class="E_PageElementSettings--resizer E_PageElementSettings--resizer__right"></div>
    <div class="E_PageElementSettings--resizer-hover"></div>
</div>
