export { LSystem };

import { Dictionary } from './main.js';

class LSystem {
  protected state: string;
  protected prodRule: Dictionary;

  constructor(axiom: string, prodRule: Dictionary) {
    this.state = axiom;
    this.prodRule = prodRule;
  }

  public update(): void {
    let old_state = [...this.state];
    this.state = '';

    old_state.forEach((c) => {
      this.state += this.prodRule[c];
    });
  }
}
