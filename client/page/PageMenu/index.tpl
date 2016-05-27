<div class="E_PageMenu E_PageMenu__left">

    <ul class="E_PageMenu--items">

        <li class="E_PageMenu--item
                E_PageMenu--item__has-content
                {{#if .openPageMenu === 'settings'}}E_PageMenu--item__show-content{{/if}}
            "
        >

            <span class="E_PageMenu--button E_PageMenu--button__settings">

                {{> FlatButton {
                        type: "default-2",
                        size: "large",
                        text: "Nastavení",
                        icon: "#icon-gear",
                        title: "Globální nastavení stránky",
                        set: "openPageMenu",
                        value: "settings",
                        className: ""
                    }
                }}

            </span>

            <div class="E_PageMenu--content">

                <span class="E_PageMenu--hide-content" on-tap="set('openPageMenu', null)">
                    <svg><use xlink:href="#icon-x"></use></svg>
                </span>

                <span class="E_PageMenu--show-page" on-touchstart-touchend-hover="showPage">
                    <svg><use xlink:href="#icon-eye"></use></svg>
                </span>

                <div class="E_PageMenu--content-wrapper">
                    {{#if .openPageMenu === 'settings'}}
                    <GlobalPageSettings settings="{{.page.settings}}" lang="{{.page.lang}}" tplLang="{{.page.tplLang}}" />
                    {{/if}}
                </div>
            </div>

            <div class="E_PageMenu--resizer" on-mousedown-touchstart="activateResizer"></div>

        </li>

        <li class="E_PageMenu--item
                E_PageMenu--item__has-content
                {{#if .openPageMenu === 'add-section'}}E_PageMenu--item__show-content E_PageMenu--item__show-content__min{{/if}}
                {{#if .draggableActive}}E_PageMenu--item__adding-section{{/if}}
            "
       >
            <span class="E_PageMenu--button E_PageMenu--button__add-section">

                {{> FlatButton {
                        type: ~/cancelAddSection ? "danger" : "default-2",
                        size: "large",
                        text:  ~/draggableActive ? "Zrušit" : "Přidat sekci",
                        icon: ~/draggableActive ? "#icon-trash" : "#icon-plus",
                        title: ~/draggableActive ? "Zrušit přidávání sekce" : "Přidat novou sekci",
                        set: "openPageMenu",
                        value: "add-section",
                        state: ~/draggableActive ? "active" : ""
                    }
                }}

            </span>

            <div class="E_PageMenu--content">

                <span class="E_PageMenu--hide-content" on-tap="set('openPageMenu', null)">
                    <svg><use xlink:href="#icon-x"></use></svg>
                </span>

                <div class="E_PageMenu--content-wrapper">
                    <NewPageSectionSelector />
                </div>

            </div>

            <div class="E_PageMenu--resizer" on-mousedown-touchstart="activateResizer"></div>

        </li>

    </ul>

    <div class="E_PageMenu--position-switcher E_PageMenu--position-switcher__top">
        <span class="icon" on-tap="switchPosition:{{'top'}}">
            <svg class="E_PageMenu--icon__arrow"><use xlink:href="#icon-arrow-2"></use></svg>
            <svg class="E_PageMenu--icon__touch"><use xlink:href="#icon-touch-move-up-3"></use></svg>
        </span>
    </div>
    <div class="E_PageMenu--position-switcher E_PageMenu--position-switcher__bottom">
        <span class="icon" on-tap="switchPosition:{{'bottom'}}">
            <svg class="E_PageMenu--icon__arrow"><use xlink:href="#icon-arrow-2"></use></svg>
            <svg class="E_PageMenu--icon__touch"><use xlink:href="#icon-touch-move-down-3"></use></svg>
        </span>
    </div>

</div>

<div class="E_PageMenu E_PageMenu__right">

    <ul class="E_PageMenu--items">

        <li class="E_PageMenu--item">

            <span class="E_PageMenu--button E_PageMenu--button__close">

                {{> FlatButton {
                        type: "default-danger",
                        size: "large",
                        text: "Zavřít",
                        icon: "#icon-x",
                        iconY: 1,
                        iconW: 30,
                        iconH: 30,
                        title: "Zavřít editaci stránky",
                        fire: "closePage"
                    }
                }}

            </span>

        </li>

        <li class="E_PageMenu--item
                {{#if .unsavedChanges}}E_PageMenu--save__unsaved{{/if}}
            "
        >

            <span class="E_PageMenu--button E_PageMenu--button__save">

                {{> FlatButton {
                        type: ~/unsavedChanges ? "warn" : ~/changesSaved ? "ok" : "default",
                        size: "large",
                        text: "Uložit",
                        icon: "#icon-upload",
                        iconY: 1,
                        title:  ~/unsavedChanges ? "Uložit stránku a publikovat změny" : "Žádné změny",
                        fire: "savePage"
                    }
                }}

            </span>

        </li>

    </ul>

    <div class="E_PageMenu--position-switcher E_PageMenu--position-switcher__top">
        <span class="icon" on-tap="switchPosition:{{'top'}}">
            <svg class="E_PageMenu--icon__arrow"><use xlink:href="#icon-arrow-2"></use></svg>
        </span>
    </div>
    <div class="E_PageMenu--position-switcher E_PageMenu--position-switcher__bottom">
        <span class="icon" on-tap="switchPosition:{{'bottom'}}">
            <svg class="E_PageMenu--icon__arrow"><use xlink:href="#icon-arrow-2"></use></svg>
        </span>
    </div>

</div>
