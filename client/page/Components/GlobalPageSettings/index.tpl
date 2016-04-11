<div class="E_GlobalPageSettings">

    <h2>Globální nastavení <span class="E_PageMenu--show-page" on-touchstart-touchend-hover="showPage">&#x1f441</span></h2>

    <label for="global-settings--font">Písmo:</label>

    <select name="global-settings--font" id="global-settings--font" value="{{.settings.fontType}}">
        {{#each .fontTypes}}
            <option value="{{@key}}">{{.}}</option>
        {{/each}}
    </select>

    <ColorPicker noColor="true" output="{{pageTitleColorTest}}" input="[[#if pageTitleColorTest]][[pageTitleColorTest]][[else]]rgb(12, 35, 90)[[/if]]">
        <ColorPickerPalette title="Barvy" colors="['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)']" />
        <ColorPickerPalette title="Obrázek" image="img/img18.jpg" />
    </ColorPicker>

    <img style="width: 100%;" src="img/img18.jpg" alt="">

</div>
