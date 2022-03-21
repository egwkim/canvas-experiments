class DrawingApp {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private boxes: Box[];

  constructor() {
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    let context = canvas.getContext('2d');

    this.canvas = canvas;
    this.context = context;

    this.boxes = [];

    this.addListeners();
    this.resizeCanvas();

    this.Render();
  }

  private addListeners() {
    let canvas = this.canvas;
    window.addEventListener('resize', this.resizeCanvas);

    canvas.addEventListener('mousedown', (e) => {
      this.createBox(e.x, e.y);
    });
  }

  private resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private createBox(x: number, y: number) {
    this.boxes.push(new Box(x, y));
  }

  private Render = () => {
    this.clearCanvas();

    let context = this.context;

    context.fillStyle = 'aqua';

    let index = this.boxes.length - 1;

    while (index !== -1) {
      if (!this.boxes[index].isAlive()) {
        this.boxes.splice(index, 1);
      }
      index -= 1;
    }

    this.boxes.forEach((box) => {
      box.update();
      box.draw(context);
    });

    context.fill();

    requestAnimationFrame(this.Render);
  };
}

class Box {
  private x: number;
  private y: number;
  private size: number;
  private tick: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.size = 0;
    this.tick = 0;
  }

  public update() {
    this.x -= 1;
    this.y -= 1;
    this.size += 2;
    this.tick += 1;
  }

  public isAlive(): boolean {
    return this.tick < 200;
  }

  public draw(context: CanvasRenderingContext2D) {
    context.globalAlpha = 1 - this.tick / 200;
    context.fillRect(this.x, this.y, this.size, this.size);
  }
}

new DrawingApp();
