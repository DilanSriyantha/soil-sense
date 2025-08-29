import { terzhagi_q_ult } from "./capacity.js";
import { Option } from "./models.js";

export function generate_options(c, gamma, phi, applied_load, FS, t_conc) {
    const options = { Square: [], Strip: [], Rectangular: [] };

    const depth_start = 0.5, depth_end = 2.5, depth_step = 0.1;
    const width_start = 0.5, width_end = 3.0, width_step = 0.1;
    const length_start = 0.5, length_end = 3.0, length_step = 0.1;

    // Square
    for (let i = 0; i <= (depth_end - depth_start) / depth_step; i++) {
        const Df = +(depth_start + i * depth_step).toFixed(2);
        for (let j = 0; j <= (width_end - width_start) / width_step; j++) {
            const B = +(width_start + j * width_step).toFixed(2);
            const q_ult = terzhagi_q_ult(c, gamma, phi, B, B, Df, "square");
            const q_safe = q_ult / FS;
            const q_app = applied_load / (B * B);
            if (q_safe >= q_app) {
                const vol = B * B * t_conc;
                options.Square.push(new Option("Square", B, B, Df, q_safe, q_app, vol));
            }
        }
    }

    // Strip
    for (let i = 0; i <= (depth_end - depth_start) / depth_step; i++) {
        const Df = +(depth_start + i * depth_step).toFixed(2);
        for (let j = 0; j <= (width_end - width_start) / width_step; j++) {
            const B = +(width_start + j * width_step).toFixed(2);
            const q_ult = terzhagi_q_ult(c, gamma, phi, B, 1.0, Df, "strip");
            const q_safe = q_ult / FS;
            const q_app = applied_load / B;  // same as Python
            if (q_safe >= q_app) {
                const vol = B * 1.0 * t_conc;
                options.Strip.push(new Option("Strip", B, 1.0, Df, q_safe, q_app, vol));
            }
        }
    }

    // Rectangular
    for (let i = 0; i <= (depth_end - depth_start) / depth_step; i++) {
        const Df = +(depth_start + i * depth_step).toFixed(2);
        for (let j = 0; j <= (width_end - width_start) / width_step; j++) {
            const B = +(width_start + j * width_step).toFixed(2);
            for (let k = 0; k <= (length_end - length_start) / length_step; k++) {
                const L = +(length_start + k * length_step).toFixed(2);
                if (L < B) continue;
                const q_ult = terzhagi_q_ult(c, gamma, phi, B, L, Df, "rectangular");
                const q_safe = q_ult / FS;
                const q_app = applied_load / (B * L);
                if (q_safe >= q_app) {
                    const vol = B * L * t_conc;
                    options.Rectangular.push(new Option("Rectangular", B, L, Df, q_safe, q_app, vol));
                }
            }
        }
    }

    return options;
}
