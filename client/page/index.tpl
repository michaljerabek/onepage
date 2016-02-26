{{#if !pageId || pageId === page._id}}
    <div id="page">
        <h1>{{page.name}}</h1>

        {{#if .isAdmin === true}}
            <button on-tap="closePage()">Zavřít</button>
        {{/if}}

        {{#each page.sections:sectionIndex}}

            <PageSection section="{{this}}" sectionIndex="{{sectionIndex}}" />

        {{/each}}

    </div>
{{/if}}
