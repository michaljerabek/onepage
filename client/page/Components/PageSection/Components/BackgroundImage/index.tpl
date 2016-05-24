<div class="P_BackgroundImage
        P_PageSection--background-image
        {{#if .parallax}}P_BackgroundImage__parallax{{/if}}
        {{#if .fixed}}P_BackgroundImage__fixed{{/if}}
    "
>
    <div class="P_BackgroundImage--image"
        style="
            {{#if .data.src}}background-image: url({{.data.src}}){{/if}};
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
</div>
