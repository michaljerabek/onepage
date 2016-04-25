<div class="FileBrowser FileBrowser__[[.type]]">

    <div class="FileBrowser--drag-drop-overlay">
        <span class="FileBrowser--drag-drop-overlay-title">{{.uploadOverlayTitle}}</span>
        <span class="FileBrowser--drag-drop-overlay-text">{{.uploadOverlayText}}</span>
    </div>

    <div class="FileBrowser--message {{#if .showMessage}}FileBrowser--message__active{{/if}}">
        <span class="FileBrowser--message-title">{{.messageTitle}}</span>
        <span class="FileBrowser--message-text">{{.messageText}}</span>
    </div>

    {{#if !.directories.length}}

        <span intro-outro="fade" class="FileBrowser--loader FileBrowser--loader__directories">(Načítá se...)</span>

    {{/if}}

    <ul class="FileBrowser--directories">

        {{#each .directories:d}}
            <li class="
                    FileBrowser--directory
                    {{#if  ~/openDirectory === d}}FileBrowser--directory__opened{{/if}}
                "
                intro="slide"
            >

                {{#if .path === "#search"}}

                    <div class="FileBrowser--search">

                        <input type="text" name="search" value="{{~/searchText}}" placeholder="{{.name}}" on-focusin-touchend="set('openDirectory', d)">

                        {{#if ~/searching}}
                            <span intro-outro="fade" class="FileBrowser--loader FileBrowser--loader__searching">(Načítá se...)</span>
                        {{/if}}

                    </div>

                {{else}}

                    <span class="
                            FileBrowser--directory-name
                        "
                        on-tap="set('openDirectory', ~/openDirectory === d ? null : d)"
                    >
                        {{.name}}

                        {{#if .uploadable && ~/uploadDirectory === .name}}
                            <span class="FileBrowser--upload-files">&#10010;</span>
                        {{/if}}

                        {{#if ~/loadingDirectory === d || (~/uploadDirectory === .name && ~/uploading.length)}}
                            <span intro-outro="fade" class="FileBrowser--loader FileBrowser--loader__directory">(Načítá se...)</span>
                        {{/if}}

                    </span>

                {{/if}}

                {{#if ~/openDirectory === d}}

                    {{#if .files.length}}

                        <ul class="FileBrowser--files
                                {{#if .path === '#search'}}FileBrowser--files__search{{/if}}
                                {{#if .initDirContent}}FileBrowser--files__init-dir-content{{/if}}
                            "
                            intro-outro="slide"
                        >

                            {{#each .files}}

                            <li class="FileBrowser--file FileBrowser--file__{{~/filesType}}
                                    {{#if .uploading}}FileBrowser--file__uploading{{/if}}
                                    {{#if .svg}}FileBrowser--file__svg{{/if}}
                                    {{#if .uploadError}}FileBrowser--file__error{{/if}}
                                    {{#if ~/selectedPath.length && ~/selectedPath === .path}}FileBrowser--file__selected{{/if}}
                                "
                                intro-outro="attr:{
                                    duration: 600
                                }"
                            >
                                {{#if deletable && !.uploading && !.uploadError}}

                                    {{#if ~/showRemoveConfirmation === .path}}
                                        <span class="FileBrowser--delete-file-confirm" on-tap="deleteFile:{{.path}},{{.uploading}}">&#10003;</span>
                                    {{/if}}

                                    <span class="FileBrowser--delete-file" on-tap="set('showRemoveConfirmation', ~/showRemoveConfirmation === .path ? null : .path)">&times;</span>

                                {{/if}}

                                {{#if .uploading}}
                                    <span intro-outro="fade" class="FileBrowser--loader FileBrowser--loader__uploading">(Nahrává se...)</span>
                                {{/if}}

                                {{#if .uploading || .uploadError}}
                                    <span class="FileBrowser--overlay"></span>
                                {{/if}}

                                <div class="FileBrowser--file-wrapper" on-tap="selectFile:{{this}}">
                                    {{> ~/filesType + "File"}}
                                </div>
                            </li>

                            {{/each}}
                        </ul>

                    {{/if}}

                {{/if}}

            </li>
        {{/each}}

    </ul>
    <!--FileBrowser--directories-->

</div>

{{#partial imageFile}}

    {{#if .preview}}

        <img src="{{.preview}}" alt="" title="{{.name}}">

    {{/if}}

    {{#if !.uploadingId && .path}}

        <img src="{{~/thumbsFullPath(.path)}}" alt="" title="{{.name}}">

    {{/if}}

{{/partial}}

{{#partial iconFile}}

    {{#if .svg}}

        {{{.svg}}}

    {{else}}

        {{#if .preview}}

            <img src="{{.preview}}" alt="" title="{{.name}}">

        {{/if}}

        {{#if !.uploadingId && .path}}

            <img src="{{.path.match(/.svg$/) ? .path : ~/thumbsFullPath(.path)}}" alt="" title="{{.name}}">

        {{/if}}

    {{/if}}

{{/partial}}
