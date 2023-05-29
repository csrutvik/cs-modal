
# modal-resizable

A brief description of what this project does and who it's for


## Installation

Install with npm

```bash
  npm i modal-resizable
```
    
## Usage/Examples

```javascript
import { ModalModule } from 'modal-resizable';

 imports: [
    ModalModule
  ],
```


## HTML

```javascript
<button type="button" class="btn btn-primary" (click)="modalRoot.show()">Open</button>
<app-modal #modalRoot class="modal-demo">
  <ng-container class="app-modal-header">Hi there!</ng-container>
  <ng-container class="app-modal-body">
    <h3>Profile update</h3>
    <p>Hello, World!</p>
  </ng-container>
  <ng-container class="app-modal-footer">
    <button type="button" class="btn btn-primary ms-auto" (click)="modalRoot.hide()">Close
    </button>
  </ng-container>
</app-modal>
```

## customize css
```bash
.ui-modal *,
.ui-modal :after,
.ui-modal :before {
    box-sizing: border-box
}

.ui-modal,
.ui-modal-overlay {
    z-index: 10
}

.ui-modal-overlay {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .2)
}

.ui-modal,
.ui-modal-overlay {
    display: none;
    position: fixed;
    left: 0;
    top: 0
}

.ui-modal {
    display: flex;
    flex-direction: column;
    width: 100%;
    color: black;
    pointer-events: auto;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, 0.175);
    border-radius: 0.5rem;
    outline: 0;
    min-width: 16.25rem;
    min-height: 12.5rem;
    width: 31.25rem
}

.ui-modal-header {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1rem;
    border-bottom: 1px solid #dee2e6;
    border-top-left-radius: calc(0.5rem - 1px);
    border-top-right-radius: calc(0.5rem - 1px);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.ui-modal-body {
    position: relative;
    flex: 1 1 auto;
    padding: 1rem;
    padding: 1rem;
    max-height: calc(100vh - 12.5rem);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.ui-modal-footer {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    padding: 1rem;
    background-color: #fff;
    border-top: 1px solid #dee2e6;
    border-bottom-right-radius: calc(0.5rem - 1px);
    border-bottom-left-radius: calc(0.5rem - 1px);
}

.ui-titlebar {
    flex-grow: 1;
    height: 100%;
    overflow: hidden;
    font-size: 1.125rem
}

.ui-controlbar,
.ui-titlebar {
    display: flex;
    align-items: center
}

.ui-controlbar {
    background-color: inherit
}

.dragging {
    cursor: move;
    outline: 0;
    box-shadow: 0 .25rem .5rem rgba(102, 175, 233, .6), 0 .375rem 1.25rem rgba(0, 0, 0, .2);
    -webkit-user-select: none;
    user-select: none
}

.dt-icon-maximize {
    background-color: initial;
    border: .1em solid;
    border-top: .2em solid
}

.dt-icon-maximize,
.dt-icon-normalize {
    position: relative;
    display: inline-block;
    width: 1em;
    height: 1em
}

.dt-icon-normalize {
    background-color: inherit
}

.dt-icon-normalize:after,
.dt-icon-normalize:before {
    content: \"\";
    position: absolute;
    width: .8em;
    height: .8em;
    border: .1em solid;
    background-color: inherit
}

.dt-icon-normalize:before {
    top: 0;
    right: 0
}

.dt-icon-normalize:after {
    bottom: 0;
    left: 0;
    border-top-width: .2em
}

.dt-icon-close {
    box-sizing: content-box;
    width: 1em;
    height: 1em;
    padding: 0.25em 0.25em;
    color: #000;
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxNiAxNicgZmlsbD0nIzAwMCc+PHBhdGggZD0nTS4yOTMuMjkzYTEgMSAwIDAgMSAxLjQxNCAwTDggNi41ODYgMTQuMjkzLjI5M2ExIDEgMCAxIDEgMS40MTQgMS40MTRMOS40MTQgOGw2LjI5MyA2LjI5M2ExIDEgMCAwIDEtMS40MTQgMS40MTRMOCA5LjQxNGwtNi4yOTMgNi4yOTNhMSAxIDAgMCAxLTEuNDE0LTEuNDE0TDYuNTg2IDggLjI5MyAxLjcwN2ExIDEgMCAwIDEgMC0xLjQxNHonLz48L3N2Zz4=) center/1em auto no-repeat;
    border: 0;
    border-radius: 0.375rem;
    opacity: .5;
    cursor: pointer;
}

.resize-handle-e {
    position: absolute;
    cursor: e-resize;
    height: 100%;
    width: .4375rem;
    right: -.3125rem;
    top: 0
}

.resize-handle-se {
    position: absolute;
    cursor: se-resize;
    height: 1rem;
    width: 1rem;
    right: 0;
    bottom: 0
}

.resize-handle-s {
    position: absolute;
    cursor: s-resize;
    height: .4375rem;
    width: 100%;
    bottom: -.3125rem;
    left: 0
}

.resize-handle-sw {
    position: absolute;
    cursor: sw-resize;
    height: 7px;
    width: 15px;
    height: 15px;
    bottom: 0;
    left: 0
}

.resize-handle-w {
    position: absolute;
    cursor: w-resize;
    height: 100%;
    width: 7px;
    left: -5px;
    top: 0
}

.resize-handle-nw {
    position: absolute;
    cursor: nw-resize;
    height: 7px;
    width: 15px;
    height: 15px;
    top: 0;
    left: 0
}

.resize-handle-n {
    position: absolute;
    cursor: n-resize;
    height: 7px;
    width: 95%;
    top: -5px;
    left: 0
}

.resize-handle-ne {
    position: absolute;
    cursor: ne-resize;
    height: 7px;
    width: 15px;
    height: 15px;
    top: 0;
    right: 0
}

.resizing {
    -webkit-user-select: none;
    user-select: none
}
```
    
## Properties

| Attribute | Type     |Default|
| :-------- | :------- |:------|
| `scrollTopEnable` | `boolean` |**true**|
| `maximizable` | `boolean` |**false**`|
| `backdrop` | `boolean` |**true**|
| `inViewport` | `boolean` |**false**|
| `isResizable` | `boolean` |**true**|



## Support

For support, email csrutvik@gmail.com.

