<ul class="E_PageElementSettings--tabs">

    {{#each this}}

        <li class="
                E_PageElementSettings--tab
                {{#if @this.get('openTab') === .name}}E_PageElementSettings--tab__active{{/if}}
            "
            on-tap="@this.set('openTab', .name)"
        >
            {{.text}}
        </li>

    {{/each}}

</ul>

