import { AfterViewInit, Component, ElementRef, Injector, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppThemeService } from '@geor360/core';
import { ChannelMultimediaDto } from '@shared/proxies/inbox/channel.proxy';
import { DateTime } from 'luxon';
import WaveSurfer from 'wavesurfer.js';

interface WaveThemeConfiguration {
  wave: string;
  progress: string;
}

@Component({
  selector: 'inbox-chat-history-audio',
  templateUrl: 'chat-history-audio.component.html',
  styleUrls: [
    'chat-history-audio.component.scss'
  ]
})
export class ChatHistoryAudioComponent implements OnInit, AfterViewInit, OnDestroy {

  private theme: AppThemeService;

  @ViewChild('waveform', { static: false }) waveformEl!: ElementRef;

  @Input() resource!: ChannelMultimediaDto;
  @Input() createdDate!: DateTime;

  currentTime: string = '00:00';
  duration: string = '00:00';
  isPlaying: boolean = false;

  waveform!: WaveSurfer;

  constructor(_injector: Injector) {
    this.theme = _injector.get(AppThemeService);
  }

  ngOnInit(): void {
    //console.log(this.resource);
  }

  ngAfterViewInit(): void {
    this.onCreateWaves();
  }

  ngOnDestroy(): void {
    this.waveform.destroy();
  }

  get waveThemeConfiguration(): WaveThemeConfiguration {
    return this.theme.theme === 'dark'
      ? { wave: '#303030', progress: '#FFFFFF' }
      : { wave: '#E0E0E0', progress: '#000000' };
  }

  private onCreateWaves() {
    this.waveform = WaveSurfer.create({
      url: this.resource.url,
      container: this.waveformEl.nativeElement,
      waveColor: this.waveThemeConfiguration.wave,
      progressColor: this.waveThemeConfiguration.progress,
      width: 100,
      height: 30,
      barGap: 3,
      barRadius: 10,
      barWidth: 3,
      cursorColor: undefined,
      cursorWidth: 3,
      dragToSeek: true,
    });

    this.onEvents();
  }

  private onEvents() {
    this.waveform.on('ready', () => {
      const durationInSeconds = this.waveform.getDuration();
      const minutes = Math.floor(durationInSeconds / 60) % 60;
      const seconds = Math.floor(durationInSeconds % 60).toString().padStart(2, '0');

      this.duration = `${minutes}:${seconds}`;
    });

    this.waveform.on('play', () => {
      this.isPlaying = true;
    });

    this.waveform.on('pause', () => {
      this.isPlaying = false;
    });

    this.waveform.on('timeupdate', () => {
      const miliseconds = this.waveform.getCurrentTime() * 1000;
      const minutes = Math.floor(miliseconds / (1000 * 60)) % 60;
      const seconds = (Math.floor(miliseconds / 1000) % 60).toString().padStart(2, '0');

      this.currentTime = `${minutes}:${seconds}`;
    });

  }

  onToggleInteraction() {
    if (!this.waveform.isPlaying()) {
      this.waveform.play();
    } else {
      this.waveform.pause();
    }
  }
}
