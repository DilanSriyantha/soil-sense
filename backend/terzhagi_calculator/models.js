class Option {
    constructor(shape, B, L, depth, q_safe, q_applied, volume) {
        this.shape = shape;
        this.size = `${B.toFixed(2)} x ${L.toFixed(2)} m`;
        this.depth = depth;
        this.volume = volume;
        this.q_safe = q_safe;
        this.q_applied = q_applied;
    }
}

module.exports = {
    Option
};