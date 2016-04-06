{{#if .TopLeftEditUI !== false}}
    <div class="E_PageSectionEditUI--controls E_PageSectionEditUI--controls__top-left">
        <div class="E_PageSectionEditUI--controls-wrapper">
            <div class="E_PageSectionEditUI--controls-shadow"></div>
                {{>EditUIControlsTopLeft}}
        </div>
    </div>
{{/if}}

{{#if .TopRightEditUI !== false}}
    <div class="E_PageSectionEditUI--controls E_PageSectionEditUI--controls__top-right">
        <div class="E_PageSectionEditUI--controls-wrapper">
            <div class="E_PageSectionEditUI--controls-shadow"></div>
                {{>EditUIControlsTopRight}}
        </div>
    </div>
{{/if}}

{{#if .BottomLeftEditUI !== false}}
    <div class="E_PageSectionEditUI--controls E_PageSectionEditUI--controls__bottom-left">
        <div class="E_PageSectionEditUI--controls-wrapper">
            <div class="E_PageSectionEditUI--controls-shadow"></div>
                {{>EditUIControlsBottomLeft}}
        </div>
    </div>
{{/if}}

{{#if .BottomRightEditUI !== false}}
    <div class="E_PageSectionEditUI--controls E_PageSectionEditUI--controls__bottom-right">
        <div class="E_PageSectionEditUI--controls-wrapper">
            <div class="E_PageSectionEditUI--controls-shadow"></div>
                {{>EditUIControlsBottomRight}}
        </div>
    </div>
{{/if}}
