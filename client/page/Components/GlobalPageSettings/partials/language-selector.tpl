<ul class="E_GlobalLanguagesSettings--inline-widget-content">

    {{#if .fire}}

        {{#each .languages}}

            <li class="
                    E_GlobalLanguagesSettings--language
                    {{#if typeof ../../selected === 'string' && . === ../../selected}}E_GlobalLanguagesSettings--language__selected{{/if}}
                "
                on-tap="{{../../fire}}:{{.}}"
                outro="{{#if ~/openGlobalSettingsWidget}}slide{{/if}}"
            >
                {{#if (../../selected && !../../iconIf && ../../icon !== false && ../../selected.indexOf(.) > -1) || (../../iconIf === .)}}
                    <svg data-icon="{{../../icon || '#icon-check-mark'}}" intro-outro="fade:{duration: 100}"><use xlink:href="{{../../icon || '#icon-check-mark'}}"></use></svg>
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
                on-tap="set(../../set, .)"
                outro="{{#if ~/openGlobalSettingsWidget}}slide{{/if}}"
            >
                {{#if (../../selected && !../../iconIf && ../../icon !== false && ../../selected.indexOf(.) > -1) || (../../iconIf === .)}}
                    <svg data-icon="{{../../icon || '#icon-check-mark'}}" intro-outro="fade:{duration: 100}"><use xlink:href="{{../../icon || '#icon-check-mark'}}"></use></svg>
                {{/if}}
                {{~/languages.getName(.)}} ({{.}})
            </li>

        {{/each}}

    {{/if}}

</ul>
