<div class="P_BackgroundImage
        P_PageSection--background-image
        {{#if .parallax}}P_BackgroundImage__parallax{{/if}}
        {{#if .fixed}}P_BackgroundImage__fixed{{/if}}
    "
>
    <div class="P_BackgroundImage--image"
        style="
            background-image:        url({{.data.src}});
            -webkit-background-size: {{.backgroundSize}};
            background-size:         {{.backgroundSize}};
            background-repeat:       {{.backgroundRepeat}};
            {{#if .parallax}}
                height: -webkit-calc(100% + {{.parallaxExtention}}px);
                height: -moz-calc(100% + {{.parallaxExtention}}px);
                height: calc(100% + {{.parallaxExtention}}px);
            {{/if}}
        "
    >

    </div>

    {{#if .editMode}}

        <div class="E_BackgroundImage--upload-progress
            {{#if .imageUploadActive}}E_BackgroundImage--upload-progress__active{{/if}}
            {{#if .imageUploadError}}E_BackgroundImage--upload-progress__error{{/if}}"
        >
            <div class="fill" style="width: {{.imageUploadProgress}}%"></div>
        </div>

    {{/if}}
</div>
