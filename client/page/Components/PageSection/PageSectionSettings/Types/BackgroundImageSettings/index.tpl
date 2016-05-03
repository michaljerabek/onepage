<div class="E_BackgroundImageSettings"
    decorator="PageSectionSettingsBox:.E_PageSectionSettings--scrollable"
    data-max-resize-height="768"
    style="max-height: 320px;"
 >

    <div class="E_BackgroundImageSettings--background-settings E_PageSectionSettings--scrollable">

        <div class="E_PageSectionSettings--scrolling-content">

            <div class="E_PageSectionSettings--sections">

                <div class="E_PageSectionSettings--section E_BackgroundImageSettings--source">

                    {{> Button {
                            text: "Zrušit obrázek na pozadí",
                            icon: "#icon-x",
                            size: "small",
                            set: "data.backgroundImage.src",
                            value: ""
                        }
                    }}

                </div>

            </div>

            <div class="E_PageSectionSettings--sections">

                <div class="E_PageSectionSettings--section E_BackgroundImageSettings--display">

                    <h2 class="E_PageSectionSettings--section-title">Zbrazení</h2>

                    <input id="E_BackgroundImageSettings--display__repeat" type="radio" name="{{.data.backgroundImage.display}}" value="repeat">
                    <label for="E_BackgroundImageSettings--display__repeat">Opakovat</label>
                    <input id="E_BackgroundImageSettings--display__cover" type="radio" name="{{.data.backgroundImage.display}}" value="cover">
                    <label for="E_BackgroundImageSettings--display__cover">Vyplnit</label>
                </div>

                <div class="E_PageSectionSettings--section E_BackgroundImageSettings--effects">

                    <h2 class="E_PageSectionSettings--section-title">Efekt</h2>

                    <input id="E_BackgroundImageSettings--effects__fixed" type="checkbox" name="{{.data.backgroundImage.effects}}" value="fixed">
                    <label for="E_BackgroundImageSettings--effects__fixed">Fixní</label>
                    <input id="E_BackgroundImageSettings--effects__parallax" type="checkbox" name="{{.data.backgroundImage.effects}}" value="parallax">
                    <label for="E_BackgroundImageSettings--effects__parallax">Parallax</label>
                </div>

                <div class="E_PageSectionSettings--section E_BackgroundImageSettings--effect-strength">

                    <h2 class="E_PageSectionSettings--section-title">Síla efektu</h2>

                    <input id="E_BackgroundImageSettings--effects-strength"
                        type="number"
                        value="{{.data.backgroundImage.effectsStrength}}"
                        {{#if .data.backgroundImage.effects.indexOf('parallax') === -1}}disabled{{/if}}
                    >
                </div>

            </div>

        </div>

    </div>

    <div class="E_BackgroundImageSettings--ImageBrowser E_PageSectionSettings--scrollable">

        <div class="E_PageSectionSettings--scrolling-content">

            <BackgroundImageBrowser progressBarId="{{.data.internalId}}" selectedPath="{{.data.backgroundImage.src}}" />

        </div>

    </div>

</div>
