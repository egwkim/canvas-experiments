export { Vector, CanvasApp };

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
  constructor() {
    super();

    this.addListeners();
    this.resizeCanvas();

    this.animate();
  }

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
    this.clearCanvas();
    this.render();
    requestAnimationFrame(() => this.animate());
  }

  protected render(): void {}
}

class Vector extends Array {
  private _size: number;
  private updated: boolean;

  static add(...vectors: Vector[]): Vector {
    let maxLen: number = Math.max(...vectors.map((v) => v.length));
    let sum = new Vector(maxLen);
    vectors.map((v) => {
      sum.add(v);
    });
    return sum;
  }

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
}
