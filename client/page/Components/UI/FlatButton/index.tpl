<span role="button" class="FlatButton
        FlatButton__{{.size  || 'medium'}}
        FlatButton__{{.type  || 'default'}}
        FlatButton__{{.state || 'normal'}}
        {{#if !.text}}FlatButton__no-text{{/if}}
        {{.className}}
    "
    title="{{.title}}"
    on-mousedown-touchstart=".preventDefault && event.original.preventDefault()"
>

    {{#if .fire}}

        <span class="FlatButton--event" on-tap="@this.fire(.fire, event, .event, @this)"></span>

    {{elseif .mousedown || .mouseup || .touchstart || .touchend || .click}}

        <span class="FlatButton--event"
            on-touchstart="@this.fire(.touchstart, event, .touchstartEvent || .event)"
            on-touchend="  @this.fire(.touchend  , event, .touchendEvent   || .event)"
            on-mousedown=" @this.fire(.mousedown , event, .mousedownEvent  || .event)"
            on-mouseup="   @this.fire(.mouseup   , event, .mouseupEvent    || .event)"
            on-click="     @this.fire(.click     , event, .clickEvent      || .event)"
        ></span>

    {{elseif .set}}

        <span class="FlatButton--event" on-tap="@this.set(.set, .value)"></span>

    {{/if}}

    {{#if .icon}}
        <span class="FlatButton--icon"
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
        <span class="FlatButton--wrapper">
            <span class="FlatButton--text
                    {{#if .text.length < 5}}FlatButton--text__short{{/if}}
                    {{#if .text.length > 10}}FlatButton--text__long{{/if}}
                    {{#if .text.length > 15}}FlatButton--text__extra-long{{/if}}
                "
            >
                {{.text}}
            </span>
        </span>
    {{/if}}

</span>
