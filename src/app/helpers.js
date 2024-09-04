export function useConvertPrice(priceInPennies) {
    return (priceInPennies / 100).toFixed(2);
}