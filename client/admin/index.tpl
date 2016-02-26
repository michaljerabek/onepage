<h1>Admin: {{user}}</h1>

<p>
    <a href="/users/logout">odhlásit se</a>
</p>

{{#each pages}}

    <button style="{{#if selectedPage._id === this._id}}background: red; border: 1px solid;{{/if}}" on-click="set('selectedPage', this)">{{this.name}}</button>
{{/each}}

{{#if .selectedPage}}

    <br>
    <button on-click="set('selectedPage', null)">Zrušit výběr</button>
    <button on-click="set('editPage', .selectedPage._id)">Upravit: {{.pageId}}</button>

{{/if}}


{{#if .editPage}}
    <Page isAdmin="true" pageId={{.editPage}} />
{{/if}}

