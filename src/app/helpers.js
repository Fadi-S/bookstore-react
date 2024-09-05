export function useConvertPrice(priceInPennies) {
    return (priceInPennies / 100).toFixed(2);
}

export function useParseDate(date) {
    date = new Date(Date.parse(date));
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}