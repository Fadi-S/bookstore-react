export function useConvertPrice(priceInPennies) {
    return (priceInPennies / 100).toFixed(2);
}

export function useParseDate(date) {
    return new Date(Date.parse(date)).toLocaleDateString();
}