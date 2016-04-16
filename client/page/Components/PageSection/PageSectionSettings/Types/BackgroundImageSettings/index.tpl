<div class="E_BackgroundImageSettings"
    decorator="PageSectionSettingsBox"
    data-max-resize-height="768"
    style="max-height: 320px"
 >

    <div class="PageSectionSetitngs--scrollable" style="">

        <div style="padding-bottom: 20px" class="E_BackgroundImageSettings--source">

            <input type="text" style="line-heigth: 32px; height: 32px; width: calc(100% - 40px); margin: 20px" value="{{data.backgroundImage.src}}">

        </div>

        <div style="padding-bottom: 20px" class="E_BackgroundImageSettings--display">
            <h2>Zbrazení</h2>

            <input id="E_BackgroundImageSettings--display__repeat" type="radio" name="{{.data.backgroundImage.display}}" value="repeat">
            <label for="E_BackgroundImageSettings--display__repeat">Opakovat</label>
            <input id="E_BackgroundImageSettings--display__cover" type="radio" name="{{.data.backgroundImage.display}}" value="cover">
            <label for="E_BackgroundImageSettings--display__cover">Pokrýt</label>
        </div>

        <div style="padding-bottom: 20px" class="E_BackgroundImageSettings--effects">
            <h2>Efekt</h2>

            <input id="E_BackgroundImageSettings--effects__fixed" type="checkbox" name="{{.data.backgroundImage.effects}}" value="fixed">
            <label for="E_BackgroundImageSettings--effects__fixed">Fixní</label>
            <input id="E_BackgroundImageSettings--effects__parallax" type="checkbox" name="{{.data.backgroundImage.effects}}" value="parallax">
            <label for="E_BackgroundImageSettings--effects__parallax">Parallax</label>
        </div>

        <div style="padding-bottom: 20px" class="E_BackgroundImageSettings--effects">
            <h2>Síla efektu</h2>

            <input id="E_BackgroundImageSettings--effects-strength"
                type="number"
                value="{{.data.backgroundImage.effectsStrength}}"
                {{#if .data.backgroundImage.effects.indexOf('parallax') === -1}}disabled{{/if}}
            >
        </div>

    </div>

</div>
