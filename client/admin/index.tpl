<h1>Admin: {{user}}</h1>

<p>
    <a href="/users/logout">odhlásit se</a>
</p>

{{#each pages}}

    <button style="{{#if selectedPage._id === this._id}}background: red; border: 1px solid;{{/if}}" on-tap="set('selectedPage', this)">{{this.name}}</button>
{{/each}}

{{#if .selectedPage}}

    <br>
    <button on-tap="set('selectedPage', null)">Zrušit výběr</button>
    <button on-tap="set('editPage', .selectedPage._id)">Upravit: {{.pageId}}</button>

{{/if}}

{{#if .editPage}}
    <div intro-outro="fade" style="position:absolute;top:0;left:0;width:100%;height:100%;background:white;">
        <Page isAdmin="true" pageId={{.editPage}} />
    </div>
{{/if}}

