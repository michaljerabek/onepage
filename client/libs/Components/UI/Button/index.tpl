<span role="button"
    class="
        Button
        Button__{{.type  || 'default'}}
        Button__{{.size  || 'medium'}}
        Button__{{.state || 'normal'}}
        {{#if !.icon}}Button__no-icon{{/if}}
        {{#if !.text}}Button__no-text{{/if}}
    "
    {{#if !.fire && !.set}}tabindex="{{.tabindex || 0}}"{{/if}}
>

    {{#if .fire}}

        <span class="Button--event"
            tabindex="{{.tabindex || 0}}"
            on-tap="{{.fire}}:{{.event}}"
            on-enter="{{.fire}}:{{.event}}"
        ></span>

    {{elseif .set}}

        <span class="Button--event"
            tabindex="{{.tabindex || 0}}"
            on-tap="set(.set, .value)"
            on-enter="set(.set, .value)"
        ></span>

    {{/if}}

    <span class="Button--content">

        {{#if .icon}}
            <span class="Button--icon"
                style="
                          top: {{.iconY + 'px'}};
                         left: {{.iconX + 'px'}};
                        width: {{.iconW + 'px'}};
                       heigth: {{.iconH + 'px'}};
                    transform: rotate({{.iconR || 0}}deg);
                "
            >
                <svg><use xlink:href="{{.icon}}"></use></svg>
            </span>
        {{/if}}

        {{#if .text}}
            <span class="Button--text">{{.text}}</span>
        {{/if}}

    </span>
</span>
