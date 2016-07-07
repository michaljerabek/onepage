<ul class="E_PageElementSettings--tabs">

    {{#each this}}

        {{#if this}}

            <li class="
                    E_PageElementSettings--tab
                    {{#if ~/openTab === .name}}E_PageElementSettings--tab__active{{/if}}
                "
                on-tap="@this.set('openTab', .name)"
                attr-in="{duration: ~/completed ? 300 : 0}"
                attr-out="{duration: ~/completed ? 300 : 0}"
            >
                <span class="E_PageElementSettings--tab-name">{{.text}}</span>
            </li>

        {{/if}}

    {{/each}}

</ul>

