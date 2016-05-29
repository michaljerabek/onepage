<span class="Select
        Select__{{.type  || 'default'}}
        Select__{{.size  || 'medium'}}
        Select__{{.state || 'normal'}}
        {{#if .adaptive}}Select__adaptive{{/if}}
        {{.className}}
    "
>

    {{#with {
            id: .id || "Select--" + Date.now(),
          data: this,
          link: @this.link(.value.replace(/^\./, ""), "__Select." + .value.replace(/\./g, "_")),
        _value: .value.replace(/\./g, '_')
    }}}

    <select class="Select--options"
        value="{{~/__Select[._value]}}"
        id="{{.id}}"
        {{#if .data.state === "disabled"}}disabled{{/if}}
    >

        {{#each .data.options}}

        <option value="{{.value}}"
            {{#if .state === "disabled"}}disabled{{/if}}
        >
            {{.text}}
        </option>

        {{/each}}

    </select>

    <div class="Select--icon">
        <svg><use xlink:href="{{.icon || '#icon-triangle'}}"></use></svg>
    </div>

    {{/with}}

</span>
