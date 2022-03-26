import { hue2RGBString } from './main.js';

class SquareDrawingApp {
  private static squareCreationInterval = 100;
  private static colorUpdateStep = 0.005;

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private mouseDown: boolean;

  private prevSquareTimestamp: number;

  private squares: Square[];

  private color: number;

  constructor() {
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    let context = canvas.getContext('2d');

    this.canvas = canvas;
    this.context = context;

    this.mouseDown = false;

    this.prevSquareTimestamp = 0;

    this.squares = [];

    this.color = 0;

    this.addListeners();
    this.resizeCanvas();

    this.Render();
  }

  private addListeners() {
    let canvas = this.canvas;
    window.addEventListener('resize', this.resizeCanvas);

    canvas.addEventListener('mousedown', (e) => {
      this.mouseDown = true;
      this.createSquare(e.x, e.y);
    });

    canvas.addEventListener('mousemove', (e) => {
      let now = performance.now();
      if (this.mouseDown && now - this.prevSquareTimestamp > SquareDrawingApp.squareCreationInterval) {
        this.createSquare(e.x, e.y);
        this.prevSquareTimestamp = now;
      }
    });

    canvas.addEventListener('mouseup', (e) => {
      this.mouseDown = false;
    });
  }

  private resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private createSquare(x: number, y: number, updateColor: boolean = true, color?: number) {
    color ? this.squares.push(new Square(x, y, color)) : this.squares.push(new Square(x, y, this.color));
    if (updateColor) {
      this.color += SquareDrawingApp.colorUpdateStep;
      if (this.color === 1) {
        this.color = 0;
      }
    }
  }

  private Render = () => {
    this.clearCanvas();

    let context = this.context;

    context.fillStyle = 'aqua';

    let index = this.squares.length - 1;

    while (index !== -1) {
      if (!this.squares[index].isAlive()) {
        this.squares.splice(index, 1);
      }
      index -= 1;
    }

    this.squares.forEach((square) => {
      square.update();
      square.draw(context);
    });

    context.fill();

    requestAnimationFrame(this.Render);
  };
}

class Square {
  private static lifespan = 200;

  private x: number;
  private y: number;
  private size: number;
  private tick: number;
  private color: number;

  constructor(x: number, y: number, color: number) {
    this.x = x;
    this.y = y;
    this.size = 0;
    this.tick = 0;
    this.color = color;
  }

  public update() {
    this.x -= 1;
    this.y -= 1;
    this.size += 2;
    this.tick += 1;
  }

  public isAlive(): boolean {
    return this.tick < Square.lifespan;
  }

  public draw(context: CanvasRenderingContext2D) {
    context.fillStyle = hue2RGBString(this.color);
    context.globalAlpha = 1 - this.tick / Square.lifespan;
    context.fillRect(this.x, this.y, this.size, this.size);
  }
}

new SquareDrawingApp();
