export interface ChartPoint {
    time: string;
    price: number;
}

export function generateChartData(startPrice: number) {
    const points: ChartPoint[] = [];

    const days = 60 + Math.floor(Math.random() * 120);

    let price = startPrice;

    for (let i = 0; i < days; i++) {

        const change = (Math.random() - 0.5) * 5;

        price += change;

        points.push({
            time: `Day ${i + 1}`,
            price: Number(price.toFixed(2))
        });
    }

    return points;
}