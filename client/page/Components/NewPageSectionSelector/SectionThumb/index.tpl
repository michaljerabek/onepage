<span class="E_SectionThumb
        E_SectionThumb__{{.state || 'normal'}}
    "
    data-page-section-type="{{.type}}"
    tabindex="{{.tabindex || 0}}"
    on-tap-enter-space="{{#if .state !== 'disabled'}}insertSection{{/if}}:{{.type}}"
>

    <span class="E_SectionThumb--content">

        {{#if .icon}}
        <span class="E_SectionThumb--icon"
              style="
                      top: {{.iconY + 'px'}};
                     left: {{.iconX + 'px'}};
                    width: {{.iconW + 'px'}};
                   height: {{.iconH + 'px'}};
                transform: rotate({{.iconR || 0}}deg);
            "
        >
            <svg><use xlink:href="{{.icon}}"></use></svg>
        </span>
        {{/if}}

        {{#if .name}}
        <span class="E_SectionThumb--name">
            <span class="E_SectionThumb--text
                    {{#if .name.length > 20}}E_SectionThumb--text__long{{/if}}
                    {{#if .name.length > 30}}E_SectionThumb--text__extra-long{{/if}}
                "
            >
                {{.name}}
            </span>
        </span>
        {{/if}}

    </span>
</span>
