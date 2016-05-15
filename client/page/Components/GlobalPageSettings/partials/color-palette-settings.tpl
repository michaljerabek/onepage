<div class="E_GlobalColorPaletteSettings">

    {{#each .colorPalettes}}
    <ul class="E_GlobalColorPaletteSettings--colors" on-tap="set('settings.colorPalette', {
        colors: [
            .colors[0],
            .colors[1],
            .colors[2],
            .colors[3],
            .colors[4]
        ],
        textLight: .textLight,
        textDark: .textDark,
        headerImg: .headerImg
    })">

            {{#each .colors}}
                <li class="E_GlobalColorPaletteSettings--color" style="background-color: {{.}}"></li>
            {{/each}}

        </ul>
    {{/each}}

</div>
