{{#with {
    id: .id || "ToggleField--" + Date.now(),
    data: this
}}}

<label for="{{.id}}"
    class="ToggleField
        ToggleField__{{.data.type  || 'default'}}
        ToggleField__{{.data.size  || 'medium'}}
        ToggleField__{{.data.state || 'normal'}}
        {{.data.className}}
    "
    {{#if .data.state !== 'disabled'}}tabindex="{{.data.tabindex || 0}}"{{/if}}
    on-space-enter="@this.toggle(.data.state !== 'disabled' ? .data.value.replace(/^\./, '') : undefined)"
>

    <span class="ToggleField--text">{{.data.text}}</span>

    {{> Toggle {
        id: .id,
        type: .data.type,
        title: .data.title,
        state: .data.state,
        size: .data.size,
        value: .data.value,
        onText: .data.onText,
        offText: .data.offText,
        tabindex: -1
    }}}

</label>

{{/with}}
