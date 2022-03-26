import { CanvasApp, Vector2D, hue2RGBString } from './main.js';
import { LSystem } from './l-system.js';

class TreeCanvasApp extends CanvasApp {
  static treeUpdateTick = 30;

  private trees: Tree[];
  private seeds: Seed[];

  private tick: number;

  constructor() {
    super();
  }

  protected init(): void {
    this.trees = [];
    this.seeds = [];
    this.tick = 0;

    this.trees.push(new Tree(40, 40)); // Temporary
    this.seeds.push(new Seed(50, 50)); // Temporary
  }

  protected addListeners(): void {
    super.addListeners();

    // TODO Create seed when user clicks.
    this.canvas.addEventListener('mousedown', () => {});
  }

  protected update(): void {
    let index = this.seeds.length - 1;
    while (index !== -1) {
      if (!this.seeds[index].alive) {
        this.seeds.splice(index, 1);
      } else {
        this.seeds[index].update();
      }
      index -= 1;
    }

    if (this.tick % TreeCanvasApp.treeUpdateTick == 0) {
      index = this.trees.length - 1;
      while (index !== -1) {
        if (!this.trees[index].alive) {
          this.trees.splice(index, 1);
        } else {
          this.trees[index].update();
        }
        index -= 1;
      }
    }

    this.tick += 1;
  }

  protected render(): void {
    let context = this.context;

    this.seeds.forEach((seed) => seed.render(context));
    this.trees.forEach((tree) => tree.render(context));
  }
}

class Seed {
  static acceleration = new Vector2D(0, 0.2);

  public pos: Vector2D;
  public prev_pos: Vector2D;

  private velocity: Vector2D;

  private destinateY: number;

  private color: string;

  get alive() {
    return this.pos.y < this.destinateY;
  }

  constructor(x: number, y: number) {
    this.pos = new Vector2D(x, y);
    this.velocity = new Vector2D(0, 0);
    this.prev_pos = new Vector2D(x, y);
    this.destinateY = 400; // Temporary value

    this.color = hue2RGBString(Math.random());
  }

  public update(): void {
    this.prev_pos.x = this.pos.x;
    this.prev_pos.y = this.pos.y;
    this.pos.add(this.velocity);
    this.velocity.add(Seed.acceleration);
  }

  // FIXME Low visibility of dark blue seeds.
  public render(context: CanvasRenderingContext2D): void {
    context.beginPath();

    let x0 = this.pos.x,
      x1 = this.pos.x,
      y0 = this.pos.y,
      y1 = this.pos.y - this.velocity.y * 10;

    let grad = context.createLinearGradient(x0, y0, x1, y1);

    grad.addColorStop(0, this.color);
    grad.addColorStop(1, 'black');

    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = grad;
    context.lineWidth = 5;
    context.stroke();

    context.beginPath();
    context.arc(this.pos.x, this.pos.y, 5, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
  }
}

class Tree extends LSystem {
  static axiom = '0';
  static rules = { '0': '01', '1': '0' };
  // TODO Change Tree > drawingRules
  static drawingRules = [
    [1, 0],
    [0, 90],
  ];
  static life = 10;

  private initPos: Vector2D;
  private life: number;

  public get alive() {
    return this.life > 0;
  }

  constructor(x: number, y: number) {
    super(Tree.axiom, Tree.rules);
    this.state = Tree.axiom;
    this.initPos = new Vector2D(x, y);
    this.life = Tree.life;
  }

  public update() {
    super.update();
    this.life -= 1;
    console.log(this.state);
  }

  // TODO Tree render method
  public render(context: CanvasRenderingContext2D): void {}
}

new TreeCanvasApp();
