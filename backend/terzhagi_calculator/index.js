const gen = require("./generator.js");
const sel = require("./selector.js");
const cap = require("./capacity.js");
const mod = require("./models.js");

const TerzhagiCalc = {
    generate_options: gen.generate_options,
    pick_best: sel.pick_best,
    terzhagi_q_ult: cap.terzhagi_q_ult,
    Option: mod.Option
};

module.exports = TerzhagiCalc;
