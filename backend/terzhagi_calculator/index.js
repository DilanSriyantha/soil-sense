import * as gen from "./generator.js";
import * as sel from "./selector.js";
import * as cap from "./capacity.js";
import * as mod from "./models.js";

export const TerzhagiCalc = {
    generate_options: gen.generate_options,
    pick_best: sel.pick_best,
    terzhagi_q_ult: cap.terzhagi_q_ult,
    Option: mod.Option
};
