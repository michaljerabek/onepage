<div class="E_SectionSettings"
    as-ResizableBox
    data-max-resize-height="768"
    style="max-height: 320px"
>

    <div class="E_PageSectionSettings--scrollable ResizableBox--scrollable">
        <div class="E_PageSectionSettings--scrolling-content ResizableBox--scrolling-content">

            <div class="E_PageSectionSettings--sections">

                <div class="E_PageSectionSettings--section E_SectionSettings--name">

                    <label class="E_PageSectionSettings--section-title" for="E_SectionSettings--name" title="Název bude použit jako id sekce.">
                        Název sekce
                        {{> titleLangIcon}}
                    </label>

                    {{> Text {
                            adaptive: true,
                            id: "E_SectionSettings--name",
                            size: "small",
                            value: "data.name." + .lang,
                            required: true
                        }
                    }}

                </div>

                <div class="E_PageSectionSettings--section E_SectionSettings--add-to-menu">

                    {{> ToggleField
                        {
                            size: "small",
                            value: "data.addToMenu",
                            text: "Přidat odkaz do hlavního menu"
                        }
                    }}

                    <p class="E_PageElementSettings--note">V případě přidání odkazu se jako jeho text použije název sekce. Tento text je ovšem nezávislý na názvu, takže ho můžete změnit beze změny názvu sekce.</p>

                </div>

            </div>

            <div class="E_PageSectionSettings--sections">

                {{#if .layoutTemplate}}

                    <div class="E_PageSectionSettings--section E_SectionSettings--layout">

                        <h2 class="E_PageSectionSettings--section-title">Layout</h2>

                        {{> .layoutTemplate}}

                    </div>

                {{/if}}

                {{#if !.noShadow}}

                    <div class="E_PageSectionSettings--section E_SectionSettings--shadow">

                        <h2 class="E_PageSectionSettings--section-title">Stín prvků</h2>

                        {{> Switch {
                                size: "small",
                                value: "data.addShadow",
                                state: .data.backgroundImage.src ? "" : "disabled",
                                options: [
                                    {
                                        text: "Vypnuto",
                                        icon: "#icon-text",
                                        value: undefined
                                    },
                                    {
                                        text: "Mírný",
                                        icon: "#icon-text-shadow-1",
                                        value: 10
                                    },
                                    {
                                        text: "Střední",
                                        icon: "#icon-text-shadow-2",
                                        value: 20
                                    },
                                    {
                                        text: "Výrazný",
                                        icon: "#icon-text-shadow-3",
                                        value: 30
                                    }
                                ]
                            }
                        }}

                        {{#if !.data.backgroundImage.src}}
                        <p slide-in="{duration: .completed ? 300 : 0}" slide-out="{duration: .completed ? 300 : 0}" class="E_PageSectionSettings--section-note">Stín lze nastavit pouze v případě, že je jako pozadí použit obrázek.</p>
                        {{/if}}

                    </div>

                {{/if}}


            </div>

        </div>
    </div>

</div>
