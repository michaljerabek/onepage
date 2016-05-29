<span class="Text
        Text__{{.type  || 'text'}}
        Text__{{.size  || 'medium'}}
        Text__{{.state || 'normal'}}
        {{#if .adaptive}}Text__adaptive{{/if}}
        {{#if .units}}Text__has-units{{/if}}
        {{.className}}
    "
    title="{{.title}}"
>

    {{#with {
            id: .id || "Text--" + Date.now() + (Math.random() * 1000000000).toFixed(),
          data: this,
          link: @this.link(.value.replace(/^\./, ""), "__Text." + .value.replace(/\./g, "_")),
        _value: .value.replace(/\./g, '_')
    }}}

        <span class="Text--input-wrapper">
            <input type="{{.data.type || 'text'}}"
                class="Text--input"
                id="{{.id}}"
                value="{{~/__Text[._value]}}"
                {{#if .data.state === "disabled"}}disabled{{/if}}
                {{#if .data.required}}required{{/if}}
                {{#if .data.pattern}}pattern="{{.data.pattern}}"{{/if}}
                placeholder="{{.placeholder}}"
                on-keydown=" @this.fire(.data.keydown , event, .data.keydownEvent)"
                on-keyup="   @this.fire(.data.keyup   , event, .data.keyupEvent)"
                on-keypress="@this.fire(.data.keypress, event, .data.keypressEvent)"
                title="{{.title}}"
            >
            {{#if .data.units}}
                <span class="Text--units-wrapper">
                    <label class="Text--units" for="{{.id}}">{{.data.units}}</label>
                </span>
            {{/if}}
        </span>

    {{/with}}

</span>
