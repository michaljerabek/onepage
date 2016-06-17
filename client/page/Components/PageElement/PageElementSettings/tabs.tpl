<ul class="E_PageElementSettings--tabs">

    {{#each this}}

        {{#if .}}

            <li class="
                    E_PageElementSettings--tab
                    {{#if @this.get('openTab') === .name}}E_PageElementSettings--tab__active{{/if}}
                "
                on-tap="@this.set('openTab', .name)"
                intro-outro="{{#if ~/completed}}attr{{/if}}"
            >
                <span class="E_PageElementSettings--tab-name">{{.text}}</span>
            </li>

        {{/if}}

    {{/each}}

</ul>

