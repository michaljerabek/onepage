<span role="button" class="FlatButton
        FlatButton__{{.size  || 'medium'}}
        FlatButton__{{.type  || 'default'}}
        FlatButton__{{.state || 'normal'}}
        {{#if !.text}}FlatButton__no-text{{/if}}
        {{.className}}
   "
   title="{{.title}}"
>

    {{#if .fire}}

        <span class="FlatButton--event" on-tap="{{.fire}}:{{.event}}"></span>

    {{elseif .mousedown || .mouseup || .touchstart || .touchend || .click}}

        <span class="FlatButton--event"
            on-touchstart="{{.touchstart}}:{{.touchstartEvent || .event}}"
            on-touchend="{{.touchend}}:{{.touchendEvent || .event}}"
            on-mousedown="{{.mousedown}}:{{.mousedownEvent || .event}}"
            on-mouseup="{{.mouseup}}:{{.mouseupEvent || .event}}"
            on-click="{{.click}}:{{.clickEvent || .event}}"
        ></span>

    {{elseif .set}}

        <span class="FlatButton--event" on-tap="set(.set, .value)"></span>

    {{/if}}

    {{#if .icon}}
        <span class="FlatButton--icon"
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
