const bearingTable = {
    0: { Nc: 5.70, Nq: 1.00, Ng: 0.00 },
    1: { Nc: 6.00, Nq: 1.10, Ng: 0.01 },
    2: { Nc: 6.20, Nq: 1.22, Ng: 0.04 },
    3: { Nc: 6.62, Nq: 1.35, Ng: 0.06 },
    4: { Nc: 6.97, Nq: 1.49, Ng: 0.09 },
    5: { Nc: 7.34, Nq: 1.64, Ng: 0.14 },
    6: { Nc: 7.73, Nq: 1.81, Ng: 0.20 },
    7: { Nc: 8.15, Nq: 2.00, Ng: 0.27 },
    8: { Nc: 8.60, Nq: 2.21, Ng: 0.35 },
    9: { Nc: 9.08, Nq: 2.45, Ng: 0.45 },
    10: { Nc: 9.61, Nq: 2.69, Ng: 0.56 },
    11: { Nc: 10.16, Nq: 2.96, Ng: 0.69 },
    12: { Nc: 10.76, Nq: 3.29, Ng: 0.85 },
    13: { Nc: 11.41, Nq: 3.63, Ng: 1.03 },
    14: { Nc: 12.11, Nq: 4.02, Ng: 1.26 },
    15: { Nc: 12.86, Nq: 4.45, Ng: 1.52 },
    16: { Nc: 13.66, Nq: 4.92, Ng: 1.82 },
    17: { Nc: 14.60, Nq: 5.45, Ng: 2.18 },
    18: { Nc: 15.46, Nq: 6.03, Ng: 2.59 },
    19: { Nc: 16.56, Nq: 6.70, Ng: 3.07 },
    20: { Nc: 17.69, Nq: 7.44, Ng: 3.63 },
    21: { Nc: 18.92, Nq: 8.26, Ng: 4.31 },
    22: { Nc: 20.27, Nq: 9.19, Ng: 5.09 },
    23: { Nc: 21.75, Nq: 10.23, Ng: 6.00 },
    24: { Nc: 23.36, Nq: 11.40, Ng: 7.08 },
    26: { Nc: 27.09, Nq: 14.21, Ng: 9.84 },
    27: { Nc: 29.24, Nq: 15.90, Ng: 11.60 },
    28: { Nc: 31.49, Nq: 17.71, Ng: 13.67 },
    29: { Nc: 34.24, Nq: 19.98, Ng: 16.18 },
    30: { Nc: 36.46, Nq: 22.46, Ng: 19.18 },
    31: { Nc: 40.41, Nq: 25.28, Ng: 22.65 },
    32: { Nc: 44.04, Nq: 28.52, Ng: 26.63 },
    33: { Nc: 48.09, Nq: 32.23, Ng: 31.94 },
    34: { Nc: 52.64, Nq: 36.46, Ng: 35.41 },
    35: { Nc: 57.73, Nq: 41.40, Ng: 45.41 },
    36: { Nc: 63.33, Nq: 47.16, Ng: 53.56 },
    37: { Nc: 69.51, Nq: 53.80, Ng: 65.36 },
    38: { Nc: 77.50, Nq: 61.55, Ng: 78.61 },
    39: { Nc: 85.66, Nq: 70.61, Ng: 95.61 },
    40: { Nc: 95.66, Nq: 81.27, Ng: 115.31 },
    41: { Nc: 106.81, Nq: 93.85, Ng: 140.51 },
    42: { Nc: 119.67, Nq: 108.75, Ng: 171.99 },
    43: { Nc: 134.58, Nq: 126.50, Ng: 211.56 },
    44: { Nc: 151.99, Nq: 147.70, Ng: 261.16 },
    45: { Nc: 172.28, Nq: 173.28, Ng: 324.53 },
    46: { Nc: 196.08, Nq: 203.40, Ng: 404.71 },
    47: { Nc: 224.55, Nq: 241.80, Ng: 512.84 },
    48: { Nc: 258.28, Nq: 288.63, Ng: 661.99 },
    49: { Nc: 298.71, Nq: 344.63, Ng: 831.99 },
    50: { Nc: 347.50, Nq: 415.14, Ng: 1072.80 }
};

function getBearingValues(fric_a) {
    const availablePhis = Object.keys(bearingTable).map(Number);

    // Find nearest φ′
    let nearestPhi = availablePhis.reduce((prev, curr) =>
        Math.abs(curr - fric_a) < Math.abs(prev - fric_a) ? curr : prev
    );

    return {
        phi: nearestPhi,
        ...bearingTable[nearestPhi]
    };
}

module.exports = {
    bearingTable,
    getBearingValues
}