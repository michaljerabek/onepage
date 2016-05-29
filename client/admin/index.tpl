<div>
   <h1>Admin: {{user}}</h1>

    <p>
        <a href="/users/logout">odhlásit se</a>
    </p>

    {{#each pages}}

        <button style="{{#if selectedPage._id === this._id}}background: red; border: 1px solid;{{/if}}" on-tap="set('selectedPage', this)">{{this.name}}</button>

    {{/each}}

    {{#if .selectedPage}}

        <br>
        <button on-tap="@this.set('selectedPage', null)">Zrušit výběr</button>
        <button on-tap="@this.set('editPage', .selectedPage._id)">Upravit: {{.pageId}}</button>

    {{/if}}
</div>

{{#if .editPage}}
    <div id="pageWrapper" style="position:relative;z-index: 200;">
        <div intro-outro="fade" style="background:white;">
            <Page editMode="true" isAdmin="true" pageId={{.editPage}} />
        </div>
    </div>
{{/if}}

