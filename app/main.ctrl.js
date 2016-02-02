var PomPom;
(function (PomPom) {
    var INITIAL_R = 0;
    var INITIAL_G = 230;
    var INITIAL_B = 10;
    var FINAL_R = 190;
    var MainCtrl = (function () {
        function MainCtrl($interval) {
            this.$interval = $interval;
            this.r = 0.0;
            this.g = INITIAL_G;
            this.b = INITIAL_B;
            this.intervalSize = 25;
            this.remaining = 0;
            this.running = false;
            this.setColor(INITIAL_R, INITIAL_G, INITIAL_B);
            this.setLength(30);
        }
        MainCtrl.prototype.start = function () {
            var self = this;
            if (!self.running) {
                self.lastTick = Date.now();
                self.interval = self.$interval(function () { return self.tick(); }, self.intervalSize);
                self.running = true;
            }
        };
        MainCtrl.prototype.onStopClick = function () {
            var self = this;
            self.stop();
        };
        MainCtrl.prototype.setLength = function (minutes) {
            var self = this;
            self.initialTime = minutes * 60 * 1000;
            self.remaining = self.initialTime;
            self.updateTimeDisplay();
            self.updateColor();
        };
        MainCtrl.prototype.stop = function () {
            var self = this;
            if (self.running) {
                self.$interval.cancel(self.interval);
                self.running = false;
            }
        };
        MainCtrl.prototype.updateTimeDisplay = function () {
            var self = this;
            var min = Math.floor(self.remaining / 1000 / 60).toString();
            if (min === '0') {
                min = '';
            }
            var sec = Math.floor(self.remaining / 1000 % 60).toString();
            if (sec.length < 2) {
                sec = '0' + sec;
            }
            $('#time-display').html(min + ":" + sec);
        };
        MainCtrl.prototype.updateColor = function () {
            var self = this;
            var mult = self.remaining / self.initialTime;
            self.r = Math.min(FINAL_R - (FINAL_R * mult), FINAL_R);
            self.g = Math.max(INITIAL_G * mult, 0);
            self.setColor(Math.floor(self.r), Math.floor(self.g), self.b);
        };
        MainCtrl.prototype.setColor = function (r, g, b) {
            var rgbStr = "rgb(" + r + ", " + g + ", " + b + ")";
            $('body').css('background-color', rgbStr);
        };
        MainCtrl.prototype.tick = function () {
            var self = this;
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
        };
        return MainCtrl;
    })();
    angular.module('pompom').controller('MainCtrl', [
        '$interval',
        MainCtrl]);
})(PomPom || (PomPom = {}));
