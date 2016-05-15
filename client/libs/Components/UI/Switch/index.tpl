<span class="Switch
        Switch__{{.type  || 'default'}}
        Switch__{{.size  || 'medium'}}
        Switch__{{.state || 'normal'}}
        {{#if .adaptive}}Switch__adaptive{{/if}}
        {{.className}}
    "
>

    {{#with {
        id: "Switch--" + Date.now() + "__",
        data: this,

        link: @ractive.link(.value.replace(/^\./, ""), "__Switch." + .value.replace(/\./g, "_")),

        _default: typeof .defaultValue !== "undefined" &&
           typeof @ractive.get(.value.replace(/^\./, "")) === "undefined" &&
           @ractive.set(.value.replace(/^\./, ""), .defaultValue),

        _value: .value.replace(/\./g, '_')
    }}}

    <span class="Switch--options">

        {{#each .data.options}}

        {{#if ../../multiple}}

            <input type="checkbox"
                class="Switch--input"
                id="{{../../../id + @key}}"
                name="{{~/__Switch[../../../_value]}}"
                value="{{.value}}"
                {{#if .state === "disabled" || ../../state === "disabled"}}disabled{{/if}}
            >

        {{else}}

            <input type="radio"
                class="Switch--input"
                id="{{../../../id + @key}}"
                name="{{~/__Switch[../../../_value]}}"
                value="{{.value}}"
                {{#if .state === "disabled" || ../../state === "disabled"}}disabled{{/if}}
            >

        {{/if}}

        <label class="Switch--option
                {{#if !.icon}}Switch--option__no-icon{{/if}}
                {{#if !.text}}Switch--option__no-text{{/if}}
                {{.className}}
            "
            for="{{../../../id + @key}}"
            title="{{.title}}"
            on-touchstart=""
        >

            <span class="Switch--option-background"></span>

            {{#if .icon}}
            <span class="Switch--icon"
                  style="
                          top: {{.iconY + 'px'}};
                         left: {{.iconX + 'px'}};
                        width: {{.iconW + 'px'}};
                       height: {{.iconH + 'px'}};
                    transform: rotate({{.iconR || 0}}deg);
                "
            >
                <svg><use xlink:href="{{.icon}}"></use></svg>
            </span>
            {{/if}}

            {{#if .text}}
            <span class="Switch--text-wrapper">
                <span class="Switch--text
                        {{#if .text.length <  5}}Switch--text__short{{/if}}
                        {{#if .text.length > 10}}Switch--text__long{{/if}}
                        {{#if .text.length > 15}}Switch--text__extra-long{{/if}}
                    "
                >
                    {{.text}}
                </span>
            </span>
            {{/if}}

        </label>

        {{/each}}

    </span>
    {{/with}}

</span>
