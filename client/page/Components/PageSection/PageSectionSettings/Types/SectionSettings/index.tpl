<div class="E_SectionSettings"
    decorator="PageSectionSettingsBox:.E_PageSectionSettings--scrollable"
    data-max-resize-height="768"
    style="max-height: 320px"
>

    <div class="E_ColorSettings--menu E_PageSectionSettings--scrollable">
        <div class="E_PageSectionSettingsMenu E_PageSectionSettings--scrolling-content">

            <div class="E_PageSectionSettings--scrolling-content">

                <div class="E_PageSectionSettings--sections E_PageSectionSettings--sections__full">

                    <div class="E_PageSectionSettings--section E_BackgroundImageSettings--display">

                        <label class="E_PageSectionSettings--section-title" for="E_SectionSettings--name">Název sekce</label>

                        {{> Text {
                                adaptive: true,
                                id: "E_SectionSettings--name",
                                size: "small",
                                value: "data.name",
                                required: true
                            }
                        }}

                    </div>

                </div>

            </div>

        </div>
    </div>

</div>
