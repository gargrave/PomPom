var PomPom;
(function (PomPom) {
    var INITIAL_R = 0;
    var INITIAL_G = 230;
    var INITIAL_B = 25;
    var FINAL_R = 215;
    var MainCtrl = (function () {
        function MainCtrl($interval) {
            this.$interval = $interval;
            this.r = 0.0;
            this.g = 255.0;
            this.b = 20;
            this.intervalSize = 25;
            this.running = false;
            this.setColor(INITIAL_R, INITIAL_G, INITIAL_B);
        }
        MainCtrl.prototype.start = function (minutes) {
            var self = this;
            if (!self.running) {
                self.length = minutes * 60 * 1000;
                self.r = 0.0;
                self.g = 255.0;
                self.startTime = Date.now();
                self.setColor(INITIAL_R, INITIAL_G, INITIAL_B);
                self.interval = self.$interval(function () { return self.tick(); }, self.intervalSize);
                $('#startBtn').prop('disabled', true);
                $('#stopBtn').prop('disabled', false);
                self.running = true;
            }
        };
        MainCtrl.prototype.stop = function () {
            var self = this;
            if (self.running) {
                self.$interval.cancel(self.interval);
                $('#startBtn').prop('disabled', false);
                $('#stopBtn').prop('disabled', true);
                self.running = false;
            }
        };
        MainCtrl.prototype.updateTimeDisplay = function () {
            var self = this;
            var min = Math.floor(self.remaining / 1000 / 60).toString();
            if (min.length < 2) {
                min = '0' + min;
            }
            var sec = Math.floor(self.remaining / 1000 % 60).toString();
            if (sec.length < 2) {
                sec = '0' + sec;
            }
            $('#time-display').html(min + ":" + sec);
        };
        MainCtrl.prototype.updateColor = function () {
            var self = this;
            var mult = self.remaining / self.length;
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
        };
        return MainCtrl;
    })();
    angular.module('pompom').controller('MainCtrl', [
        '$interval',
        MainCtrl]);
})(PomPom || (PomPom = {}));
