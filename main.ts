export { CanvasApp, Dictionary, Vector2D };

interface Dictionary {
  [key: string]: string;
}

class Canvas {
  private _canvas: HTMLCanvasElement;
  protected get canvas(): HTMLCanvasElement {
    return this._canvas;
  }
  protected set canvas(value: HTMLCanvasElement) {
    this._canvas = value;
  }

  private _context: CanvasRenderingContext2D;
  protected get context(): CanvasRenderingContext2D {
    return this._context;
  }
  protected set context(value: CanvasRenderingContext2D) {
    this._context = value;
  }

  constructor() {
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    let context = canvas.getContext('2d');

    this.canvas = canvas;
    this.context = context;
  }
}

class CanvasApp extends Canvas {
  protected fps: number;

  constructor(fps: number = 60) {
    super();

    this.fps = fps;

    this.init();

    this.addListeners();
    this.resizeCanvas();

    this.animate();
  }

  protected init(): void {}

  protected addListeners(): void {
    window.addEventListener('resize', this.resizeCanvas);
  }

  protected resizeCanvas(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  protected clearCanvas(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  protected animate(): void {
    this.update();
    this.clearCanvas();
    this.render();
    setTimeout(() => {
      requestAnimationFrame(() => this.animate());
    }, 1000 / this.fps);
  }

  protected update(): void {}

  protected render(): void {}
}

class Vector extends Array {
  static add(...vectors: Vector[]): Vector {
    let maxLen: number = Math.max(...vectors.map((v) => v.length));
    let sum = new Vector(maxLen);
    vectors.map((v) => {
      sum.add(v);
    });
    return sum;
  }

  private _size: number;
  private updated: boolean;

  public get size(): number {
    if (this.updated) {
      let sizeSquared = 0;
      this.forEach((value) => (sizeSquared += value ** 2));
      this._size = Math.sqrt(sizeSquared);
    }
    return this._size;
  }

  constructor(...items: number[]) {
    if (items.length === 1) {
      super(...items);
      this.fill(0);
    } else {
      super(...items);
    }

    this.updated = true;
  }

  public add(vector: Vector): void {
    vector.forEach((value, index) => (this[index] += value));
    this.updated = true;
  }

  public subtract(vector: Vector): void {
    vector.forEach((value, index) => (this[index] -= value));
    this.updated = true;
  }

  public scale(scaler: number): void {
    this.forEach((_value, index) => (this[index] *= scaler));
    this.updated = true;
  }

  public normalize(): void {
    this.scale(1 / this.size);
  }
}

class Vector2D extends Vector {
  constructor(...items: [number, number]) {
    super(...items);
  }

  public get x(): number {
    return this[0];
  }
  public set x(v: number) {
    this[0] = v;
  }

  public get y(): number {
    return this[1];
  }
  public set y(v: number) {
    this[1] = v;
  }

  rotate(rad: number) {
    let oldx = this.x;
    let oldy = this.y;

    this.x = oldx * Math.cos(rad) + oldy * Math.sin(rad);
    this.y = -oldx * Math.sin(rad) + oldy * Math.cos(rad);
  }

  rotateDeg(deg: number) {
    this.rotate((deg * Math.PI) / 180);
  }
}
