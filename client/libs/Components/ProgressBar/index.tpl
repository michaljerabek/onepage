<div class="E_ProgressBar
        {{#if .active}}E_ProgressBar__active{{/if}}
        {{#if .error}}E_ProgressBar__error{{/if}}
        {{#if .warn}}E_ProgressBar__warn{{/if}}
        {{#if .success}}E_ProgressBar__success{{/if}}
    "
>
    <div class="E_ProgressBar--progress" style="width: {{.progress}}%"></div>
</div>
