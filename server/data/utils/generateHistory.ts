
export interface PricePoint {
    date: string;
    price: number;
}

export function generateHistory(
    startPrice: number,
    days: number = 365
): PricePoint[] {

    const data: PricePoint[] = [];

    let price = startPrice * 0.5;

    for (let i = 0; i < days; i++) {

        const change = (Math.random() - 0.45) * startPrice * 0.02;

        price += change;

        if (price < 0) price = startPrice * 0.3;

        data.push({
            date: `2024-${Math.floor(i / 30) + 1}-${(i % 30) + 1}`,
            price: Number(price.toFixed(2))
        });
    }

    return data;
}