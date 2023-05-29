
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
