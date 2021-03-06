/*! timer.jquery 0.1.0 2014-01-11*/
(function(s) {
    var t = function(t, i) {
        var h = {
            action: "start"
        };
        this.options =
            s.extend(h, i),
            this.$el = s(t),
            this.secsNum = 0,
            this.minsNum = 0,
            this.hrsNum = 0,
            this.secsStr = "00",
            this.minsStr = "00",
            this.hrsStr = "00",
            this.timerId = null,
            this.delay = 1e3,
            this.isTimerRunning = !1,
            void 0 !== this.options.seconds && (this.hrsNum = Math.floor(this.options.seconds / 3600),
            this.minsNum = Math.floor((this.options.seconds - 3600 * this.hrsNum) / 60),
            this.secsNum = this.options.seconds - 3600 * this.hrsNum - 60 * this.minsNum,
            this.timeToString())
    };
    t.prototype.init = function() {
        switch (this.options.action) {
            case "start":
                this.isTimerRunning || this.startTimer();
                break;
            case "pause":
                this.pauseTimer();
                break;
            case "resume":
                this.isTimerRunning || this.startTimerInterval();
                break;
            case "reset":
                this.secsNum = 0, this.minsNum = 0, this.hrsNum = 0;
                break;
            case "get_seconds":
                return 3600 * this.hrsNum + 60 * this.minsNum + this.secsNum - 1
        }
    },
        t.prototype.pauseTimer = function() {
            clearInterval(this.timerId), this.isTimerRunning = !1
        },
        t.prototype.startTimer = function() {
            this.updateTimerDisplay(), this.incrementTime(), this.startTimerInterval()
        },
        t.prototype.startTimerInterval = function() {
            var s = this;
            this.timerId = setInterval(function() {
                s.incrementTime()
            }, this.delay), this.isTimerRunning = !0
        },
        t.prototype.updateTimerDisplay = function() {
            this.hrsNum > 0 && (this.options.showHours = !0), this.options.showHours ? this.$el.html(this.hrsStr + ":" + this.minsStr + ":" + this.secsStr) : this.$el.html(this.hrsStr + ":" + this.minsStr + ":" + this.secsStr)
        },
        t.prototype.timeToString = function() {
            this.secsStr = 10 > this.secsNum ? "0" + this.secsNum : this.secsNum, this.minsStr = 10 > this.minsNum ? "0" + this.minsNum : this.minsNum, this.hrsStr = 10 > this.hrsNum ? "0" + this.hrsNum : this.hrsNum
        },
        t.prototype.incrementTime = function() {
            this.timeToString(), this.updateTimerDisplay(), this.secsNum++, 0 == this.secsNum % 60 && (this.minsNum++, this.secsNum = 0), this.minsNum > 59 && 0 == this.minsNum % 60 && (this.hrsNum++, this.minsNum = 0)
        };
    var i = "timer";
    s.fn[i] = function(s) {
        "string" == typeof s && (s = {
            action: s
        }), this.data("plugin_" + i) instanceof t || this.data("plugin_" + i, new t(this, s));
        var h = this.data("plugin_" + i);
        return h.options.action = s.action, h.init(), this
    }
})(jQuery);