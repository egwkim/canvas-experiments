export { LSystem };
class LSystem {
    constructor(axiom, prodRule) {
        this.state = axiom;
        this.prodRule = prodRule;
    }
    update() {
        let old_state = [...this.state];
        this.state = '';
        old_state.forEach((c) => {
            this.state += this.prodRule[c];
        });
    }
}
