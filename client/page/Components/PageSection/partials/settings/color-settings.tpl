<ColorSettings data="{{.section}}" multipleTabs="[[true]]"
    image="{{.section.backgroundImage.src}}"
    image2="{{.selectImage || .section.image.src}}"
    color1-title="Text"                                                   color1="{{.section.textColor}}"       color1-pathName="textColor"       color1-input-default="{{.section.defaultColors.textColor}}"
    color2-title="Pozadí"                                                 color2="{{.section.backgroundColor}}" color2-pathName="backgroundColor" color2-input-default="{{.section.defaultColors.backgroundColor}}"
    color3-title="Speciální barva" color3-subtitle="Ikony, tlačítka, ..." color3="{{.section.specialColor}}"    color3-pathName="specialColor"    color3-input-default="{{.section.defaultColors.specialColor}}"
/>
