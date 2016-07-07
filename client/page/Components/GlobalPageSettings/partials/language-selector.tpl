<ul class="E_GlobalLanguagesSettings--inline-widget-content">

    {{#if .fire}}

        {{#each .languages}}

            <li class="
                    E_GlobalLanguagesSettings--language
                    {{#if typeof ../../selected === 'string' && . === ../../selected}}E_GlobalLanguagesSettings--language__selected{{/if}}
                "
                on-tap="@this.fire(../../fire, event, .)"
                slide-out="{duration:  ~/openGlobalSettingsWidget ? 300 : 0}"
            >
                {{#if (../../selected && !../../iconIf && ../../icon !== false && ../../selected.indexOf(.) > -1) || (../../iconIf === .)}}
                    <svg data-icon="{{../../icon || '#icon-check-mark'}}" fade-in="{duration: 100}" fade-out="{duration: 100}"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{../../icon || '#icon-check-mark'}}"></use></svg>
                {{/if}}
                {{~/languages.getName(.)}} ({{.}})
            </li>

        {{/each}}


    {{else}}

        {{#each .languages}}

            <li class="
                    E_GlobalLanguagesSettings--language
                    {{#if typeof ../../selected === 'string' && . === ../../selected}}E_GlobalLanguagesSettings--language__selected{{/if}}
                "
                on-tap="@this.set(../../set, .)"
                slide-out="{duration:  ~/openGlobalSettingsWidget ? 300 : 0}"
            >
                {{#if (../../selected && !../../iconIf && ../../icon !== false && ../../selected.indexOf(.) > -1) || (../../iconIf === .)}}
                    <svg data-icon="{{../../icon || '#icon-check-mark'}}" fade-in="{duration: 100}" fade-out="{duration: 100}"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{../../icon || '#icon-check-mark'}}"></use></svg>
                {{/if}}
                {{~/languages.getName(.)}} ({{.}})
            </li>

        {{/each}}

    {{/if}}

</ul>
