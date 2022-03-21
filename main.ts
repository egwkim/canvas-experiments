class DrawingApp {
  private static boxCreationInterval = 100;
  private static colorUpdateStep = 0.005;

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private mouseDown: boolean;

  private prevBoxTimestamp: number;

  private boxes: Box[];

  private color: number;

  constructor() {
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    let context = canvas.getContext('2d');

    this.canvas = canvas;
    this.context = context;

    this.mouseDown = false;

    this.prevBoxTimestamp = 0;

    this.boxes = [];

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
      this.createBox(e.x, e.y);
    });

    canvas.addEventListener('mousemove', (e) => {
      let now = performance.now();
      if (this.mouseDown && now - this.prevBoxTimestamp > DrawingApp.boxCreationInterval) {
        this.createBox(e.x, e.y);
        this.prevBoxTimestamp = now;
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

  private createBox(x: number, y: number, updateColor: boolean = true, color?: number) {
    color ? this.boxes.push(new Box(x, y, color)) : this.boxes.push(new Box(x, y, this.color));
    if (updateColor) {
      this.color += DrawingApp.colorUpdateStep;
      if (this.color === 1) {
        this.color = 0;
      }
    }
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
    return this.tick < 200;
  }

  public draw(context: CanvasRenderingContext2D) {
    context.fillStyle = color2RGBString(this.color);
    context.globalAlpha = 1 - this.tick / 200;
    context.fillRect(this.x, this.y, this.size, this.size);
  }
}

new DrawingApp();

function color2RGBString(color: number): string {
  const rgb = HSVtoRGB(color, 1, 1);
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

function HSVtoRGB(h: number, s: number, v: number) {
  let r: number, g: number, b: number, i: number, f: number, p: number, q: number, t: number;
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
