{{#if .toggleTab}}
<ColorPicker pathName="{{this['color' + .openTab + '-pathName']}}" defer="true" noColor="true" output="{{this['color' + .openTab]}}" input="{{this['color' + .openTab] || this['color' + .openTab + '-input-default']}}" inputType="[[.lastInputType]]">
    <ColorPickerPalette title="Nejpoužívanější" colors="{{.mostUsedColors}}" />
    <ColorPickerPalette title="Výchozí" colors="{{@this.Page.get('page.settings.colorPalette.colors')}}" id="defaultColors" />
    [[#if .imageColors.background]]
    <ColorPickerPalette title="Pozadí" colors="{{.imageColors.background.colors}}" image="{{._image}}" images="{{.sectionsBgImages}}" />
    [[/if]]
    [[#if !.imageColors.background]]
    <ColorPickerPalette id="background" title="Pozadí" image="{{._image}}" images="{{.sectionsBgImages}}" />
    [[/if]]
    [[#if .imageColors.images]]
    <ColorPickerPalette title="Obrázek" colors="{{.imageColors.images.colors}}" image="{{._image2}}"  images="{{.sectionImages}}"/>
    [[/if]]
    [[#if !.imageColors.images]]
    <ColorPickerPalette id="images" title="Obrázek" image="{{._image2}}" images="{{.sectionImages}}" delay="[[.toggleTab === undefined ? (delayOpening ? 600 : 300) : 0]]" />
    [[/if]]
</ColorPicker>
{{/if}}

{{#if !.toggleTab}}
<ColorPicker pathName="{{this['color' + .openTab + '-pathName']}}" defer="true" noColor="true" output="{{this['color' + .openTab]}}" input="{{this['color' + .openTab] || this['color' + .openTab + '-input-default']}}" inputType="[[.lastInputType]]">
    <ColorPickerPalette title="Nejpoužívanější" colors="{{.mostUsedColors}}" />
    <ColorPickerPalette title="Výchozí" colors="{{@this.Page.get('page.settings.colorPalette.colors')}}" id="defaultColors" />
    [[#if .imageColors.background]]
    <ColorPickerPalette title="Pozadí" colors="{{.imageColors.background.colors}}" image="{{._image}}"  images="{{.sectionsBgImages}}"/>
    [[/if]]
    [[#if !.imageColors.background]]
    <ColorPickerPalette id="background" title="Pozadí" image="{{._image}}" images="{{.sectionsBgImages}}" delay="[[.toggleTab === undefined ? (delayOpening ? 600 : 300) : 0]]" />
    [[/if]]
    [[#if .imageColors.images]]
    <ColorPickerPalette title="Obrázek" colors="{{.imageColors.images.colors}}" image="{{._image2}}"  images="{{.sectionImages}}"/>
    [[/if]]
    [[#if !.imageColors.images]]
    <ColorPickerPalette id="images" title="Obrázek" image="{{._image2}}" images="{{.sectionImages}}" delay="[[.toggleTab === undefined ? (delayOpening ? 600 : 300) : 0]]" />
    [[/if]]
</ColorPicker>
{{/if}}
