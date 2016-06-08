<div class="E_GlobalColorPaletteSettings">

    {{#each .colorPalettes}}
    <ul class="E_GlobalColorPaletteSettings--colors" on-tap="@this.set('settings.colorPalette', {
        colors: .colors.slice(),
        headerImg: .headerImg
    })">

            {{#each .colors}}
                <li class="E_GlobalColorPaletteSettings--color" style="background-color: {{.}}"></li>
            {{/each}}

        </ul>
    {{/each}}

</div>
