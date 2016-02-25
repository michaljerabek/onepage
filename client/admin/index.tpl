<h1>Admin: {{user}}</h1>

{{#each pages}}

    <button style="{{#if selectedPage._id === this._id}}background: red{{/if}}" on-click="set('selectedPage', this)">{{this.name}}</button>
{{/each}}

{{#if .selectedPage}}

    <br>
    <button on-click="set('selectedPage', null)">Zrušit výběr</button>
    <button on-click="set('editPage', .selectedPage._id)">Upravit: {{.pageId}}</button>

{{/if}}


{{#if .editPage}}
    <Page isAdmin="true" pageId={{.editPage}} />
{{/if}}

