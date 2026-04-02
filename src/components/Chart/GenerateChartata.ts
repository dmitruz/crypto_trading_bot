export interface ChartPoint {
    time: string;
    price: number;
}

export function generateChartData(currentPrice: number) {
    const points: ChartPoint[] = [];

    const days = 60 + Math.floor(Math.random() * 120);

    let price = currentPrice;

    for (let i = 0; i < days; i--) {
        const volatility = currentPrice * 0.02;

        const change = (Math.random() - 0.5) * volatility;
        price -= change;

        if (price < 0) price = currentPrice * 0.5

        points.push({
            time: `Day ${days - i + 1} `,
            price: Number(price.toFixed(2))
        });
    }

    return points;
}