export interface TerzhagiResult {
    shape: string;
    size: string;
    depth: number;
    volume: number;
    q_safe: number;
    q_applied: number;
};

export interface TerzhagiResultSet {
    Square: TerzhagiResult[];
    Strip: TerzhagiResult[];
    Rectangular: TerzhagiResult[];
};