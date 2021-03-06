<div class="E_PageElementSettings--transition-wrapper"
    fade-in="{
        duration: 200,
        easing  : 'linear'
    }"
    fade-out="{
        duration: 200,
        easing  : 'linear'
    }"
>
    <div class="E_PageElementSettings E_PageElementSettings__{{.type}}">

        <div class="E_PageElementSettings--wrapper">

            <div class="E_PageElementSettings--title-bar">

                <div class="E_PageElementSettings--title" on-mousedown-touchstart="@this.activateMover(event)">

                    {{#if .settingsTitle}}
                        <span class="E_PageElementSettings--title-self">{{.settingsTitle}}</span>
                    {{/if}}

                    <span class="E_PageElementSettings--title-section">{{@this.PageSection.get('section.name.' + .lang)}}</span>
                </div>

                <span class="E_PageElementSettings--close ResizableBox--close" on-tap="@this.fire('closeThisSettings')" title="Zavřít">
                    <svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-x"></use></svg>
                </span>

                <span class="E_PageElementSettings--min-max ResizableBox--min-max" on-tap="@this.minmax(event)" title="Zvětšovat podle obsahu">
                    <svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-maximize"></use></svg>
                </span>

            </div>

            <div class="E_PageElementSettings--content {{#if typeof ~/openTab !== 'undefined'}}E_PageElementSettings--content__has-tabs{{/if}} ResizableBox ResizableBox__floating">

                {{#if @this.partials.pageElementSettingsContent}}

                    {{> pageElementSettingsContent}}

                {{else}}

                    {{> content}}

                {{/if}}

            </div>

        </div>

        <div class="E_PageElementSettings--resizer E_PageElementSettings--resizer__top-left"     on-mousedown-touchstart="@this.activateResizer(event, 'top-left')"></div>
        <div class="E_PageElementSettings--resizer E_PageElementSettings--resizer__top-right"    on-mousedown-touchstart="@this.activateResizer(event, 'top-right')"></div>
        <div class="E_PageElementSettings--resizer E_PageElementSettings--resizer__bottom-left"  on-mousedown-touchstart="@this.activateResizer(event, 'bottom-left')"></div>
        <div class="E_PageElementSettings--resizer E_PageElementSettings--resizer__bottom-right" on-mousedown-touchstart="@this.activateResizer(event, 'bottom-right')"></div>
        <div class="E_PageElementSettings--resizer E_PageElementSettings--resizer__top"          on-mousedown-touchstart="@this.activateResizer(event, 'top')"></div>
        <div class="E_PageElementSettings--resizer E_PageElementSettings--resizer__bottom"       on-mousedown-touchstart="@this.activateResizer(event, 'bottom')"></div>
        <div class="E_PageElementSettings--resizer E_PageElementSettings--resizer__left"         on-mousedown-touchstart="@this.activateResizer(event, 'left')"></div>
        <div class="E_PageElementSettings--resizer E_PageElementSettings--resizer__right"        on-mousedown-touchstart="@this.activateResizer(event, 'right')"></div>
        <div class="E_PageElementSettings--resizer-hover"></div>

    </div>

</div>
