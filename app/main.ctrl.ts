/// <reference path="../typings/tsd.d.ts" />
module PomPom {

  const INITIAL_R: number = 0;
  const INITIAL_G: number = 230;
  const INITIAL_B: number = 10;
  const FINAL_R: number = 190;

  class MainCtrl {

    private r: number;
    private g: number;
    private b: number;

    private interval;
    private intervalSize: number;

    private lastTick: number;
    private initialTime: number;
    private remaining: number;
    private running: boolean;

    constructor(private $interval: ng.IIntervalService) {
      this.r = 0.0;
      this.g = INITIAL_G;
      this.b = INITIAL_B;
      this.intervalSize = 25;
      this.remaining = 0;
      this.running = false;
      this.setColor(INITIAL_R, INITIAL_G, INITIAL_B);
      this.setLength(30);
    }

    start(): void {
      const self = this;
      if (!self.running) {
        self.lastTick = Date.now();
        self.interval = self.$interval(() => self.tick(), self.intervalSize);
        self.running = true;
      }
    }

    onStopClick(): void {
      const self = this;
      self.stop();
    }

    setLength(minutes: number): void {
      const self = this;
      self.initialTime = minutes * 60 * 1000;
      self.remaining = self.initialTime;
      self.updateTimeDisplay();
      self.updateColor();
    }

    private stop(): void {
      const self = this;
      if (self.running) {
        self.$interval.cancel(self.interval);
        self.running = false;
      }
    }

    private updateTimeDisplay(): void {
      const self = this;
      let min: string = Math.floor(self.remaining / 1000 / 60).toString();
      if (min === '0') {
        min = '';
      }
      let sec: string = Math.floor(self.remaining / 1000 % 60).toString();
      if (sec.length < 2) {
        sec = '0' + sec;
      }
      $('#time-display').html(`${min}:${sec}`);
    }

    private updateColor(): void {
      const self = this;
      let mult = self.remaining / self.initialTime;
      self.r = Math.min(FINAL_R - (FINAL_R * mult), FINAL_R);
      self.g = Math.max(INITIAL_G * mult, 0);
      self.setColor(Math.floor(self.r), Math.floor(self.g), self.b);
    }

    private setColor(r: number, g: number, b: number): void {
      let rgbStr = `rgb(${r}, ${g}, ${b})`;
      $('body').css('background-color', rgbStr);
    }

    private tick(): void {
      const self = this;
      self.remaining -= (Date.now() - self.lastTick);
      self.lastTick = Date.now();
      if (self.remaining < self.intervalSize) {
        self.remaining = 0;
      }
      self.updateColor();
      self.updateTimeDisplay();

      if (self.remaining <= 0) {
        self.stop();
        alert('Done!');
      }
    }
  }

  angular.module('pompom').controller('MainCtrl', [
    '$interval',
    MainCtrl]);
}
