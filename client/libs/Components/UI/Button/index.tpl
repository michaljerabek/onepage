<span role="button"
    class="
        Button
        Button__{{.type  || 'default'}}
        Button__{{.size  || 'medium'}}
        Button__{{.state || 'normal'}}
        {{#if !.icon}}Button__no-icon{{/if}}
        {{#if !.text}}Button__no-text{{/if}}
        {{.className}}
    "
    title={{.title}}
    {{#if !.fire && !.set && .state !== 'disabled'}}tabindex="{{.tabindex || 0}}"{{/if}}
>

    {{#if .fire && .state !== "disabled"}}

        <span class="Button--event"
            tabindex="{{.tabindex || 0}}"
            on-tap-enter-space="@this.fire(.fire, event, .event)"
        ></span>

    {{elseif .set && .state !== "disabled"}}

        <span class="Button--event"
            tabindex="{{.tabindex || 0}}"
            on-tap-enter-space="@this.set(.set.replace(/^\./, ''), .value)"
        ></span>

    {{/if}}

    <span class="Button--content">

        {{#if .icon}}
            <span class="Button--icon"
                style="
                          top: {{typeof .iconY !== 'undefined' ? .iconY + 'px' : ''}};
                         left: {{typeof .iconX !== 'undefined' ? .iconX + 'px' : ''}};
                        width: {{typeof .iconW !== 'undefined' ? .iconW + 'px' : ''}};
                       height: {{typeof .iconH !== 'undefined' ? .iconH + 'px' : ''}};
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
