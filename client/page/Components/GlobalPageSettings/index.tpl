<div class="E_GlobalPageSettings">

    <h2 class="E_PageMenu--title">Globální nastavení <span class="E_PageMenu--show-page" on-touchstart-touchend-hover="showPage">&#x1f441</span></h2>

    <label for="global-settings--font">Písmo:</label>

    <select name="global-settings--font" id="global-settings--font" value="{{.settings.fontType}}">
        {{#each .fontTypes}}
            <option value="{{@key}}">{{.}}</option>
        {{/each}}
    </select>

</div>
