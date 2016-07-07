<div class="E_ColorSettings"
    as-ResizableBox
    data-max-resize-height="768"
    style="max-height: 320px"
>

    <div class="E_ColorSettings--menu E_PageSectionSettings--scrollable ResizableBox--scrollable">
        <div class="E_PageSectionSettingsMenu E_PageSectionSettings--scrolling-content ResizableBox--scrolling-content">
            <ul class="E_PageSectionSettingsMenu--list E_ColorSettings--menu-list">
                {{>ColorSettingsNavItem {index: 1, settings: this}}}
            </ul>

            {{> Button {
                    size: "small",
                    text: "Vygenerovat z výchozích",
                    fire: "generateRandomColors",
                    title: "Vybere barvy z výchozí palety a všechny nastavené barvy přepíše",
                    className: "E_ColorSettings--random-colors-button"
                }
            }}

        </div>
    </div>

    <div class="E_ColorSettings--ColorPicker E_PageSectionSettings--scrollable ResizableBox--scrollable">
        <div class="E_PageSectionSettings--scrolling-content ResizableBox--scrolling-content">{{>ColorSettingsTab}}</div>
    </div>

</div>
