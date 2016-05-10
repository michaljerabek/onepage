<span class="Toggle
        Toggle__{{.type  || 'default'}}
        Toggle__{{.size  || 'medium'}}
        Toggle__{{.state || 'normal'}}
        {{.className}}
    "
    title="{{.title}}"
>

    {{#with {
            id: .id || "Toggle--" + Date.now(),
          data: this,
          link: @ractive.link(.value.replace(/^\./, ""), "__Toggle." + .value.replace(/\./g, "_")),
        _value: .value.replace(/\./g, '_')
    }}}

        <input type="checkbox"
            class="Toggle--input"
            checked="{{~/__Toggle[._value]}}"
            id="{{.id}}"
            {{#if .data.state === "disabled"}}disabled{{/if}}
        >

        <label class="Toggle--event" for="{{.id}}">

            {{#if .data.state === "disabled" || !@ractive.events.windowMousemove}}

                <span class="Toggle--handle"></span>

            {{else}}

                <span class="Toggle--handle"
                    style="
                        {{#if ~/__Toggle[._value + '-move']}}
                            transform: translateX(
                               {{!~/__Toggle[._value] ? Math.max(
                                    0, Math.min(~/__Toggle[._value + '-transform'], ~/__Toggle[._value + '-move'].maxHMove)
                                ) : Math.min(
                                   ~/__Toggle[._value + '-move'].maxHMove, Math.max(~/__Toggle[._value + '-move'].maxHMove + ~/__Toggle[._value + '-transform'], 0)
                                )}}px
                            );
                        {{/if}}
                        {{#if ~/__Toggle[._value + '-move']}}transition: none;{{/if}}
                    "
                    on-mousedown="set('__Toggle.' + ._value + '-move', {
                        initX: event.original.clientX,
                        lastX: event.original.clientX,
                        beforeLastX: event.original.clientX,
                        maxHMove: event.node.offsetParent.offsetWidth - event.node.offsetWidth - 2,
                        handleW: event.node.offsetWidth
                    })"
                    on-touchstart="set('__Toggle.' + ._value + '-move', {
                        initX: event.original.changedTouches[0].clientX,
                        lastX: event.original.changedTouches[0].clientX,
                        beforeLastX: event.original.changedTouches[0].clientX,
                        maxHMove: event.node.offsetParent.offsetWidth - event.node.offsetWidth - 2,
                        handleW: event.node.offsetWidth
                    })"
                    on-windowMousemove-windowTouchmove="set('__Toggle.' + ._value + '-transform',
                        ~/__Toggle[._value + '-move'] ? (event.original.type.match(/touch/) && event.original.stopPropagation() || event.original.preventDefault()) || (@ractive.set('__Toggle.' + ._value + '-move.beforeLastX', ~/__Toggle[._value + '-move'].lastX) && @ractive.set('__Toggle.' + ._value + '-move.lastX', event.clientX) && event.clientX - ~/__Toggle[._value + '-move'].initX) : ''
                        )
                    "
                    on-mouseup-touchend-click="set('__Toggle.__X', event.original.preventDefault())"
                    on-windowMouseup-windowTouchend="set(
                        '__Toggle.' + ._value + '-move', ~/__Toggle[._value + '-move'] ? @ractive.set(
                            '__Toggle.' + ._value, ~/__Toggle[._value] ? ~/__Toggle[._value + '-move'].beforeLastX < event.clientX : ~/__Toggle[._value + '-move'].beforeLastX <= event.clientX
                        ) && false : false
                    )"
                >
                </span>

            {{/if}}

            <span class="Toggle--state">
                <span class="Toggle--on"
                    style="
                        {{#if ~/__Toggle[._value + '-move']}}
                            transform: translateX(
                                {{~/__Toggle[._value] ?
                                    -100 + (Math.min(1, Math.max(0, (~/__Toggle[._value + '-move'].maxHMove + ~/__Toggle[._value + '-transform']) / ~/__Toggle[._value + '-move'].maxHMove)) * 100) :
                                    -100 + (Math.min(1, Math.max(0, ~/__Toggle[._value + '-transform'] / ~/__Toggle[._value + '-move'].maxHMove)) * 100)
                                }}%);
                            padding-right:
                                {{~/__Toggle[._value] ?
                                   ~/__Toggle[._value + '-move'].handleW * (Math.min(1, Math.max(0, (~/__Toggle[._value + '-move'].maxHMove + ~/__Toggle[._value + '-transform']) / ~/__Toggle[._value + '-move'].maxHMove))) :
                                   ~/__Toggle[._value + '-move'].handleW * (Math.min(1, Math.max(0, ~/__Toggle[._value + '-transform'] / ~/__Toggle[._value + '-move'].maxHMove)))
                                }}px;
                        {{/if}}
                        {{#if ~/__Toggle[._value + '-move']}}transition: none;{{/if}}
                    "
                >
                    <span class="Toggle--text">{{typeof .data.onText !== "undefined" ? .data.onText : "Ano"}}</span>
                </span>
                <span class="Toggle--off"
                    style="
                        {{#if ~/__Toggle[._value + '-move']}}
                            transform: translateX(
                                {{~/__Toggle[._value] ?
                                    -100 + (Math.min(1, Math.max(0, (~/__Toggle[._value + '-move'].maxHMove + ~/__Toggle[._value + '-transform']) / ~/__Toggle[._value + '-move'].maxHMove)) * 100) :
                                    -100 + (Math.min(1, Math.max(0, ~/__Toggle[._value + '-transform'] / ~/__Toggle[._value + '-move'].maxHMove)) * 100)
                                }}%);
                            padding-left:
                                {{~/__Toggle[._value] ?
                                   ~/__Toggle[._value + '-move'].handleW - (~/__Toggle[._value + '-move'].handleW * (Math.min(1, Math.max(0, (~/__Toggle[._value + '-move'].maxHMove + ~/__Toggle[._value + '-transform']) / ~/__Toggle[._value + '-move'].maxHMove)))) :
                                   ~/__Toggle[._value + '-move'].handleW - (~/__Toggle[._value + '-move'].handleW * (Math.min(1, Math.max(0, ~/__Toggle[._value + '-transform'] / ~/__Toggle[._value + '-move'].maxHMove))))
                                }}px;
                        {{/if}}
                        {{#if ~/__Toggle[._value + '-move']}}transition: none;{{/if}}
                    "
                >
                    <span class="Toggle--text">{{typeof .data.offText !== "undefined" ? .data.offText : "Ne"}}</span>
                </span>
            </span>

        </label>

    {{/with}}

</span>
