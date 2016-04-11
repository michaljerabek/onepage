<div class="E_PageMenu E_PageMenu__left">

    <ul class="E_PageMenu--items">

        <li class="E_PageMenu--item
                E_PageMenu--item__has-content
                {{#if .openPageMenu === 'settings'}}E_PageMenu--item__show-content{{/if}}
            "
        >

            <span class="E_PageMenu--button E_PageMenu--button__settings" on-tap="set('openPageMenu', 'settings')">Nastavení</span>

            <div class="E_PageMenu--content">

                <span class="E_PageMenu--hide-content" on-tap="set('openPageMenu', null)">&times;</span>

                <div class="E_PageMenu--content-wrapper">
                    <GlobalPageSettings settings="{{.page.settings}}" pageTitleColorTest="{{pageTitleColorTest}}" />
                </div>
            </div>

            <div class="E_PageMenu--resizer" on-mousedown-touchstart="activateResizer"></div>

        </li>

        <li class="E_PageMenu--item
                E_PageMenu--item__has-content
                {{#if .openPageMenu === 'add-section'}}E_PageMenu--item__show-content{{/if}}
                {{#if .draggableActive}}E_PageMenu--item__adding-section{{/if}}
            "
       >
            <span class="E_PageMenu--button E_PageMenu--button__add-section" on-tap="set('openPageMenu', 'add-section')">
                <span class="E_PageMenu--add-section__add">Přidat</span>
                <span class="E_PageMenu--add-section__cancel
                        {{#if .cancelAddSection}}E_PageMenu--add-section__active-cancel{{/if}}
                    "
                >Zrušit</span>
            </span>

            <div class="E_PageMenu--content">

                <span class="E_PageMenu--hide-content" on-tap="set('openPageMenu', null)">&times;</span>

                <div class="E_PageMenu--content-wrapper">
                    <NewPageSectionSelector />
                </div>

            </div>

            <div class="E_PageMenu--resizer" on-mousedown-touchstart="activateResizer"></div>

        </li>

    </ul>

    <div class="E_PageMenu--position-switcher E_PageMenu--position-switcher__top">
        <span class="icon" on-tap="switchPosition:{{'top'}}">&uarr;</span>
    </div>
    <div class="E_PageMenu--position-switcher E_PageMenu--position-switcher__bottom">
        <span class="icon" on-tap="switchPosition:{{'bottom'}}">&darr;</span>
    </div>

</div>

<div class="E_PageMenu E_PageMenu__right">

    <ul class="E_PageMenu--items">

        <li class="E_PageMenu--item">

            <span class="E_PageMenu--button E_PageMenu--button__close" on-tap="closePage()">Zavřít</span>

        </li>

        <li class="E_PageMenu--item
                {{#if .unsavedChanges}}E_PageMenu--save__unsaved{{/if}}
            "
        >

            <span class="E_PageMenu--button E_PageMenu--button__save" on-tap="savePage()">Uložit</span>

        </li>

    </ul>

    <div class="E_PageMenu--position-switcher E_PageMenu--position-switcher__top">
        <span class="icon" on-tap="switchPosition:{{'top'}}">&uarr;</span>
    </div>
    <div class="E_PageMenu--position-switcher E_PageMenu--position-switcher__bottom">
        <span class="icon" on-tap="switchPosition:{{'bottom'}}">&darr;</span>
    </div>

</div>
