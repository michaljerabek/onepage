<div class="P_BackgroundImage
        P_PageSection--background-image
        {{#if .data.parallax}}P_BackgroundImage__parallax{{/if}}
        {{#if .data.fixed}}P_BackgroundImage__fixed{{/if}}
    "
>
    <div class="P_BackgroundImage--image"
        style="
            background-image:        url({{.data.backgroundImage}});
            -webkit-background-size: {{.data.backgroundSize}};
            background-size:         {{.data.backgroundSize}};
            background-repeat:       {{.data.backgroundRepeat}};
        "
    >

    </div>
</div>
