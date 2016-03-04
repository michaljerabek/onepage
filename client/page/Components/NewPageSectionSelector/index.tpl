<div on-mousedown="toggle('open')" style="{{open ? 'top: 0': ''}}" class="E_NewPageSectionSelector">

    <h2>Vyberte sekci</h2>

    <div class="E_NewPageSectionSelector--page-section-types">
        <div on-tap="insertSection:'PageSectionA'" data-page-section-type="PageSectionA" class="E_NewPageSectionSelector--page-section-type">A</div>
        <div on-tap="insertSection:'PageSectionB'" data-page-section-type="PageSectionB" class="E_NewPageSectionSelector--page-section-type">B</div>
        <div on-tap="insertSection:'PageSectionC'" data-page-section-type="PageSectionC" class="E_NewPageSectionSelector--page-section-type">C</div>
    </div>

</div>
