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

                    <h2 class="E_PageSectionSettings--section-title">Zobrazení</h2>

                    {{>Switch {
                            size: "small",
                            value: ".data.backgroundImage.display",
                            options: [
                                {
                                    icon: "#icon-squares-2x2",
                                    text: "Opakovat",
                                    value: "repeat",
                                    title: "Vyplnit plochu opakováním obrázku"
                                },
                                {
                                    icon: "#icon-fullscreen",
                                    text: "Vyplnit",
                                    value: "cover",
                                    title: "Vyplnit plochu přizpůsobením obrázku"
                                }
                            ]
                        }
                    }}

                </div>

                <div class="E_PageSectionSettings--section E_BackgroundImageSettings--effects">

                    <h2 class="E_PageSectionSettings--section-title">Efekt</h2>

                    {{>Switch {
                            multiple: true,
                            size: "small",
                            value: ".data.backgroundImage.effects",
                            options: [
                                {
                                    icon: "#icon-pin",
                                    text: "Fixní",
                                    value: "fixed",
                                    title: "Zafixovat jako nepohyblivou tapetu"
                                },
                                {
                                    icon: "#icon-scroll",
                                    text: "Parallax",
                                    value: "parallax",
                                    title: "Posouvat pozadí pomaleji"
                                }
                            ]
                        }
                    }}

                    <p class="E_PageSectionSettings--section-note">Efekt <q>fixní</q> nemusí fungovat na mobilních zařízeních.</p>

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
