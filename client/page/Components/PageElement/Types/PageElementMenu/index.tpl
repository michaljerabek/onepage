<nav class="
        P_PageElementMenu
        {{#if .fixed}}P_PageElementMenu__fixed{{/if}}
        {{#if .element.fill}}P_PageElementMenu__fill{{/if}}
        P_font-body
    "
    style="

        {{#if .element.fill || .fixed}}
            background-color: {{.element.backgroundColor || .backgroundColor || .defaultColors.backgroundColor}};
            color: {{.element.textColor || .element.autoTextColor || .textColor || .defaultColors.textColor}};
        {{else}}
            color: {{.textColor || .defaultColors.textColor}};
        {{/if}}
    "
 >

    <PageElementLogo element="{{.element}}" />
    Hlavní Menu
 </nav>
