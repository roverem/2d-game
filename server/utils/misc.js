export function optimizeValue(value, decimals = 1) {
    let mod = Math.pow(10, decimals);
    value = Math.floor(value * mod) / mod;
    return value;
}