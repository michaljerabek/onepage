<div class="E_BackgroundImageSettings"
    decorator="PageSectionSettingsBox:.PageSectionSetitngs--scrollable"
    data-max-resize-height="768"
    style="max-height: 320px"
 >

    <div style="padding-bottom: 20px" class="E_BackgroundImageSettings--source PageSectionSetitngs--scrollable">

        <input type="text" style="line-heigth: 32px; height: 32px; width: calc(100% - 40px); margin: 20px" value="{{data.backgroundImage.backgroundImage}}">

        <input id="BackgroundImage--background-size__cover" type="radio" name="{{.data.backgroundImage.backgroundSize}}" value="cover">
        <label for="BackgroundImage--background-size__cover">Cover</label>
        <input id="BackgroundImage--background-size__auto" type="radio" name="{{.data.backgroundImage.backgroundSize}}" value="auto">
        <label for="BackgroundImage--background-size__auto">Auto</label>
        <br>
        <input id="BackgroundImage--background-repeat__repeat" type="radio" name="{{.data.backgroundImage.backgroundRepeat}}" value="repeat">
        <label for="BackgroundImage--background-repeat__repeat">Repeat</label>
        <input id="BackgroundImage--background-repeat__no-repeat" type="radio" name="{{.data.backgroundImage.backgroundRepeat}}" value="no-repeat">
        <label for="BackgroundImage--background-repeat__no-repeat">No Repeat</label>

    </div>

</div>
