<div class="E_GlobalFontSettings">

    <div class="E_GlobalFontSettings--wrapper">

        {{#each .fontTypes}}

            <div class="
                    E_GlobalFontSettings--font-type
                    {{#if ../../settings.fontType === @key}}E_GlobalFontSettings--font-type__active{{/if}}
                "
                data-font-type="{{@key}}"
                on-tap="set('settings.fontType', @key)"
            >

                <div class="E_GlobalFontSettings--font-preview">

                    <div class="E_GlobalFontSettings--title">{{.title}}</div>
                    <div class="E_GlobalFontSettings--body">
                        <div class="E_GlobalFontSettings--body-title">{{.body}}</div>
                        <div class="E_GlobalFontSettings--body-preview">Lorem ipsum dolor sit amet</div>
                    </div>
                </div>

            </div>

        {{/each}}

    </div>

</div>
