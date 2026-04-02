
import fs from "fs";
import { generateHistory } from "./utils/generateHistory";

const data = {
    WIR: generateHistory(214.16),
    DOD: generateHistory(0.002),
    ZVH: generateHistory(0.01),
    TOR: generateHistory(0.25)
};

fs.writeFileSync(
    "./data/prices.json",
    JSON.stringify(data, null, 2)
);

console.log("Data generated!");