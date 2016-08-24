/**
 * Created by wushuyi on 2016/8/24 0024.
 */
(function (win, doc) {
    var FrameAnimation = function (img, timeline, element) {
        this.run = function () {
            for (var i = 0; i < this.runList.length; i++) {
                this.runList[i]();
            }
        };
        this.init_animate(img, timeline, element);
    };

    var p = FrameAnimation.prototype;

    p.loadImage = function (url, cb) {
        var img = new Image();
        img.onload = function () {
            cb(this)
        };
        img.src = url;
    };

    p.init_animate = function (img, timeline, element) {
        p.runList = [];
        p.loadImage(img, function (img) {
            var canvas = document.createElement('canvas');
            if (canvas && canvas.getContext) {
                p.animate(img, timeline, element)
            } else {
                p.animate_fallback(img, timeline, element)
            }
        });
    };

    p.animate = function (img, timeline, element) {
        var canvas = document.createElement('canvas');
        var start_blit = timeline[0].blit[0];
        canvas.width = start_blit[2];
        canvas.height = start_blit[3];
        element.appendChild(canvas);

        var i = 0;
        var f = function () {
            var frame = i++ % timeline.length;
            if (i == timeline.length) {
                console.log('re player!');
                i = 0;
            }
            var blits = timeline[frame].blit;

            var ctx = canvas.getContext('2d');

            for (var j = 0; j < blits.length; ++j) {
                var blit = blits[j];
                var sx = blit[0];
                var sy = blit[1];
                var w = blit[2];
                var h = blit[3];
                var dx = blit[4];
                var dy = blit[5];
                ctx.drawImage(img, sx, sy, w, h, dx, dy, w, h);
            }
        };
        p.runList.push(f);
    };

    p.animate_fallback = function (img, timeline, element) {
        var div = document.createElement('div');
        var start_blit = timeline[0].blit[0];
        div.style.width = start_blit[2] + 'px';
        div.style.height = start_blit[3] + 'px';
        div.style.position = 'relative';
        element.appendChild(div);

        var i = 0;
        var f = function () {
            var frame = i++ % timeline.length;
            if (i == timeline.length) {
                console.log('re player!');
                i = 0;
                while (element.hasChildNodes()) {
                    element.removeChild(element.lastChild);
                }
            }
            var blits = timeline[frame].blit;

            for (j = 0; j < blits.length; ++j) {
                var blit = blits[j];
                var sx = blit[0];
                var sy = blit[1];
                var w = blit[2];
                var h = blit[3];
                var dx = blit[4];
                var dy = blit[5];

                var d = document.createElement('div');
                d.style.position = 'absolute';
                d.style.left = dx + "px";
                d.style.top = dy + "px";
                d.style.width = w + "px";
                d.style.height = h + "px";
                d.style.backgroundImage = "url('" + img.src + "')";
                d.style.backgroundPosition = "-" + sx + "px -" + sy + "px";

                element.appendChild(d);
            }
        };
        p.runList.push(f);
    };
    win.FrameAnimation = FrameAnimation;
})(window, document);