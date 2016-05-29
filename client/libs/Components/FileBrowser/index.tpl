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

                {{#if .path === ~/searchDirPath}}

                    <div class="FileBrowser--search">

                        <span class="FileBrowser--icon FileBrowser--icon__search" on-tap="@this.set('openDirectory', ~/openDirectory === d ? null : d)">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.172 24l-7.387-7.387c-1.388.874-3.024 1.387-4.785 1.387-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9c0 1.761-.514 3.398-1.387 4.785l7.387 7.387-2.828 2.828zm-12.172-8c3.859 0 7-3.14 7-7s-3.141-7-7-7-7 3.14-7 7 3.141 7 7 7z"/></svg>
                        </span>

                        <input type="text" class="FileBrowser--search-input" name="search" value="{{~/searchText}}" placeholder="{{.name}}" on-focus-touchend="@this.set('openDirectory', d)">

                        {{#if ~/searching}}
                            <span intro-outro="fade" class="FileBrowser--loader FileBrowser--loader__searching">(Načítá se...)</span>
                        {{/if}}

                    </div>

                {{else}}

                    <span class="
                            FileBrowser--directory-name
                        "
                        on-tap="@this.set('openDirectory', ~/openDirectory === d ? null : d)"
                    >

                        <span class="FileBrowser--icon FileBrowser--icon__directory">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7.972 2h-6.972l.714 5h2.021l-.429-3h3.694c1.112 1.388 1.952 2 4.277 2h9.283l-.2 1h2.04l.6-3h-11.723c-1.978 0-2.041-.417-3.305-2zm16.028 7h-24l2 13h20l2-13z"/></svg>
                        </span>

                        <span class="FileBrowser--directory-name-text">{{.name}}</span>

                        {{#if .uploadable && ~/uploadDirectory === .name}}
                            <span class="FileBrowser--upload-files">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M24 9h-9v-9h-6v9h-9v6h9v9h6v-9h9z"/></svg>
                            </span>
                        {{/if}}

                        {{#if ~/loadingDirectory === d || (~/uploadDirectory === .name && ~/uploading.length)}}
                            <span intro-outro="fade" class="FileBrowser--loader FileBrowser--loader__directory">(Načítá se...)</span>
                        {{/if}}

                    </span>

                {{/if}}

                {{#if ~/openDirectory === d}}

                    {{#if .files.length}}

                        <ul class="FileBrowser--files
                                {{#if .path === ~/searchDirPath}}FileBrowser--files__search{{/if}}
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
                                    duration: 450
                                }"
                            >
                                {{#if deletable && !.uploading && !.uploadError}}

                                    {{#if ~/showRemoveConfirmation === .path}}
                                        <span intro-outro="fade:{duration: 100}" class="FileBrowser--delete-file-confirm" on-tap="@this.fire('deleteFile', event, .)">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>
                                        </span>
                                    {{/if}}

                                    <span class="FileBrowser--delete-file" on-tap="@this.set('showRemoveConfirmation', ~/showRemoveConfirmation === .path ? null : .path)">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <path d="M0 9h24v6h-24z"/>
                                            <path d="M0 9h24v6h-24z"/>
                                        </svg>
                                    </span>

                                {{/if}}

                                {{#if .uploading}}
                                    <span intro-outro="fade" class="FileBrowser--loader FileBrowser--loader__uploading">(Nahrává se...)</span>
                                {{/if}}

                                {{#if .uploading || .uploadError}}
                                    <span class="FileBrowser--overlay"></span>
                                {{/if}}

                                <div class="FileBrowser--file-wrapper" on-tap="@this.fire('selectFile', event, .)">
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
