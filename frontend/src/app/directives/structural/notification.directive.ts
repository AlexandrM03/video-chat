import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appNotification]',
    standalone: true
})
export class NotificationDirective {
    private hasView = false;

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
    ) { }

    @Input() set appNotification(condition: boolean) {
        if (condition && !this.hasView) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.hasView = true;
            setTimeout(() => {
                this.viewContainer.clear();
                this.hasView = false;
            }, 5000);
        }
    }
}
