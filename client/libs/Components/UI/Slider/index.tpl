<span class="Slider
        Slider__{{.type  || 'default'}}
        Slider__{{.size  || 'medium'}}
        Slider__{{.state || 'normal'}}
        {{#if .adaptive}}Slider__adaptive{{/if}}
        {{.className}}
    "
    style="
        min-width: {{.minWidth}};
        max-width: {{.maxWidth}};
    "
    on-mouseup-touchend-keyup="set('__Slider.' + .value.replace(/\./g, '_') + '-no-transition', false)"
    title="{{.title}}"
>

    {{#with {
            id: .id || "Slider--" + Date.now(),
          data: this,
          link: @this.link(.value.replace(/^\./, ""), "__Slider." + .value.replace(/\./g, "_")),
        _value: .value.replace(/\./g, '_'),
        middle: ((.data.max || 100) - (.data.min || 0)) / 2
    }}}

        {{#if .data.state === "disabled"}}
        <span class="Slider--text Slider--text__min">{{typeof .data.minText === "undefined" ? .data.min : .data.minText}}</span>
        <span class="Slider--text Slider--text__max">{{typeof .data.maxText === "undefined" ? .data.max : .data.maxText}}</span>
        {{else}}
        <span class="Slider--text Slider--text__min" on-tap="set('__Slider.' + ._value, .data.min)">{{typeof .data.minText === "undefined" ? .data.min : .data.minText}}</span>
        <span class="Slider--text Slider--text__max" on-tap="set('__Slider.' + ._value, .data.max)">{{typeof .data.maxText === "undefined" ? .data.max : .data.maxText}}</span>
        {{/if}}

        <input type="range"
            class="Slider--input"
            value="{{~/__Slider[._value]}}"
            id="{{.id}}"
            min="{{.data.min || 0}}"
            max="{{.data.max || 100}}"
            {{#if .data.state === "disabled"}}disabled{{/if}}
            on-mousemove-touchmove="set('__Slider.' + ._value + '-no-transition', event.original.stopPropagation() || !!event.original.buttons || event.original.type === 'touchmove')"
            on-keydown="set('__Slider.' + ._value + '-no-transition', true)"
            on-mousedown-touchstart="set('__Slider.' + ._value + '-no-transition', false)"
        >

        <span class="Slider--custom-track">
            <span class="Slider--custom-handle"
                style="
                    {{#if ~/__Slider && ~/__Slider[._value + '-no-transition']}}transition: none;{{/if}}
                    left: {{
                       ((!isNaN(~/__Slider && ~/__Slider[._value]) ? ~/__Slider[._value] : .middle) / (.data.max || 100)) * 100
                    }}%;
                "
            ></span>
        </span>

        <span class="Slider--text Slider--text__current">{{~/__Slider && !isNaN(~/__Slider[._value]) ? ~/__Slider[._value] : .middle}}</span>

    {{/with}}

</span>
