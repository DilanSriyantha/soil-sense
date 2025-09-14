const { getBearingValues } = require("./bearingTable");

function terzhagi_q_ult(c, gamma, phi_deg, B, L, Df, shape) {
    switch (shape) {
        case "square":
            return terzhagi_q_ult_square(c, gamma, phi_deg, B, Df);

        case "strip":
            return terzhagi_q_ult_strip(c, gamma, phi_deg, B, Df);

        case "rectangular":
            return terzhagi_q_ult_rectangular(c, gamma, phi_deg, B, L, Df);

        default:
            return 0;
    }
}

function terzhagi_q_ult_strip(c, gamma, fric_a, B, Df) {
    const bearingValues = getBearingValues(fric_a);
    const Nq = bearingValues.Nq;
    const Nc = bearingValues.Nc;
    const Ng = bearingValues.Ng;

    return c * Nc + gamma * Df * Nq + 0.5 * gamma * B * Ng;
}

function terzhagi_q_ult_square(c, gamma, fric_a, B, Df) {
    const bearingValues = getBearingValues(fric_a);
    const Nq = bearingValues.Nq;
    const Nc = bearingValues.Nc;
    const Ng = bearingValues.Ng;

    return 1.3 * c * Nc + gamma * Df * Nq + 0.4 * gamma * B * Ng;
}

function terzhagi_q_ult_rectangular(c, gamma, fric_a, B, L, Df) {
    const bearingValues = getBearingValues(fric_a);
    const Nq = bearingValues.Nq;
    const Nc = bearingValues.Nc;
    const Ng = bearingValues.Ng;

    return c * Nc * (1 + B / L) + gamma * Df * Nq + 0.5 * gamma * B * Ng * (1 - 0.4 * (B / L));
}

module.exports = {
    terzhagi_q_ult
}