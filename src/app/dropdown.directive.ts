import { Directive, HostListener, EventEmitter, Output } from '@angular/core';

@Directive({
    selector: '[appDropDown]'
})
export class DropDownDirective {
    @Output() dropped = new EventEmitter<FileList>();
    @Output() hoverred = new EventEmitter<boolean>();

    @HostListener('drop', ['$event'])
    onDrop(event) {
        event.preventDefault(); // prevent open new tab
        this.dropped.emit(event.dataTransfer.files);
        this.hoverred.emit(false);
    }

    @HostListener('dragover', ['$event'])
    ononDragOver(event) {
        event.preventDefault();
        this.hoverred.emit(true);
    }

    @HostListener('dragleave', ['$event'])
    ononDragLeave() {
        event.preventDefault();
        this.hoverred.emit(false);
    }
}
