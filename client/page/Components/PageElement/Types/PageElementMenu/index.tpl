{{#with
    @global.document && (typeof @global.document.body.style.backdropFilter !== 'undefined' || typeof @global.document.body.style.webkitBackdropFilter !== 'undefined') as hasBackdropFilter,
    .element.backgroundColor || .backgroundColor || .defaultColors.backgroundColor as fixedBackground,
    .element.textColor || .element.autoTextColor || .textColor || .defaultColors.textColor as fixedColor
}}
<nav class="
        P_PageElementMenu
        {{#if .fixed}}P_PageElementMenu__fixed{{/if}}
        {{#if .element.hidden}}P_PageElementMenu__hidden{{/if}}
        {{#if .element.fill}}P_PageElementMenu__fill{{/if}}
        {{#if .element.fill && .element.shadow}}P_PageElementMenu__shadow{{/if}}
        P_font-body
    "
    style="
        {{#if .element.fill || .fixed}}
            background-color: {{fixedBackground}};
            color: {{fixedColor}};
        {{else}}
            color: {{.textColor || .defaultColors.textColor}};
        {{/if}}
    "
     on-windowTouchend="!@this.root.get('touchmove') && event.original.target.closest && !event.original.target.closest('.P_PageElementMenu--dropdown') && @this.set('openDropdown', null)"
 >
    <div class="P_PageSection--center-content">

        <span class="P_PageElementMenu--dropdown-close
                {{#if .openDropdown && .openDropdown.match(/hiddenmenu|cart/i)}}
                    P_PageElementMenu--dropdown-close__active
                {{/if}}
            "
            on-tap="event.original.srcEvent.preventDefault(), @this.set('openDropdown', null)"
        >
            <svg><use xlink:href="#icon-close"></use></svg>
        </span>

        <div class="P_PageElementMenu--items">

            <div class="P_PageElementMenu--logo">

                <PageElementLogo element="{{.element}}" lang="{{.lang}}" />

            </div>

            <div class="P_PageElementMenu--links">

                <ul class="P_PageElementMenu--links-wrapper">

                    <li role="presentation" class="P_PageElementMenu--dropdown-list-bg" style="background-color: {{~/element.blurBackgroundColor}}"></li>

                    {{#each .element.links}}

                        <li class="P_PageElementMenu--link
                                {{#if ~/activeLink === .link}}P_PageElementMenu--link__active{{/if}}
                            "
                        >
                            <span class="P_PageElementMenu--link-dot"></span>
                            <span class="P_PageElementMenu--link-dot"></span>

                            {{#if ~/editMode}}
                                <span class="P_PageElementMenu--link-self"
                                    on-touchstart="@this.fire('touchstart', event)"
                                    on-blur="@this.checkMenuOverflow()"
                                    on-tap="@this.action(event, .link, true)"
                                    contenteditable="true"
                                    value="{{.text[~/lang]}}"
                                ></span>
                            {{else}}
                                <a class="ScrollToSection--skip P_PageElementMenu--link-self"
                                    href="#{{.link}}"
                                    on-tap="@this.action(event, .link, false)"
                                    data-href="#{{.link}}"
                                >{{.text[~/lang]}}</a>
                            {{/if}}

                            <span class="P_PageElementMenu--link-dot"></span>
                        </li>

                    {{/each}}

                </ul>

            </div>

            <div class="P_PageElementMenu--currency P_PageElementMenu--dropdown {{.openDropdown === 'currency' ? 'open' : ''}}"
                 on-tap="event.original.srcEvent.preventDefault(), @this.set('openDropdown', (.openDropdown === 'currency' && @global.innerWidth >= 640) || .openDropdown === 'close' ? null : 'currency')"
                 on-hover="@global.innerWidth >= 640 && @this.set('openDropdown', event.hover ? 'currency' : null)"
            >
                <span class="P_PageElementMenu--selected-currency  P_PageElementMenu--dropdown-selected">
                    {{.currency || "CZK"}}
                    <span class="P_PageElementMenu--dropdown-icon">
                        <svg><use xlink:href="#icon-triangle"></use></svg>
                    </span>
                </span>
                <ul class="P_PageElementMenu--currency-list P_PageElementMenu--dropdown-list"
                    style="
                        {{#if .element.fill || .fixed || !hasBackdropFilter}}
                            background-color: {{fixedBackground}};
                            color: {{fixedColor}};
                        {{/if}}
                    "
                   >
                    <li role="presentation" class="P_PageElementMenu--dropdown-list-bg" style="background-color: {{~/element.blurBackgroundColor}}"></li>
                    <li class="P_PageElementMenu--currency-item  {{#if 'CZK' === 'CZK'}}P_PageElementMenu--dropdown-item__active{{/if}} P_PageElementMenu--dropdown-item">CZK</li>
                    <li class="P_PageElementMenu--currency-item  {{#if 'CCC' === 'CZK'}}P_PageElementMenu--dropdown-item__active{{/if}} P_PageElementMenu--dropdown-item">EUR</li>
                    <li class="P_PageElementMenu--currency-item  {{#if 'CCC' === 'CZK'}}P_PageElementMenu--dropdown-item__active{{/if}} P_PageElementMenu--dropdown-item">USD</li>
                </ul>
            </div>

            <div class="P_PageElementMenu--lang P_PageElementMenu--dropdown {{.openDropdown === 'lang' ? 'open' : ''}}"
                 on-tap="event.original.srcEvent.preventDefault(), @this.set('openDropdown', (.openDropdown === 'lang' && @global.innerWidth >= 640) || .openDropdown === 'close' ? null : 'lang')"
                on-hover="@global.innerWidth >= 640 && @this.set('openDropdown', event.hover ? 'lang' : null)"
            >
                <span class="P_PageElementMenu--selected-lang P_PageElementMenu--dropdown-selected">
                    {{.lang || @this.Page.get('page.settings.lang.defaultLang') || "cs"}}
                    <span class="P_PageElementMenu--dropdown-icon">
                        <svg><use xlink:href="#icon-triangle"></use></svg>
                    </span>
                </span>
                <ul class="P_PageElementMenu--lang-list P_PageElementMenu--dropdown-list"
                    style="
                        {{#if .element.fill || .fixed || !hasBackdropFilter}}
                            background-color: {{fixedBackground}};
                            color: {{fixedColor}};
                        {{/if}}
                    "
                >
                    <li role="presentation" class="P_PageElementMenu--dropdown-list-bg" style="background-color: {{~/element.blurBackgroundColor}}"></li>

                    {{#each @this.Page.get('page.settings.lang.langs')}}
                        <li class="P_PageElementMenu--lang-item
                                {{#if @key === ~/lang}}
                                    P_PageElementMenu--dropdown-item__active
                                {{/if}}
                                P_PageElementMenu--dropdown-item
                            "
                            on-tap="@this.set('openDropdown', ~/editMode ? .openDropdown : 'close'), @this.fire('changeCurrentLang', @key)"
                        >{{@key}} ({{~/languages.getNativeName(@key)}})</li>
                    {{/each}}
                </ul>
            </div>

            <div class="P_PageElementMenu--show-hidden-menu P_PageElementMenu--dropdown {{.openDropdown === 'hiddenMenu' ? 'open' : ''}}"
                 on-tap="event.original.srcEvent.preventDefault(), @this.set('openDropdown', (.openDropdown === 'hiddenMenu' && @global.innerWidth >= 640 && !.editing) || .openDropdown === 'close' ? null : 'hiddenMenu'), @this.set('editing', false)"
                on-hover="@global.innerWidth >= 640 && @this.set('openDropdown', event.hover ? 'hiddenMenu' : null)"
            >
                <div class="P_PageElementMenu--show-hidden-icon P_PageElementMenu--icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <rect x="0"  y="0"  width="6" height="6" />
                        <rect x="9"  y="0"  width="6" height="6" />
                        <rect x="18" y="0"  width="6" height="6" />
                        <rect x="0"  y="9"  width="6" height="6" />
                        <rect x="9"  y="9"  width="6" height="6" />
                        <rect x="18" y="9"  width="6" height="6" />
                        <rect x="0"  y="18" width="6" height="6" />
                        <rect x="9"  y="18" width="6" height="6" />
                        <rect x="18" y="18" width="6" height="6" />
                    </svg>
                </div>

                <div class="P_PageElementMenu--hidden-menu P_PageElementMenu--dropdown-list"
                    style="
                        {{#if .element.fill || .fixed || !hasBackdropFilter}}
                            background-color: {{fixedBackground}};
                            color: {{fixedColor}};
                        {{/if}}
                    "
                >
                    <div class="P_PageElementMenu--dropdown-list-bg" style="background-color: {{.element.blurBackgroundColor}}"></div>

                    <ul class="P_PageElementMenu--hidden-links P_PageElementMenu--dropdown-sublist">

                        {{#each .element.links}}

                            <li class="P_PageElementMenu--hidden-link P_PageElementMenu--dropdown-item
                                    {{#if ~/activeLink === .link}}P_PageElementMenu--dropdown-item__active{{/if}}
                                "
                            >
                                {{#if ~/editMode}}
                                    <span class="P_PageElementMenu--hidden-link-self P_PageElementMenu--dropdown-item-text"
                                        on-touchstart="@this.fire('touchstart', event), @this.set('editing', true)"
                                        on-mousedown="@this.set('editing', true)"
                                        on-blur="@this.checkMenuOverflow()"
                                        on-tap="@this.action(event, .link, true)"
                                        contenteditable="true"
                                        value="{{.text[~/lang]}}"
                                    ></span>
                                {{else}}
                                    <a class="ScrollToSection--skip P_PageElementMenu--hidden-link-self P_PageElementMenu--dropdown-item-text"
                                        href="#{{.link}}"
                                        on-tap="@this.action(event, .link, false)"
                                        data-href="#{{.link}}"
                                    >{{.text[~/lang]}}</a>
                                {{/if}}
                            </li>

                        {{/each}}

                    </ul>

                    <ul class="P_PageElementMenu--hidden-curreny P_PageElementMenu--dropdown-sublist">
                        <li class="P_PageElementMenu--hidden-currency-item {{#if 'CZK' === 'CZK'}}P_PageElementMenu--dropdown-item__active{{/if}} P_PageElementMenu--dropdown-item">CZK</li>
                        <li class="P_PageElementMenu--hidden-currency-item {{#if 'CCC' === 'CZK'}}P_PageElementMenu--dropdown-item__active{{/if}} P_PageElementMenu--dropdown-item">EUR</li>
                        <li class="P_PageElementMenu--hidden-currency-item {{#if 'CCC' === 'CZK'}}P_PageElementMenu--dropdown-item__active{{/if}} P_PageElementMenu--dropdown-item">USD</li>
                    </ul>

                    <ul class="P_PageElementMenu--hidden-lang P_PageElementMenu--dropdown-sublist">
                        {{#each @this.Page.get('page.settings.lang.langs')}}
                            <li class="P_PageElementMenu--hidden-lang-item
                                    {{#if @key === ~/lang}}
                                        P_PageElementMenu--dropdown-item__active
                                    {{/if}}
                                    P_PageElementMenu--dropdown-item
                                "
                                on-tap="@this.set('openDropdown', ~/editMode ? .openDropdown : 'close'), @this.fire('changeCurrentLang', @key)"
                            >{{@key}} ({{~/languages.getNativeName(@key)}})</li>
                        {{/each}}
                    </ul>

                </div>

            </div>

            <div class="P_PageElementMenu--cart P_PageElementMenu--dropdown {{.openDropdown === 'cart' ? 'open' : ''}}"
                 on-tap="event.original.srcEvent.preventDefault(), @this.set('openDropdown', (.openDropdown === 'cart' && @global.innerWidth >= 640 && !.editing) || .openDropdown === 'close' ? null : 'cart'), @this.set('editing', false)"
                on-hover="@global.innerWidth >= 640 && @this.set('openDropdown', event.hover ? 'cart' : null)"
            >
                <div class="P_PageElementMenu--cart-count P_font-body">2</div>
                <div class="P_PageElementMenu--cart-icon P_PageElementMenu--icon">
                    <svg class="P_animatable--text"><use xlink:href="#icon-cart"></use></svg>
                </div>
                <div class="P_PageElementMenu--cart-box P_PageElementMenu--dropdown-list"
                    style="
                        {{#if .element.fill || .fixed || !hasBackdropFilter}}
                            background-color: {{fixedBackground}};
                            color: {{fixedColor}};
                        {{/if}}
                    "
                >
                    <div class="P_PageElementMenu--dropdown-list-bg" style="background-color: {{.element.blurBackgroundColor}}"></div>
                    Tady možná někdy bude košík.
                </div>
            </div>

        </div>

    </div>
 </nav>
{{/with}}
