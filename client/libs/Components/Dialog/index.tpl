{{#if ~/messages[0]}}

    <div class="Dialog Dialog--overlay"
        intro="fade:{
            duration: 300
        }"
        outro="fade:{
            delay: 200,
            duration: 300
        }"
    >

        {{#if ~/messages.length % 2}}

            {{> dialogBox}}

        {{else}}

            {{> dialogBox}}

        {{/if}}

    </div>

{{/if}}


{{#partial dialogBox}}

<div class="
        Dialog--box
        Dialog--box__{{~/messages[0].type}}
    "
    intro-outro="attr:{
        duration: 500
    }"
    on-tap-escape="
        @this.fire(~/messages[0].close || ~/messages[0].dismiss ? 'handleUserInput' : 'closeDialog',
            ~/messages[0].close   ? [~/messages[0].close.fire  , ~/messages[0].close.event  , ~/messages[0].close.context] :
            ~/messages[0].dismiss ? [~/messages[0].dismiss.fire, ~/messages[0].dismiss.event, ~/messages[0].dismiss.context] : undefined
        )
    "
>
    <div class="Dialog--close" tabindex="1003" on-tap-space-enter="
            @this.fire(~/messages[0].close || ~/messages[0].dismiss ? 'handleUserInput' : 'closeDialog',
                ~/messages[0].close   ? [~/messages[0].close.fire  , ~/messages[0].close.event  , ~/messages[0].close.context] :
                ~/messages[0].dismiss ? [~/messages[0].dismiss.fire, ~/messages[0].dismiss.event, ~/messages[0].dismiss.context] : undefined
            )
        "
    >
        <svg><use xlink:href="#icon-x"></use></svg>
    </div>

    <h2 class="Dialog--title">{{~/messages[0].title}}</h2>

    <p class="Dialog--text">{{~/messages[0].text}}</p>

    {{#if ~/messages[0].confirm}}

        {{> Button {
                size: "small",
                type : "ok",
                fire : "handleUserInput",
                event: [
                    ~/messages[0].confirm.fire,
                    ~/messages[0].confirm.event,
                    ~/messages[0].confirm.context,
                    ~/messages[0].confirm.exec
                ],
                title: ~/messages[0].confirm.title,
                text : ~/messages[0].confirm.text || "Potvrdit",
                icon : ~/messages[0].confirm.icon || "#icon-check-mark",
                tabindex: 1002
            }
        }}

    {{/if}}

    {{#if ~/messages[0].close}}

        {{> Button {
                size: "small",
                type : "default",
                fire : "handleUserInput",
                event: [
                    ~/messages[0].close.fire,
                    ~/messages[0].close.event,
                    ~/messages[0].close.context,
                    ~/messages[0].close.exec
                ],
                title: ~/messages[0].close.title,
                text : ~/messages[0].close.text || "Zavřít",
                icon : ~/messages[0].close.icon || "#icon-x",
                iconW: ~/messages[0].close.iconW || 14,
                iconH: ~/messages[0].close.iconH || 14,
                tabindex: 1001
            }
        }}

    {{/if}}

    {{#if ~/messages[0].dismiss}}

        {{> Button {
                size: "small",
                type : "danger",
                fire : "handleUserInput",
                event: [
                    ~/messages[0].dismiss.fire,
                    ~/messages[0].dismiss.event,
                    ~/messages[0].dismiss.context,
                    ~/messages[0].dismiss.exec
                ],
                title: ~/messages[0].dismiss.title,
                text : ~/messages[0].dismiss.text || "Zavřít",
                icon : ~/messages[0].dismiss.icon || "#icon-x",
                iconW: ~/messages[0].close.iconW || 14,
                iconH: ~/messages[0].close.iconH || 14,
                tabindex: 1001
            }
        }}

    {{/if}}

</div>

{{/partial}}
