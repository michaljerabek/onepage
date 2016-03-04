<div on-mousedown="toggle('open')" style="{{open ? 'bottom: 0': ''}}" class="E_GlobalPageSettings">

    <h2>Globální nastavení</h2>

    <label for="global-settings--font">Písmo:</label>
    <select name="global-settings--font" id="global-settings--font" value="{{.settings.fontType}}">
        {{#each .fontTypes}}
            <option value="{{@key}}">{{.}}</option>
        {{/each}}
    </select>

</div>
