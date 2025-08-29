export function terzhagi_q_ult(c, gamma, phi_deg, B, L, Df, shape) {
    const phi = (phi_deg * Math.PI) / 180;

    const Nq = Math.pow(Math.tan(Math.PI / 4 + phi / 2), 2) * Math.exp(Math.PI * Math.tan(phi));
    const Nc = (Nq - 1) / Math.tan(phi);
    const Ngamma = 2 * (Nq + 1) * Math.tan(phi);

    // Use same formula as Python
    return c * Nc + gamma * Df * Nq + 0.5 * gamma * B * Ngamma;
}
