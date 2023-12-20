import { Injectable } from '@angular/core';
import { AnimationController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class AnimationModalService {

    constructor(private animationCtrl: AnimationController) { }

    enterAnimation = (baseEl: HTMLElement) => {
        const root = baseEl.shadowRoot;

        const backdropAnimation = this.animationCtrl
            .create()
            .addElement(root!.querySelector('ion-backdrop')!);


        const wrapperAnimation = this.animationCtrl
            .create()
            .addElement(root!.querySelector('.modal-wrapper')!)
            .keyframes([
                { opacity: 0, transform: 'translatex(0)', offset: 1 },
                { opacity: 0, transform: 'translatex(0)', offset: 1 },
            ]);

        return this.animationCtrl
            .create()
            .addElement(baseEl)
            .easing('ease-out')
            .duration(100)
            .addAnimation([backdropAnimation, wrapperAnimation]);
    };

    outAnimation = (baseEl: HTMLElement) => {
        const root = baseEl.shadowRoot;

        const backdropAnimation = this.animationCtrl
            .create()
            .addElement(root!.querySelector('ion-backdrop')!)
            .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

        const wrapperAnimation = this.animationCtrl
            .create()
            .addElement(root!.querySelector('.modal-wrapper')!)
            .keyframes([
                { opacity: 1, transform: 'translatex(0)', offset: 0 },
                { opacity: 1, transform: 'translatex(0)', offset: 1 },
            ]);

        return this.animationCtrl
            .create()
            .addElement(baseEl)
            .easing('ease-out')
            .duration(500)
            .addAnimation([backdropAnimation, wrapperAnimation]);
    };

    openDesktopModal = (baseEl: HTMLElement) => {
        const root = baseEl.shadowRoot;

        const backdropAnimation = this.animationCtrl
            .create()
            .addElement(root!.querySelector('ion-backdrop')!)
            .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

        const wrapperAnimation = this.animationCtrl
            .create()
            .addElement(root!.querySelector('.modal-wrapper')!)
            .keyframes([
                { opacity: 0, transform: 'translatey(0)', offset: 0, scale: .85 },
                { opacity: 1, transform: 'translatey(0)', offset: 1, scale: 1 },
            ]);

        return this.animationCtrl
            .create()
            .addElement(baseEl)
            .easing('ease-out')
            .duration(200)
            .addAnimation([backdropAnimation, wrapperAnimation]);
    };

    closeDesktopModal = (baseEl: HTMLElement) => {
        const root = baseEl.shadowRoot;

        const modalAnimation = this.animationCtrl
            .create()
            .addElement(root!.querySelector('.modal-wrapper')!)
            .fromTo('opacity', '1', '0')
            .keyframes([
                { opacity: 1, transform: 'translatey(0)', offset: 0 },
                { opacity: 0, transform: 'translatey(0)', offset: 1 },
            ])
            .duration(200)
            .easing('ease-out');

        return this.animationCtrl
            .create()
            .addElement(baseEl)
            .easing('linear')
            .duration(0)
            .addAnimation(modalAnimation);
    };
}