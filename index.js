import * as i0 from '@angular/core';
import { EventEmitter, Directive, Input, Output, HostListener, Component, ViewEncapsulation, ViewChild, NgModule } from '@angular/core';
import * as i3 from '@angular/common';
import { CommonModule } from '@angular/common';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

function isLeftButton(event) {
    if (event.type === 'touchstart') {
        return true;
    }
    return (event.type === 'mousedown' && event.button === 0);
}
function getEvent(event) {
    if (event.type === 'touchend' || event.type === 'touchcancel') {
        return event.changedTouches[0];
    }
    return event.type.startsWith('touch') ? event.targetTouches[0] : event;
}
function maxZIndex(selectors = 'body *') {
    return Array.from(document.querySelectorAll(selectors))
        .map(a => parseFloat(window.getComputedStyle(a).zIndex))
        .filter(a => !isNaN(a))
        .sort((a, b) => a - b)
        .pop() || 0;
}
function findAncestor(el, selectors) {
    if (typeof el.closest === 'function') {
        return el.closest(selectors) || null;
    }
    while (el) {
        if (el.matches(selectors)) {
            return el;
        }
        el = el.parentElement;
    }
    return null;
}

class ResizableDirective {
    constructor(element) {
        this.resizeBegin = new EventEmitter();
        this.resizing = new EventEmitter();
        this.resizeEnd = new EventEmitter();
        this.element = element.nativeElement;

    }
    ngAfterViewInit() {
        if (this.isResizable === false) {
            // Do nothing if the element is not resizable
        } else {
            if (this.south) {
                this.createHandle('resize-handle-s');
            }
            if (this.east) {
                this.createHandle('resize-handle-e');
            }
            if (this.southEast) {
                this.createHandle('resize-handle-se');
            }
            if (this.southWest) {
                this.createHandle('resize-handle-sw');
            }
            if (this.west) {
                this.createHandle('resize-handle-w');
            }
            if (this.northWest) {
                this.createHandle('resize-handle-nw');
            }
            if (this.north) {
                this.createHandle('resize-handle-n');
            }
            if (this.northEast) {
                this.createHandle('resize-handle-ne');
            }
            const computedStyle = window.getComputedStyle(this.element);
            this.minWidth = parseFloat(computedStyle.minWidth);
            this.maxWidth = parseFloat(computedStyle.maxWidth);
            this.minHeight = parseFloat(computedStyle.minHeight);
            this.maxHeight = parseFloat(computedStyle.maxHeight);
        }


    }
    ngOnDestroy() {
        this.destroySubscription();
    }
    onMousedown(event) {
        if (!isLeftButton(event)) {
            return;
        }
        const classList = (event.target).classList;
        const isSouth = classList.contains('resize-handle-s');
        const isEast = classList.contains('resize-handle-e');
        const isSouthEast = classList.contains('resize-handle-se');
        const isSouthWest = classList.contains('resize-handle-sw');
        const isWest = classList.contains('resize-handle-w');
        const isNorthWest = classList.contains('resize-handle-nw');
        const isNorth = classList.contains('resize-handle-n');
        const isNorthEast = classList.contains('resize-handle-ne');
        const evt = getEvent(event);
        const width = this.element.clientWidth;
        const height = this.element.clientHeight;
        const left = this.element.offsetLeft;
        const top = this.element.offsetTop;
        const screenX = evt.screenX;
        const screenY = evt.screenY;
        const isTouchEvent = event.type.startsWith('touch');
        const moveEvent = isTouchEvent ? 'touchmove' : 'mousemove';
        const upEvent = isTouchEvent ? 'touchend' : 'mouseup';
        if (isSouth || isEast || isSouthEast || isSouthWest || isWest || isNorthWest || isNorth || isNorthEast) {
            this.initResize(event, isSouth, isEast, isSouthEast, isSouthWest, isWest, isNorthWest, isNorth, isNorthEast);
            const mouseup = fromEvent(document, upEvent);
            this.subscription = mouseup
                .subscribe((ev) => this.onMouseup(ev));
            const mouseMoveSub = fromEvent(document, moveEvent)
                .pipe(takeUntil(mouseup))
                .subscribe((e) => this.move(e, width, height, top, left, screenX, screenY));
            this.subscription.add(mouseMoveSub);
        }
    }
    move(event, width, height, top, left, screenX, screenY) {
        const evt = getEvent(event);
        const movementX = evt.screenX - screenX;
        const movementY = evt.screenY - screenY;
        this.newWidth = width - (this.resizingSW || this.resizingW || this.resizingNW ? movementX : -movementX);
        this.newHeight = height - (this.resizingNW || this.resizingN || this.resizingNE ? movementY : -movementY);
        this.newLeft = left + movementX;
        this.newTop = top + movementY;
        if (this.isResizable === false) {
            // Do nothing if the element is not resizable
        }
        else {
            this.resizeWidth(evt);
            this.resizeHeight(evt);
        }

    }
    onMouseup(event) {
        this.endResize(event);
        this.destroySubscription();
    }
    destroySubscription() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = undefined;
        }
    }
    createHandle(edgeClass) {
        const node = document.createElement('span');
        node.className = edgeClass;
        this.element.appendChild(node);
    }
    initResize(event, isSouth, isEast, isSouthEast, isSouthWest, isWest, isNorthWest, isNorth, isNorthEast) {
        if (isSouth) {
            this.resizingS = true;
        }
        if (isEast) {
            this.resizingE = true;
        }
        if (isSouthEast) {
            this.resizingSE = true;
        }
        if (isSouthWest) {
            this.resizingSW = true;
        }
        if (isWest) {
            this.resizingW = true;
        }
        if (isNorthWest) {
            this.resizingNW = true;
        }
        if (isNorth) {
            this.resizingN = true;
        }
        if (isNorthEast) {
            this.resizingNE = true;
        }
        this.element.classList.add('resizing');
        this.newWidth = this.element.clientWidth;
        this.newHeight = this.element.clientHeight;
        this.newLeft = this.element.offsetLeft;
        this.newTop = this.element.offsetTop;
        event.stopPropagation();
        this.resizeBegin.emit();
    }
    endResize(event) {
        this.resizingS = false;
        this.resizingE = false;
        this.resizingSE = false;
        this.resizingSW = false;
        this.resizingW = false;
        this.resizingNW = false;
        this.resizingN = false;
        this.resizingNE = false;
        this.element.classList.remove('resizing');
        this.resizeEnd.emit({ event: getEvent(event), width: this.newWidth, height: this.newHeight });
    }
    resizeWidth(event) {
        const overMinWidth = !this.minWidth || this.newWidth >= this.minWidth;
        const underMaxWidth = !this.maxWidth || this.newWidth <= this.maxWidth;
        if (this.resizingSE || this.resizingE || this.resizingNE) {
            if (overMinWidth && underMaxWidth) {
                if (!this.ghost) {
                    this.element.style.width = `${this.newWidth}px`;
                }
            }
        }
        if (this.resizingSW || this.resizingW || this.resizingNW) {
            if (overMinWidth && underMaxWidth) {
                this.element.style.left = `${this.newLeft}px`;
                this.element.style.width = `${this.newWidth}px`;
            }
        }
        this.resizing.emit({ event, width: this.newWidth, height: this.newHeight, direction: 'horizontal' });
    }
    resizeHeight(event) {
        const overMinHeight = !this.minHeight || this.newHeight >= this.minHeight;
        const underMaxHeight = !this.maxHeight || this.newHeight <= this.maxHeight;
        if (this.resizingSE || this.resizingS || this.resizingSW) {
            if (overMinHeight && underMaxHeight) {
                if (!this.ghost) {
                    this.element.style.height = `${this.newHeight}px`;
                }
            }
        }
        if (this.resizingNW || this.resizingN || this.resizingNE) {
            if (overMinHeight && underMaxHeight) {
                if (!this.ghost) {
                    this.element.style.top = `${this.newTop}px`;
                    this.element.style.height = `${this.newHeight}px`;
                }
            }
        }
        this.resizing.emit({ event, width: this.newWidth, height: this.newHeight, direction: 'vertical' });
    }
}
ResizableDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: ResizableDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
ResizableDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "12.0.0", type: ResizableDirective, selector: "[appResizable]", inputs: { south: "south", east: "east", southEast: "southEast", ghost: "ghost", southWest: "southWest", west: "west", northWest: "northWest", north: "north", northEast: "northEast", isResizable: "isResizable" }, outputs: { resizeBegin: "resizeBegin", resizing: "resizing", resizeEnd: "resizeEnd" }, host: { listeners: { "mousedown": "onMousedown($event)", "touchstart": "onMousedown($event)" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({
    minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: ResizableDirective, decorators: [{
        type: Directive,
        args: [{
            selector: '[appResizable]'
        }]
    }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: {
        south: [{
            type: Input
        }], east: [{
            type: Input
        }], southEast: [{
            type: Input
        }], ghost: [{
            type: Input
        }], southWest: [{
            type: Input
        }], west: [{
            type: Input
        }], northWest: [{
            type: Input
        }], north: [{
            type: Input
        }], northEast: [{
            type: Input
        }], isResizable: [{
            type: Input
        }], resizeBegin: [{
            type: Output
        }], resizing: [{
            type: Output
        }], resizeEnd: [{
            type: Output
        }], onMousedown: [{
            type: HostListener,
            args: ['mousedown', ['$event']]
        }, {
            type: HostListener,
            args: ['touchstart', ['$event']]
        }]
    }
});

class DraggableDirective {
    constructor(element, ngZone) {
        this.element = element;
        this.ngZone = ngZone;
        this.dragX = true;
        this.dragY = true;
        this.dragStart = new EventEmitter();
        this.dragMove = new EventEmitter();
        this.dragEnd = new EventEmitter();
        this.globalListeners = new Map();
    }
    ngOnChanges(changes) {
        if (changes.dragEventTarget && changes.dragEventTarget.currentValue) {
            this.onMousedown(this.dragEventTarget);
        }
    }
    ngOnDestroy() {
        this.removeEventListener();
    }
    onMousedown(event) {
        if (!isLeftButton(event)) {
            return;
        }
        if (this.dragX || this.dragY) {
            const evt = getEvent(event);
            this.initDrag(evt.pageX, evt.pageY);
            this.addEventListeners(event);
            this.dragStart.emit(event);
        }
    }
    onMousemove(event) {
        const evt = getEvent(event);
        this.onDrag(evt.pageX, evt.pageY);
        this.dragMove.emit(event);
    }
    onMouseup(event) {
        this.endDrag();
        this.removeEventListener();
        this.dragEnd.emit(event);
    }
    addEventListeners(event) {
        const isTouchEvent = event.type.startsWith('touch');
        const moveEvent = isTouchEvent ? 'touchmove' : 'mousemove';
        const upEvent = isTouchEvent ? 'touchend' : 'mouseup';
        this.globalListeners
            .set(moveEvent, {
                handler: this.onMousemove.bind(this),
                options: false
            })
            .set(upEvent, {
                handler: this.onMouseup.bind(this),
                options: false
            });
        this.ngZone.runOutsideAngular(() => {
            this.globalListeners.forEach((config, name) => {
                window.document.addEventListener(name, config.handler, config.options);
            });
        });
    }
    removeEventListener() {
        this.globalListeners.forEach((config, name) => {
            window.document.removeEventListener(name, config.handler, config.options);
        });
    }
    initDrag(pageX, pageY) {
        this.isDragging = true;
        this.lastPageX = pageX;
        this.lastPageY = pageY;
        this.element.nativeElement.classList.add('dragging');
        this.elementWidth = this.element.nativeElement.offsetWidth;
        this.elementHeight = this.element.nativeElement.offsetHeight;
        this.vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        this.vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    }
    onDrag(pageX, pageY) {
        if (this.isDragging) {
            const deltaX = pageX - this.lastPageX;
            const deltaY = pageY - this.lastPageY;
            const coords = this.element.nativeElement.getBoundingClientRect();
            let leftPos = coords.left + deltaX;
            let topPos = coords.top + deltaY;
            const overWidth = !this.inViewport || leftPos >= 0 && (leftPos + this.elementWidth) <= this.vw;
            const overHeight = !this.inViewport || topPos >= 0 && (topPos + this.elementHeight) <= this.vh;
            if (overWidth) {
                this.lastPageX = pageX;
            }
            if (overHeight) {
                this.lastPageY = pageY;
            }
            if (this.inViewport) {
                if (leftPos < 0) {
                    leftPos = 0;
                }
                if ((leftPos + this.elementWidth) > this.vw) {
                    leftPos = this.vw - this.elementWidth;
                }
                if (topPos < 0) {
                    topPos = 0;
                }
                if ((topPos + this.elementHeight) > this.vh) {
                    topPos = this.vh - this.elementHeight;
                }
            }
            this.element.nativeElement.style.left = leftPos + 'px';
            this.element.nativeElement.style.top = topPos + 'px';
        }
    }
    endDrag() {
        this.isDragging = false;
        this.element.nativeElement.classList.remove('dragging');
    }
}
DraggableDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: DraggableDirective, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
DraggableDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "12.0.0", type: DraggableDirective, selector: "[appDraggable]", inputs: { dragEventTarget: "dragEventTarget", dragX: "dragX", dragY: "dragY", inViewport: "inViewport" }, outputs: { dragStart: "dragStart", dragMove: "dragMove", dragEnd: "dragEnd" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({
    minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: DraggableDirective, decorators: [{
        type: Directive,
        args: [{
            selector: '[appDraggable]'
        }]
    }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: {
        dragEventTarget: [{
            type: Input
        }], dragX: [{
            type: Input
        }], dragY: [{
            type: Input
        }], inViewport: [{
            type: Input
        }], dragStart: [{
            type: Output
        }], dragMove: [{
            type: Output
        }], dragEnd: [{
            type: Output
        }]
    }
});

class ModalComponent {
    constructor(element) {
        this.element = element;
        this.scrollTopEnable = true;
        this.backdrop = true;
        this.closeModal = new EventEmitter();
    }
    ngAfterViewChecked() {
        if (this.executePostDisplayActions) {
            this.center();
            this.executePostDisplayActions = false;
        }
    }
    onKeyDown(event) {
        event.preventDefault();
        event.stopPropagation();
        this.hide();
    }
    onWindowResize() {
        this.executePostDisplayActions = true;
        this.center();
    }
    show() {
        this.executePostDisplayActions = true;
        this.visible = true;
        setTimeout(() => {
            this.modalRoot.nativeElement.focus();
            if (this.scrollTopEnable) {
                this.modalBody.nativeElement.scrollTop = 0;
            }
        }, 1);
    }
    hide() {
        this.visible = false;
        this.closeModal.emit(true);
        this.focusLastModal();
    }
    center() {
        let elementWidth = this.modalRoot.nativeElement.offsetWidth;
        let elementHeight = this.modalRoot.nativeElement.offsetHeight;
        if (elementWidth === 0 && elementHeight === 0) {
            this.modalRoot.nativeElement.style.visibility = 'hidden';
            this.modalRoot.nativeElement.style.display = 'block';
            elementWidth = this.modalRoot.nativeElement.offsetWidth;
            elementHeight = this.modalRoot.nativeElement.offsetHeight;
            this.modalRoot.nativeElement.style.display = 'none';
            this.modalRoot.nativeElement.style.visibility = 'visible';
        }
        const x = Math.max((window.innerWidth - elementWidth) / 2, 0);
        const y = Math.max((window.innerHeight - elementHeight) / 2, 0);
        this.modalRoot.nativeElement.style.left = x + 'px';
        this.modalRoot.nativeElement.style.top = y + 'px';
    }
    initDrag(event) {
        if (event.target === this.closeIcon.nativeElement) {
            return;
        }
        if (!this.maximized) {
            this.dragEventTarget = event;
        }
    }
    onResize(event) {
        if (event.direction === 'vertical') {
            this.calcBodyHeight();
        }
    }
    calcBodyHeight() {
        const diffHeight = this.modalHeader.nativeElement.offsetHeight + this.modalFooter.nativeElement.offsetHeight;
        const contentHeight = this.modalRoot.nativeElement.offsetHeight - diffHeight;
        this.modalBody.nativeElement.style.height = contentHeight + 'px';
        this.modalBody.nativeElement.style.maxHeight = 'none';
    }
    getMaxModalIndex() {
        return maxZIndex('.ui-modal');
    }
    focusLastModal() {
        const modal = findAncestor(this.element.nativeElement.parentElement, '.ui-modal');
        if (modal) {
            modal.focus();
        }
    }
    toggleMaximize(event) {
        if (this.maximized) {
            this.revertMaximize();
        }
        else {
            this.maximize();
        }
        event.preventDefault();
    }
    maximize() {
        this.preMaximizePageX = parseFloat(this.modalRoot.nativeElement.style.top);
        this.preMaximizePageY = parseFloat(this.modalRoot.nativeElement.style.left);
        this.preMaximizeRootWidth = this.modalRoot.nativeElement.offsetWidth;
        this.preMaximizeRootHeight = this.modalRoot.nativeElement.offsetHeight;
        this.preMaximizeBodyHeight = this.modalBody.nativeElement.offsetHeight;
        this.modalRoot.nativeElement.style.top = '0px';
        this.modalRoot.nativeElement.style.left = '0px';
        this.modalRoot.nativeElement.style.width = '100vw';
        this.modalRoot.nativeElement.style.height = '100vh';
        const diffHeight = this.modalHeader.nativeElement.offsetHeight + this.modalFooter.nativeElement.offsetHeight;
        this.modalBody.nativeElement.style.height = 'calc(100vh - ' + diffHeight + 'px)';
        this.modalBody.nativeElement.style.maxHeight = 'none';
        this.maximized = true;
    }
    revertMaximize() {
        this.modalRoot.nativeElement.style.top = this.preMaximizePageX + 'px';
        this.modalRoot.nativeElement.style.left = this.preMaximizePageY + 'px';
        this.modalRoot.nativeElement.style.width = this.preMaximizeRootWidth + 'px';
        this.modalRoot.nativeElement.style.height = this.preMaximizeRootHeight + 'px';
        this.modalBody.nativeElement.style.height = this.preMaximizeBodyHeight + 'px';
        this.maximized = false;
    }
    moveOnTop() {
        if (!this.backdrop) {
            const maxModalIndex = this.getMaxModalIndex();
            let zIndex = parseFloat(window.getComputedStyle(this.modalRoot.nativeElement).zIndex) || 0;
            if (zIndex <= maxModalIndex) {
                zIndex = maxModalIndex + 1;
                this.modalRoot.nativeElement.style.zIndex = zIndex.toString();
            }
        }
    }
}
ModalComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: ModalComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
ModalComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.0.0", type: ModalComponent, selector: "app-modal", inputs: { scrollTopEnable: "scrollTopEnable", maximizable: "maximizable", backdrop: "backdrop", inViewport: "inViewport", isResizable: "isResizable" }, outputs: { closeModal: "closeModal" }, host: { listeners: { "keydown.esc": "onKeyDown($event)", "window:resize": "onWindowResize()" } }, viewQueries: [{ propertyName: "modalRoot", first: true, predicate: ["modalRoot"], descendants: true }, { propertyName: "modalBody", first: true, predicate: ["modalBody"], descendants: true }, { propertyName: "modalHeader", first: true, predicate: ["modalHeader"], descendants: true }, { propertyName: "modalFooter", first: true, predicate: ["modalFooter"], descendants: true }, { propertyName: "closeIcon", first: true, predicate: ["closeIcon"], descendants: true }], ngImport: i0, template: "<div class=\"ui-modal-overlay\" [style.display]=\"(visible && backdrop) ? 'block' : 'none'\"></div>\r\n\r\n<div class=\"ui-modal\" tabindex=\"-1\" role=\"dialog\"\r\n     #modalRoot\r\n     appResizable\r\n     [south]=\"true\"\r\n     [east]=\"true\"\r\n     [southEast]=\"true\"\r\n     [southWest]=\"true\"\r\n     [west]=\"true\"\r\n     [northWest]=\"true\"\r\n     [north]=\"true\"\r\n     [northEast]=\"true\"\r\n     (resizing)=\"onResize($event)\"\r\n     appDraggable\r\n     [dragEventTarget]=\"dragEventTarget\"\r\n     [inViewport]=\"inViewport\"\r\n    [isResizable]=\"isResizable\"\r\n    [style.display]=\"visible ? 'block' : 'none'\"\r\n     (mousedown)=\"moveOnTop()\"\r\n     (touchstart)=\"moveOnTop()\">\r\n    <div class=\"ui-modal-header\" #modalHeader\r\n         (mousedown)=\"initDrag($event)\"\r\n         (touchstart)=\"initDrag($event)\">\r\n      <div class=\"ui-titlebar\">\r\n          <ng-content select=\".app-modal-header\"></ng-content>\r\n      </div>\r\n      <div class=\"ui-controlbar\">\r\n          <i class=\"ui-icon\"\r\n             *ngIf=\"maximizable\"\r\n             (click)=\"toggleMaximize($event)\"\r\n             [ngClass]=\"{'dt-icon-maximize': !maximized, 'dt-icon-normalize': maximized}\">\r\n          </i>\r\n          <i class=\"ui-icon dt-icon-close\" #closeIcon (click)=\"hide()\">\r\n          </i>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"ui-modal-body\" #modalBody>\r\n      <ng-content select=\".app-modal-body\"></ng-content>\r\n    </div>\r\n    <div class=\"ui-modal-footer\" #modalFooter>\r\n      <ng-content select=\".app-modal-footer\"></ng-content>\r\n    </div>\r\n</div>\r\n", styles: [".ui-modal *,.ui-modal :after,.ui-modal :before{box-sizing:border-box}.ui-modal,.ui-modal-overlay{z-index:10}.ui-modal-overlay{width:100%;height:100%;background-color:rgba(0,0,0,.2)}.ui-modal,.ui-modal-overlay{display:none;position:fixed;left:0;top:0}.ui-modal{outline:none;background-color:#fff;padding:0;box-shadow:0 .25rem .5rem 0 rgba(0,0,0,.2),0 .375rem 1.25rem 0 rgba(0,0,0,.19);min-width:16.25rem;min-height:12.5rem;width:31.25rem}.ui-modal-header{position:relative;padding:.5rem 1rem;background-color:var(--dt-color-primary,#5b9bd5);color:#fff;-webkit-user-select:none;user-select:none;display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center}.ui-modal-body{position:relative;padding:.625rem 1rem;max-height:calc(100vh - 12.5rem);overflow-y:auto;-webkit-overflow-scrolling:touch}.ui-modal-footer{padding:1rem}.ui-titlebar{flex-grow:1;height:100%;overflow:hidden;font-size:1.125rem}.ui-controlbar,.ui-titlebar{display:flex;align-items:center}.ui-controlbar{background-color:inherit}.ui-icon{cursor:pointer;margin-left:.3em;font-size:1.4rem}.ui-icon:hover{opacity:.75}.dragging{cursor:move;outline:0;box-shadow:0 .25rem .5rem rgba(102,175,233,.6),0 .375rem 1.25rem rgba(0,0,0,.2);-webkit-user-select:none;user-select:none}.dt-icon-maximize{background-color:initial;border:.1em solid;border-top:.2em solid}.dt-icon-maximize,.dt-icon-normalize{position:relative;display:inline-block;width:1em;height:1em}.dt-icon-normalize{background-color:inherit}.dt-icon-normalize:after,.dt-icon-normalize:before{content:\"\";position:absolute;width:.8em;height:.8em;border:.1em solid;background-color:inherit}.dt-icon-normalize:before{top:0;right:0}.dt-icon-normalize:after{bottom:0;left:0;border-top-width:.2em}.dt-icon-close{position:relative;display:inline-block;width:1em;height:1em;background-color:initial}.dt-icon-close:after,.dt-icon-close:before{content:\"\";position:absolute;width:1.2em;height:.18em;top:50%;left:50%;background-color:currentColor}.dt-icon-close:before{transform:translate(-50%,-50%) rotate(-225deg)}.dt-icon-close:after{transform:translate(-50%,-50%) rotate(225deg)}.resize-handle-e{position:absolute;cursor:e-resize;height:100%;width:.4375rem;right:-.3125rem;top:0}.resize-handle-se{position:absolute;cursor:se-resize;height:1rem;width:1rem;right:0;bottom:0}.resize-handle-s{position:absolute;cursor:s-resize;height:.4375rem;width:100%;bottom:-.3125rem;left:0}.resize-handle-sw{position:absolute;cursor:sw-resize;height:7px;width:15px;height:15px;bottom:0;left:0}.resize-handle-w{position:absolute;cursor:w-resize;height:100%;width:7px;left:-5px;top:0}.resize-handle-nw{position:absolute;cursor:nw-resize;height:7px;width:15px;height:15px;top:0;left:0}.resize-handle-n{position:absolute;cursor:n-resize;height:7px;width:95%;top:-5px;left:0}.resize-handle-ne{position:absolute;cursor:ne-resize;height:7px;width:15px;height:15px;top:0;right:0}.resizing{-webkit-user-select:none;user-select:none}"], directives: [{ type: ResizableDirective, selector: "[appResizable]", inputs: ["south", "east", "southEast", "ghost", "southWest", "west", "northWest", "north", "northEast"], outputs: ["resizeBegin", "resizing", "resizeEnd"] }, { type: DraggableDirective, selector: "[appDraggable]", inputs: ["dragEventTarget", "dragX", "dragY", "inViewport", "isResizable"], outputs: ["dragStart", "dragMove", "dragEnd"] }, { type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({
    minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: ModalComponent, decorators: [{
        type: Component,
        args: [{
            selector: 'app-modal',
            templateUrl: 'modal.component.html',
            styleUrls: ['modal.component.css'],
            encapsulation: ViewEncapsulation.None,
        }]
    }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: {
        scrollTopEnable: [{
            type: Input
        }], maximizable: [{
            type: Input
        }], backdrop: [{
            type: Input
        }], inViewport: [{
            type: Input
        }], isResizable: [{
            type: Input
        }], closeModal: [{
            type: Output
        }], modalRoot: [{
            type: ViewChild,
            args: ['modalRoot', { static: false }]
        }], modalBody: [{
            type: ViewChild,
            args: ['modalBody', { static: false }]
        }], modalHeader: [{
            type: ViewChild,
            args: ['modalHeader', { static: false }]
        }], modalFooter: [{
            type: ViewChild,
            args: ['modalFooter', { static: false }]
        }], closeIcon: [{
            type: ViewChild,
            args: ['closeIcon', { static: false }]
        }], onKeyDown: [{
            type: HostListener,
            args: ['keydown.esc', ['$event']]
        }], onWindowResize: [{
            type: HostListener,
            args: ['window:resize']
        }]
    }
});

class ResizableModule {
}
ResizableModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: ResizableModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ResizableModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: ResizableModule, declarations: [ResizableDirective], exports: [ResizableDirective] });
ResizableModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: ResizableModule });
i0.ɵɵngDeclareClassMetadata({
    minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: ResizableModule, decorators: [{
        type: NgModule,
        args: [{
            declarations: [
                ResizableDirective,
            ],
            exports: [
                ResizableDirective,
            ]
        }]
    }]
});

class DraggableModule {
}
DraggableModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: DraggableModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
DraggableModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: DraggableModule, declarations: [DraggableDirective], exports: [DraggableDirective] });
DraggableModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: DraggableModule });
i0.ɵɵngDeclareClassMetadata({
    minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: DraggableModule, decorators: [{
        type: NgModule,
        args: [{
            declarations: [
                DraggableDirective,
            ],
            exports: [
                DraggableDirective,
            ]
        }]
    }]
});

class ModalModule {
}
ModalModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: ModalModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ModalModule.ɵmod = i0.ɵɵngDeclareNgModule({
    minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: ModalModule, declarations: [ModalComponent], imports: [CommonModule,
        ResizableModule,
        DraggableModule], exports: [ModalComponent]
});
ModalModule.ɵinj = i0.ɵɵngDeclareInjector({
    minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: ModalModule, imports: [[
        CommonModule,
        ResizableModule,
        DraggableModule,
    ]]
});
i0.ɵɵngDeclareClassMetadata({
    minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: ModalModule, decorators: [{
        type: NgModule,
        args: [{
            imports: [
                CommonModule,
                ResizableModule,
                DraggableModule,
            ],
            declarations: [
                ModalComponent,
            ],
            exports: [
                ModalComponent,
            ]
        }]
    }]
});

/**
 * Generated bundle index. Do not edit.
 */

export { ModalComponent, ModalModule };
//# sourceMappingURL=ng-modal-lib.js.map
