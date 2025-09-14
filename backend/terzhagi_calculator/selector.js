function pick_best(options, n = 2) {
    return options
        .sort((a, b) => a.volume - b.volume || a.depth - b.depth)
        .slice(0, n);
}

module.exports = {
    pick_best
}