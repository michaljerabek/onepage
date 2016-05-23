
{{#if .toggleTab}}
<ColorPicker pathName="{{this['color' + .openTab + '-pathName']}}" defer="true" noColor="true" output="{{this['color' + .openTab]}}" input="{{this['color' + .openTab] || this['color' + .openTab + '-input-default']}}" inputType="[[.lastInputType]]">
    <ColorPickerPalette title="Nejpoužívanější" colors="{{.mostUsedColors}}" />
    <ColorPickerPalette title="Výchozí" colors="{{@ractive.findParent('Page').get('page.settings.colorPalette.colors')}}" id="defaultColors" />
    [[#if .imageColors.background]]
    <ColorPickerPalette title="Pozadí" colors="{{.imageColors.background.colors}}" />
    [[/if]]
    [[#if !.imageColors.background]]
    <ColorPickerPalette id="background" title="Pozadí" image="{{.image}}" />
    [[/if]]
</ColorPicker>
{{/if}}

{{#if !.toggleTab}}
<ColorPicker pathName="{{this['color' + .openTab + '-pathName']}}" defer="true" noColor="true" output="{{this['color' + .openTab]}}" input="{{this['color' + .openTab] || this['color' + .openTab + '-input-default']}}" inputType="[[.lastInputType]]">
    <ColorPickerPalette title="Nejpoužívanější" colors="{{.mostUsedColors}}" />
    <ColorPickerPalette title="Výchozí" colors="{{@ractive.findParent('Page').get('page.settings.colorPalette.colors')}}" id="defaultColors" />
    [[#if .imageColors.background]]
    <ColorPickerPalette title="Pozadí" colors="{{.imageColors.background.colors}}" />
    [[/if]]
    [[#if !.imageColors.background]]
    <ColorPickerPalette id="background" title="Pozadí" image="{{.image}}" delay="[[.toggleTab === undefined ? (delayOpening ? 600 : 300) : 0]]" />
    [[/if]]
</ColorPicker>
{{/if}}
