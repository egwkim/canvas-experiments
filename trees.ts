import { CanvasApp, Dictionary, Vector2D } from './main.js';
import { LSystem } from './l-system.js';

class TreeCanvasApp extends CanvasApp {
  private trees: Tree[];
  private seeds: Seed[];

  constructor() {
    super();
  }

  protected init(): void {
    this.trees = [];
    this.trees.push(new Tree(40, 40));
    this.seeds = [];
    this.seeds.push(new Seed(50, 50));
  }

  protected addListeners(): void {
    super.addListeners();

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

  protected render(): void {
    let context = this.context;

    this.seeds.forEach((seed) => seed.render(context));

    this.trees.forEach((tree) => tree.render(context));
  }
}

class Seed {
  static acceleration = new Vector2D(0, 0.1);

  public pos: Vector2D;
  public prev_pos: Vector2D;

  private velocity: Vector2D;

  private destinateY: number;

  get alive() {
    return this.pos.y < this.destinateY;
  }

  constructor(x: number, y: number) {
    this.pos = new Vector2D(x, y);
    this.velocity = new Vector2D(0, 0);
    this.prev_pos = new Vector2D(x, y);
    this.destinateY = 400; // Temporary value
  }

  public update(): void {
    this.prev_pos.x = this.pos.x;
    this.prev_pos.y = this.pos.y;
    this.pos.add(this.velocity);
    this.velocity.add(Seed.acceleration);
  }

  public render(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.moveTo(this.pos.x, this.pos.y);
    context.lineTo(this.pos.x, this.pos.y - this.velocity.y * 20);
    context.strokeStyle = 'white';
    context.lineWidth = 10;
    context.stroke();
  }
}

class Tree extends LSystem {
  static axiom = '0';
  static rules = { '0': '01', '1': '0' };
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
  }

  // TODO Tree render method
  public render(context: CanvasRenderingContext2D): void {}
}

new TreeCanvasApp();
