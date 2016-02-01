/// <reference path="../typings/tsd.d.ts" />
module PomPom {

  const INITIAL_R: number = 0;
  const INITIAL_G: number = 230;
  const INITIAL_B: number = 25;
  const FINAL_R: number = 215;

  class MainCtrl {

    private length: number;

    private r: number;
    private g: number;
    private b: number;
    private intervalSize: number;
    private running: boolean;

    private interval;
    private startTime: number;
    private remaining: number;

    constructor(private $interval: ng.IIntervalService) {
      this.r = 0.0;
      this.g = 255.0;
      this.b = 20;
      this.intervalSize = 25;
      this.running = false;
      this.setColor(INITIAL_R, INITIAL_G, INITIAL_B);
    }

    start(minutes: number): void {
      const self = this;

      if (!self.running) {
        self.length = minutes * 60 * 1000;
        self.r = 0.0;
        self.g = 255.0;
        self.startTime = Date.now();
        self.setColor(INITIAL_R, INITIAL_G, INITIAL_B);
        self.interval = self.$interval(() => self.tick(), self.intervalSize);
        $('#startBtn').prop('disabled', true);
        $('#stopBtn').prop('disabled', false);
        self.running = true;
      }
    }

    stop(): void {
      const self = this;

      if (self.running) {
        self.$interval.cancel(self.interval);
        $('#startBtn').prop('disabled', false);
        $('#stopBtn').prop('disabled', true);
        self.running = false;
      }
    }

    private updateTimeDisplay(): void {
      const self = this;
      let min: string = Math.floor(self.remaining / 1000 / 60).toString();
      if (min.length < 2) {
        min = '0' + min;
      }
      let sec: string = Math.floor(self.remaining / 1000 % 60).toString();
      if (sec.length < 2) {
        sec = '0' + sec;
      }
      $('#time-display').html(`${min}:${sec}`);
    }

    private updateColor(): void {
      const self = this;
      let mult = self.remaining / self.length;
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
      self.remaining = self.length - (Date.now() - self.startTime);
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
