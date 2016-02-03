/// <reference path="../../typings/tsd.d.ts" />
module PomPom {

  enum SessionType { Full, Break, Snooze, Mini }

  // constant values for starting/ending color components
  const INITIAL_R: number = 0;
  const INITIAL_G: number = 230;
  const INITIAL_B: number = 10;
  const FINAL_R: number = 190;

  export class MainCtrl {
    static $inject: string[] = ['$interval'];

    // the string-based version of the current remaining time (i.e. 'MM:SS')
    timeDisplay: string;
    // the string version of the current display type
    sessionName: string;
    // the description of the curresnt session
    sessionDesc: string;

    // color components for the page's current background color
    private r: number;
    private g: number;
    private b: number;

    // variable to hold the current interval object returned from setInterval()
    private interval;
    // the length of milliseconds of the timer's interval
    private intervalSize: number;

    // the type of session we are currently running
    private currentSessType: SessionType;
    // the timestamp of the last call to the timer's tick() method
    private lastTick: number;
    // the total length of the current session
    private initialTime: number;
    // current remaining time
    private remaining: number;
    // whether the timer is currently running
    private running: boolean;
    // current number of snoozes
    private snoozes: number;

    /**
     * ctor
     */
    constructor(private $interval: ng.IIntervalService) {
      this.r = 0.0;
      this.g = INITIAL_G;
      this.b = INITIAL_B;
      this.intervalSize = 20;
      this.remaining = 0;
      this.running = false;
      this.snoozes = 0;
      this.setColor(INITIAL_R, INITIAL_G, INITIAL_B);
      this.setFullSession();
    }

    /**
     * Handler for clicking the 'start' button.
     */
    onStartClick(): void {
      this.start();
    }

    /**
     * Handler for clicking the 'stop' button.
     */
    onStopClick(): void {
      this.stop();
    }

    /**
     * Sets the current session type to 'Full' but DOES NOT start the timer.
     */
    setFullSession(): void {
      this.currentSessType = SessionType.Full;
      this.sessionName = 'Full';
      this.sessionDesc = '30-Minute Session';
      this.setLength(30);
    }

    /**
     * Sets the current session type to 'Full' and immediately starts the timer.
     */
    startFull(): void {
      this.snoozes = 0;
      this.setFullSession();
      this.start();
    }

    /**
     * Sets the current session type to 'Break' but DOES NOT start the timer.
     */
    setBreakSession(): void {
      this.currentSessType = SessionType.Break;
      this.sessionName = 'Break';
      this.sessionDesc = '5-Minute Break';
      this.setLength(5);
    }

    /**
     * Sets the current session type to 'Break' and immediately starts the timer.
     */
    startBreak(): void {
      this.snoozes = 0;
      this.setBreakSession();
      this.start();
    }

    /**
     * Sets the current session type to 'Snooze' but DOES NOT start the timer.
     */
    setSnoozeSession(): void {
      this.currentSessType = SessionType.Snooze;
      this.sessionName = 'Snooze';
      this.sessionDesc = `Snooze #${this.snoozes}`;
      this.setLength(.2);
    }

    /**
     * Sets the current session type to 'Snooze' and immediately starts the timer.
     */
    startSnooze(): void {
      this.snoozes += 1;
      this.setSnoozeSession();
      this.start();
    }

    /**
     * Sets the current session type to 'Full' but DOES NOT start the timer.
     */
    setMiniSession(): void {
      this.snoozes = 0;
      this.currentSessType = SessionType.Mini;
      this.sessionName = 'Mini';
      this.sessionDesc = 'Mini Session';
      this.setLength(.1);
    }

    /**
     * Sets the length, in minutes, of the current session. This will update the time
     * display and background color, but will not start the timer yet.
     *
     * @param  {number} minutes The number of minutes to which the timer should be set
     */
    private setLength(minutes: number): void {
      this.initialTime = minutes * 60 * 1000;
      this.remaining = this.initialTime;
      this.updateTimeDisplay();
      this.updateColor();
    }

    /**
     * Starts the current session and sets the timer running.
     */
    private start(): void {
      const _this = this;
      if (!this.running) {
        this.lastTick = Date.now();
        this.interval = _this.$interval(() => _this.tick(), _this.intervalSize);
        this.running = true;
      }
    }

    /**
     * Stops the current session and timer.
     */
    private stop(): void {
      if (this.running) {
        this.$interval.cancel(this.interval);
        this.running = false;
      }
    }

    /**
     * Updates the current time string formatted for display on the page.
     * This is formatted in 'MM:SS' format.
     */
    private updateTimeDisplay(): void {
      let min: string = Math.floor(this.remaining / 1000 / 60).toString();
      if (min === '0') {
        min = '';
      }
      let sec: string = Math.floor(this.remaining / 1000 % 60).toString();
      if (sec.length < 2) {
        sec = '0' + sec;
      }
      this.timeDisplay = `${min}:${sec}`;
    }

    /**
     *
     */
    private updateColor(): void {
      let mult = this.remaining / this.initialTime;
      this.r = Math.min(FINAL_R - (FINAL_R * mult), FINAL_R);
      this.g = Math.max(INITIAL_G * mult, 0);
      this.setColor(Math.floor(this.r), Math.floor(this.g), this.b);
    }

    /**
     * Sets the color of the page's background
     *
     * @param  {number} r - Red color component
     * @param  {number} g - Green color component
     * @param  {number} b - Blue color component
     */
    private setColor(r: number, g: number, b: number): void {
      let rgbStr = `rgb(${r}, ${g}, ${b})`;
      $('body').css('background-color', rgbStr);
    }

    /**
     * Updates the timer by counting the time since the last call. Background color
     * and time display are updated accordingly.
     */
    private tick(): void {
      this.remaining -= (Date.now() - this.lastTick);
      this.lastTick = Date.now();
      if (this.remaining < this.intervalSize) {
        this.remaining = 0;
      }
      this.updateColor();
      this.updateTimeDisplay();

      if (this.remaining <= 0) {
        this.onTimeExpired();
      }
    }

    /**
     * Handler for timer expiring. Stops the session and shows the modal
     * with options for next action.
     */
    private onTimeExpired(): void {
      this.stop();
      $('#expiredModel').modal({ show: true });
    }
  }

  angular
    .module('pompom')
    .controller('MainCtrl', MainCtrl);
}
