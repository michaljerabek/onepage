
<div style="{{#if .isAdmin}}position:fixed;top:0;left:0;width:100%;height:100%;background:white;{{/if}}">
{{#if !pageId || pageId === page._id}}
    <h1>{{page.name}}</h1>
    {{#if .isAdmin}}
        <button on-click="closePage()">Zavřít</button>
    {{/if}}
{{/if}}
</div>


