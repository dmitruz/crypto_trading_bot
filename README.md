# Crypto Trading Bot

A real-time cryptocurrency trading simulation built with **React, TypeScript, Node.js, and WebSockets**. The application streams live cryptocurrency prices from Binance, visualizes price history, and simulates automated buy and sell operations.

The project demonstrates full-stack development, real-time data processing, REST API integration, interactive data visualization, and trading logic.

## Features

* **Real-time cryptocurrency prices** — receive live trade data from Binance through WebSockets.
* **Automated trading simulation** — start and stop trading sessions with automatic asset selection.
* **Buy and sell logic** — simulate purchases with a fixed investment and calculate the resulting profit or loss.
* **Portfolio tracking** — display the available balance and realized profit.
* **Historical price charts** — visualize cryptocurrency price history using Recharts.
* **Trade history** — review simulated buy and sell transactions.
* **Google authentication** — sign in using a Google account.
* **Responsive interface** — monitor prices, portfolio information, and charts through a React-based UI.
* **Backend API** — provide price history, trade history, and trading controls through Express endpoints.

> **Disclaimer:** This project is intended for learning and demonstration purposes. It simulates trading and does not execute real cryptocurrency orders or manage real funds.

## Tech Stack

| Area                    | Technologies                                 |
| ----------------------- | -------------------------------------------- |
| Frontend                | React, TypeScript, SCSS                      |
| Charts                  | Recharts                                     |
| Backend                 | Node.js, Express, TypeScript                 |
| Real-time communication | WebSocket, Socket.IO                         |
| External data           | Binance REST API and WebSocket streams       |
| Authentication          | Google OAuth                                 |
| Database tooling        | Prisma ORM, PostgreSQL schema and migrations |
| Development tools       | npm, Git, GitHub                             |

## Application Architecture

The application separates the frontend, backend, and external market data sources.

```text
                  Binance
                 /       \
          REST API      WebSocket
              |              |
              v              v
        +-------------------------+
        |      Node.js Backend    |
        |                         |
        | Express REST API        |
        | Live price processing   |
        | Trading simulation      |
        | Portfolio calculations  |
        +-------------------------+
              |             ^
        REST requests    Socket.IO
              |             |
              v             v
        +-------------------------+
        |     React Frontend      |
        |                         |
        | PriceBoard              |
        | Balance / Profit        |
        | Historical Charts       |
        | Trade History           |
        | Trading Controls        |
        +-------------------------+
```

### How it works

1. The backend connects to Binance's WebSocket streams and receives real-time trade events for supported cryptocurrencies.
2. Incoming messages are processed to extract asset symbols and prices.
3. The backend updates its latest-price state and broadcasts price updates to connected clients using Socket.IO.
4. The React frontend receives these events and updates its components through React state.
5. When a user starts a trading session, the backend selects a cryptocurrency and waits for a matching price update.
6. The backend simulates a purchase, tracks the open position, and calculates the final profit or loss when trading is stopped.
7. Historical price data is retrieved through the Binance REST API and returned to the frontend for chart rendering.

## Trading Logic

The current implementation uses a simplified trading simulation.

### Buying

* The user starts a trading session.
* The backend randomly selects a supported cryptocurrency.
* When a matching market-price update arrives, the backend checks that trading is enabled, no position is already open, and the available balance is sufficient.
* The bot simulates a purchase worth **$50**.
* The purchase price, quantity, invested amount, and opening time are recorded in runtime state.

The quantity is calculated as:

```text
quantity = investment amount / purchase price
```

### Selling

When the user stops trading:

* The backend disables trading.
* If a position is open, the latest available price is used to simulate a sale.
* The returned amount and realized profit or loss are calculated.
* The available balance and portfolio profit are updated.
* A sell transaction is added to the trade history.

```text
returned amount = current price × quantity

profit or loss = returned amount − invested amount
```

These calculations exclude trading fees, slippage, and other real-world trading costs.

## Supported Cryptocurrencies

The application currently supports 12 cryptocurrency markets:

| Symbol | Asset     |
| ------ | --------- |
| BTC    | Bitcoin   |
| ETH    | Ethereum  |
| BNB    | BNB       |
| SOL    | Solana    |
| XRP    | XRP       |
| ADA    | Cardano   |
| DOGE   | Dogecoin  |
| AVAX   | Avalanche |
| LINK   | Chainlink |
| DOT    | Polkadot  |
| LTC    | Litecoin  |
| TRX    | TRON      |

## Price Charts

Historical price charts are rendered using **Recharts**, a charting library for React.

When a user selects a cryptocurrency, the frontend requests historical data from the backend. The backend queries Binance's REST API for one-minute candlestick data and transforms the response into a simplified format containing timestamps and closing prices.

The frontend passes the resulting data to Recharts to display the price history.

The application uses two separate data flows:

