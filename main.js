export { CanvasApp, Vector2D, hue2RGBString, HSVtoRGB };
class Canvas {
    constructor() {
        let canvas = document.getElementById('canvas');
        let context = canvas.getContext('2d');
        this.canvas = canvas;
        this.context = context;
    }
    get canvas() {
        return this._canvas;
    }
    set canvas(value) {
        this._canvas = value;
    }
    get context() {
        return this._context;
    }
    set context(value) {
        this._context = value;
    }
}
class CanvasApp extends Canvas {
    constructor(fps = 60) {
        super();
        this.fps = fps;
        this.init();
        this.addListeners();
        this.resizeCanvas();
        this.animate();
    }
    init() { }
    addListeners() {
        window.addEventListener('resize', this.resizeCanvas);
    }
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    animate() {
        this.update();
        this.clearCanvas();
        this.render();
        setTimeout(() => {
            requestAnimationFrame(() => this.animate());
        }, 1000 / this.fps);
    }
    update() { }
    render() { }
}
class Vector extends Array {
    constructor(...items) {
        if (items.length === 1) {
            super(...items);
            this.fill(0);
        }
        else {
            super(...items);
        }
        this.updated = true;
    }
    static add(...vectors) {
        let maxLen = Math.max(...vectors.map((v) => v.length));
        let sum = new Vector(maxLen);
        vectors.map((v) => {
            sum.add(v);
        });
        return sum;
    }
    get size() {
        if (this.updated) {
            let sizeSquared = 0;
            this.forEach((value) => (sizeSquared += Math.pow(value, 2)));
            this._size = Math.sqrt(sizeSquared);
        }
        return this._size;
    }
    add(vector) {
        vector.forEach((value, index) => (this[index] += value));
        this.updated = true;
    }
    subtract(vector) {
        vector.forEach((value, index) => (this[index] -= value));
        this.updated = true;
    }
    scale(scaler) {
        this.forEach((_value, index) => (this[index] *= scaler));
        this.updated = true;
    }
    normalize() {
        this.scale(1 / this.size);
    }
}
class Vector2D extends Vector {
    constructor(...items) {
        super(...items);
    }
    get x() {
        return this[0];
    }
    set x(v) {
        this[0] = v;
    }
    get y() {
        return this[1];
    }
    set y(v) {
        this[1] = v;
    }
    rotate(rad) {
        let oldx = this.x;
        let oldy = this.y;
        this.x = oldx * Math.cos(rad) + oldy * Math.sin(rad);
        this.y = -oldx * Math.sin(rad) + oldy * Math.cos(rad);
    }
    rotateDeg(deg) {
        this.rotate((deg * Math.PI) / 180);
    }
}
function hue2RGBString(hue) {
    const rgb = HSVtoRGB(hue, 1, 1);
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}
function HSVtoRGB(h, s, v) {
    let r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0:
            (r = v), (g = t), (b = p);
            break;
        case 1:
            (r = q), (g = v), (b = p);
            break;
        case 2:
            (r = p), (g = v), (b = t);
            break;
        case 3:
            (r = p), (g = q), (b = v);
            break;
        case 4:
            (r = t), (g = p), (b = v);
            break;
        case 5:
            (r = v), (g = p), (b = q);
            break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
    };
}
