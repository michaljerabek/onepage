<BackgroundImage data="{{.section.backgroundImage}}" />

<div class="P_PageSection--content-wrapper">

    <div class="P_PageSection--center">

        <div class="P_PageSectionHeader--title">

            <PageElementTitle
                element="{{.section}}"
                source="title"
                activateButton="true"
                lang="{{.lang}}"
                tplLang="{{.tplLang}}"
                emptyStateTo=".P_PageSectionHeader--title"
                countLines="[[true]]"
                maxLength="[[74]]"
            />

        </div>

        <div class="P_PageSectionHeader--subtitle">

            <PageElementTitle
                element="{{.section}}"
                source="subtitle"
                activateButton="true"
                lang="{{.lang}}"
                tplLang="{{.tplLang}}"
                emptyStateTo=".P_PageSectionHeader--subtitle"
                maxLength="[[150]]"
            />

        </div>

        {{>PageElementButtons}}

    </div>
</div>