* **Historical data:** Binance REST API → Express backend → React chart.
* **Live prices:** Binance WebSocket → Node.js backend → Socket.IO → React state.

## Project Structure

```text
crypto_trading_bot/
│
├── server/
│   ├── src/
│   │   ├── index.ts
│   │   └── reserve.ts
│   │
│   ├── data/
│   │   └── prices.json
│   │
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── prisma.config.ts
│   ├── package.json
│   ├── package-lock.json
│   └── .gitignore
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Balance/
│   │   ├── Main/
│   │   ├── Navbar/
│   │   ├── PriceBoard/
│   │   └── TradeHistory.tsx
│   │
│   ├── pages/
│   │   ├── ChartPage.tsx
│   │   └── TradesPage.tsx
│   │
│   ├── images/
│   ├── App.tsx
│   └── index.tsx
│
├── package.json
├── package-lock.json
└── README.md
```

*Note: This is a high-level representation of the repository structure. Some files may vary between branches.*

### Main components

| Component / file              | Responsibility                                                  |
| ----------------------------- | --------------------------------------------------------------- |
| `App.tsx`                     | Main application setup and shared state                         |
| `Main.tsx`                    | Main trading interface and trading controls                     |
| `PriceBoard`                  | Displays cryptocurrency prices                                  |
| `Balance`                     | Displays available balance and profit                           |
| `Navbar`                      | Navigation and Google sign-in interface                         |
| `ChartPage.tsx`               | Historical cryptocurrency price charts                          |
| `TradeHistory.tsx`            | Opens the trade history view                                    |
| `TradesPage.tsx`              | Displays buy and sell transactions                              |
| `server/src/index.ts`         | Backend APIs, Binance integration, Socket.IO, and trading logic |
| `server/prisma/schema.prisma` | Database schema for the persistence layer                       |
| `server/prisma/migrations/`   | Database migration history                                      |

## Getting Started

### Prerequisites

Install the following before running the application:

* Node.js and npm
* Git
* A Google OAuth client ID for Google sign-in functionality

### 1. Clone the repository

```bash
git clone https://github.com/dmitruz/crypto_trading_bot.git
cd crypto_trading_bot
```

### 2. Install frontend dependencies

From the project root:

```bash
npm install
```

### 3. Configure Google OAuth

Configure your Google OAuth client ID in Google Cloud Console. Add the appropriate local development origin to the authorized JavaScript origins.

Set the client ID using the configuration expected by the frontend. For Create React App, this commonly uses an environment variable such as:

```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

Ensure the application reads the same variable. Do not commit credentials or secret environment files.

### 4. Install backend dependencies

```bash
cd server
npm install
```

### 5. Start the backend

From the `server` directory:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:4000
```

### 6. Start the frontend

Open a second terminal at the repository root:

```bash
npm start
```

The frontend runs at:

```text
http://localhost:3000
```

Open the frontend URL in your browser.

## API Endpoints

The backend currently exposes the following main endpoints:

| Method | Endpoint           | Description                                                |
| ------ | ------------------ | ---------------------------------------------------------- |
| `GET`  | `/prices`          | Returns stored live price history                          |
| `GET`  | `/history/:symbol` | Retrieves historical prices for a supported cryptocurrency |
| `GET`  | `/trades`          | Returns the current trade history                          |
| `POST` | `/start-trading`   | Starts a trading session                                   |
| `POST` | `/stop-trading`    | Stops trading and closes an open simulated position        |

The backend also broadcasts real-time events through Socket.IO:

| Event       | Purpose                                   |
| ----------- | ----------------------------------------- |
| `prices`    | Sends current cryptocurrency prices       |
| `portfolio` | Sends balance and realized profit updates |
| `trade`     | Announces a new simulated transaction     |

## Data Persistence

The current trading simulation stores balances, open positions, and trade history in backend runtime memory. These values are not durable across server restarts.

The repository also includes Prisma models and PostgreSQL migrations as the foundation for database persistence. Connecting the runtime trading services to PostgreSQL is a separate step; the presence of the schema does not mean the current simulation automatically saves its transactions to the database.

## Future Improvements

* Integrate PostgreSQL persistence for users, balances, positions, and transactions.
* Add server-side authentication and authorization.
* Implement configurable trading strategies and risk-management rules.
* Add transaction fees, slippage, and more realistic execution simulation.
* Improve error handling and WebSocket reconnection.
* Add automated backend and frontend tests.
* Add deployment configuration for the frontend and backend.
* Add historical performance metrics and portfolio analytics.

## Learning Objectives

This project was built to practise:

* Full-stack application development with React and Node.js.
* TypeScript and component-based frontend architecture.
* REST API design and external API integration.
* Real-time communication using WebSockets and Socket.IO.
* Data visualization and live UI updates.
* Backend trading logic and financial calculations.
* Database modelling with Prisma and PostgreSQL.

## Author

**Dmitruz**

GitHub: [@dmitruz](https://github.com/dmitruz)
