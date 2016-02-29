{{#if !pageId || pageId === page._id}}

    {{#if .pageIsSaving}}
        <div outro="fade" style="position: fixed; z-index: 99999; top: 0; left: 0; width: 100%; height: 100%; background: black; opacity: 0.75;"></div>
    {{/if}}

    <div id="page">
        <h1 style="float: left">{{page.name}}</h1>

        {{#if .isAdmin === true}}
            <button style="float: left; margin-top: 30px; margin-left: 10px" on-tap="closePage()">Zavřít</button>
        {{/if}}

        {{#if .isAdmin}}
            <button style="float: left; margin-top: 30px; margin-left: 10px" on-tap="savePage()">Uložit</button>
        {{/if}}

        <hr style="clear: both">

        {{#each page.sections:sectionIndex}}

            <PageSection section="{{this}}" sectionIndex="{{sectionIndex}}" />

        {{/each}}

    </div>
{{/if}}
