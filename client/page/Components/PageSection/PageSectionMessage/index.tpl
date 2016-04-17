
<div class="E_PageSectionMessage
       {{#if .message}}E_PageSectionMessage__active{{/if}}
    "
>
    <div class="E_PageSectionMessage--message {{.messageStatusClass}}">
        {{#if .message.title}}
            <h2 class="E_PageSectionMessage--title">{{.message.title}}</h2>
        {{/if}}

        {{#if .message.text}}
            <p class="E_PageSectionMessage--text">{{.message.text}}</p>
        {{/if}}
    </div>
</div>
