import { animate } from '@angular/animations';
import { AfterViewInit, Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { AppThemeService } from '@geor360/core';

@Component({
    selector: 'inbox-chat-input-wave',
    templateUrl: 'chat-input-wave.component.html',
    styleUrls: [
        'chat-input-wave.component.scss'
    ]
})
export class InboxChatInputWaveComponent implements OnInit, AfterViewInit, OnDestroy {

    private theme: AppThemeService;

    private _fps: number = 0;
    private _width: number = 100;

    @Input() get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
        this.length = value / 4;
    }

    @Input() get fps(): number {
        return this._fps;
    }

    set fps(value: number) {
        this._fps = value;
        this.frameInterval = 1000 / this.fps;
    }

    @Input() height: number = 30;
    @Input() data: number[] = [];
    @Input() recording: boolean = false;
    @Input() paused: boolean = false;

    private destroyed: boolean = false;
    private canvas!: globalThis.HTMLCanvasElement;
    private ctx!: CanvasRenderingContext2D;
    private animationId!: number;
    private length: number = this._width / 4;
    private frameInterval: number = 1000 / this.fps;
    private interval!: NodeJS.Timeout;
    private color!: 'dark' | 'light';

    constructor(injector: Injector) {
        this.theme = injector.get(AppThemeService);
        this.color = this.theme.theme == 'dark' ? 'dark' : 'light';
    }

    ngOnInit(): void {
        this.canvas = document.getElementById('chat-input-wave')! as globalThis.HTMLCanvasElement;
        this.canvas.style.width = '100%';
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    ngAfterViewInit(): void {
        this.interval = setInterval(() => this.animate(), this.frameInterval);
    }

    ngOnDestroy(): void {
        this.destroyed = true;
        clearInterval(this.interval);
        cancelAnimationFrame(this.animationId);
    }

    animate(): void {
        this.width = document.getElementById('chat-input__wave')!.getBoundingClientRect().width;

        if (this.width === 0)
            return;
        if (this.destroyed || this.paused || !this.recording)
            return;

        if (this.data.length > this.length)
            this.data.splice(0, this.data.length - this.length);

        this.drawWave();

        cancelAnimationFrame(this.animationId);
        this.animationId = requestAnimationFrame(animate);
    }

    drawWave(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;

        const range: number = (this.canvas.height / 2);
        const max: number = this.canvas.height;
        const fill: string = this.color == 'dark' ? '#ffffff' : '#222428';

        for (let i = 0; i < this.data.length; i++) {
            const x = i * 4;
            let height: number = this.data[i];

            if (height <= 2)
                height = 2;
            if (height >= max)
                height = max - 1;

            let y = Math.trunc(range - (height / 2));

            this.ctx.fillStyle = fill;
            this.ctx.fillRect(this.width - x, y, 2, height);
        }

        this.ctx.stroke();
    }
}