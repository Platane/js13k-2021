export const tau = (3 / 100) * (1 << 16);

export const threshold = 0.38;

export const gauss = (x: number) => Math.exp((-0.5 * (x * x)) / (tau * tau));
