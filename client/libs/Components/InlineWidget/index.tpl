<section class="InlineWidget InlineWidget__{{.type}}"
    intro-outro="slide:{
        easing : 'cubic-bezier(0.1, 0.4, 0.4, 1)'
    }"
>

    <div class="InlineWidget--wrapper ResizableBox">

        <div class="InlineWidget--shadow"></div>

        <div class="InlineWidget--content ResizableBox--content"
             decorator="ResizableBox:false,true"
             data-max-resize-height="{{.maxResize || 768}}"
             style="max-height: {{.initMaxHeight || 320}}px"
        >

            <div class="InlineWidget--scrollable ResizableBox--scrollable ps-child">
                <div class="InlineWidget--scrolling-content ResizableBox--scrolling-content">

                    {{yield}}

                </div>
            </div>
        </div>

        {{#if .close}}

            <span class="InlineWidget--close ResizableBox--close" on-tap="setOnParent(.close.replace(/^\./, ''), null)" title="Zavřít">
                <svg><use xlink:href="#icon-x"></use></svg>
            </span>

        {{else}}

            <span class="InlineWidget--close ResizableBox--close" on-tap="InlineWidget--close" title="Zavřít">
                <svg><use xlink:href="#icon-x"></use></svg>
            </span>

        {{/if}}


        <span class="InlineWidget--min-max ResizableBox--min-max" on-tap="minmax(event)" title="Zvětšovat podle obsahu">
            <svg><use xlink:href="#icon-maximize"></use></svg>
        </span>

    </div>

    <div class="InlineWidget--resizer ResizableBox--resizer"
        on-mousedown-touchstart="activateResizer(event, 'bottom')"
    ></div>

</section>
