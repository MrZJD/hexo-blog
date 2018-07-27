var _map = function (ctx, cb) {
    return Array.prototype.map.call(ctx, (val, index) => {
        console.log(val);
    });
}

var Swiper = function (container, items) {
    this.container = document.querySelector(container);
    this.items = document.querySelectorAll(items);
    this.currIndex = 0;
    this.length = this.items.length - 1;
    this.width = this.container.clientWidth;

    this.init();
    this.listen();
}

Swiper.prototype.csslist = {
    '0': 'transform: translate3d(0px, 0px, 0px)',
    '1': 'transform: translate3d(100%, 0px, 0px)',
    '2': 'transform: translate3d(200%, 0px, 0px)',
    '3': 'transform: translate3d(300%, 0px, 0px)',
    '-1': 'transform: translate3d(-100%, 0px, 0px)',
    '-2': 'transform: translate3d(-200%, 0px, 0px)',
    '-3': 'transform: translate3d(-300%, 0px, 0px)',
}

Swiper.prototype.init = function () {
    this.items.forEach((val, ind) => {
        val.setAttribute('data-index', ind);
    });
}

Swiper.prototype.listen = function () {
    var x0 = 0;
    var y0 = 0;

    this.container.addEventListener('touchstart', (evt) => {
        x0 = evt.touches[0].pageX;
        y0 = evt.touches[0].pageY;
    });

    this.container.addEventListener('touchmove', (evt) => {
        var deltaX = evt.touches[0].pageX - x0;

        this.swipe(deltaX);
    });

    this.container.addEventListener('touchend', (evt) => {
        var deltaX = evt.changedTouches[0].pageX - x0;

        if (deltaX > 80) {
            console.log('swiper-left');
            this.swipeNext(1);
        } else if (deltaX < -80) {
            console.log('swiper-right');
            this.swipeNext(-1);
        } else {
            this.swipeNext(0);
        }
    });
}

Swiper.prototype.swipe = function (delta) {
    var baseX = this.currIndex;
    var deltaPer = delta / this.width;
    var temp;
    this.items.forEach((val, ind) => {
        temp = (this.currIndex + ind + deltaPer) * 100 ;
        val.style.transform = `translate3d(${temp}%, 0px, 0px)`;
    });
}

Swiper.prototype.swipeNext = function (step) {
    var temp = this.currIndex + step;
    if (temp >= -this.length && temp < 1) {
        this.currIndex = temp;
    }

    this.items.forEach((val, ind) => {
        val.style.transform = '';
        val.setAttribute('data-index', (this.currIndex+ind));
    });
}

new Swiper('.swiper-box', '.swiper-item');