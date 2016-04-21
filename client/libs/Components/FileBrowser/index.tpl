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
                intro-outro="slide"
            >

                <span class="
                        FileBrowser--directory-name
                    "
                    on-tap="set('openDirectory', ~/openDirectory === d ? null : d)"
                >
                    {{.name}}

                    {{#if .uploadable}}
                        <span class="FileBrowser--upload-files">&#10010;</span>
                    {{/if}}

                    {{#if ~/loadingDirectory === d || (~/uploadDirectory === .name && ~/uploading.length)}}
                        <span intro-outro="fade" class="FileBrowser--loader FileBrowser--loader__directory">(Načítá se...)</span>
                    {{/if}}

                </span>

                {{#if ~/openDirectory === d}}

                    {{#if .files.length}}

                        <ul intro-outro="slide" class="FileBrowser--files">

                            {{#each .files}}
                            <li intro-outro="fade" class="FileBrowser--file FileBrowser--file__{{~/filesType}}
                                    {{#if .uploading}}FileBrowser--file__uploading{{/if}}
                                    {{#if .uploadError}}FileBrowser--file__error{{/if}}
                                "
                            >
                                {{#if deletable && !.uploading && !.uploadError}}

                                    {{#if ~/showRemoveConfirmation === .path}}
                                        <span class="FileBrowser--delete-file-confirm" on-tap="deleteFile:{{.path}}">&#10003;</span>
                                    {{/if}}

                                    <span class="FileBrowser--delete-file" on-tap="set('showRemoveConfirmation', ~/showRemoveConfirmation === .path ? null : path)">&times;</span>

                                {{/if}}

                                {{#if .uploading}}
                                    <span intro-outro="fade" class="FileBrowser--loader FileBrowser--loader__uploading">(Nahrává se...)</span>
                                {{/if}}

                                {{#if .uploading || .uploadError}}
                                    <span class="FileBrowser--overlay"></span>
                                {{/if}}

                                <div class="FileBrowser--file-wrapper">
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

        <img src="{{.preview}}" alt="" title="{{.name}}" {{#if !.uploading && !.uploadError}}on-tap="selectFile:{{.path}}"{{/if}}>

    {{/if}}

    {{#if !.uploading && !.uploadError && !.preview}}

        <img src="{{~/thumbsFullPath(.path)}}" alt="" title="{{.name}}" on-tap="selectFile:{{.path}}">

    {{/if}}

{{/partial}}
