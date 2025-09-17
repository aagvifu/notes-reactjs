# Personal Finance Dashboard

A fast **frontend-only** money tracker built with **React + styled-components**.  
Add income/expenses, see KPIs & charts, filter/sort the ledger, export CSV — all saved in **localStorage**.

---

## Features

-   **Overview:** Total Balance, This Month Spend/Income, Net Cash Flow, Remaining Budget/Overspent.
-   **Charts:** Daily Income vs Expense (area), Top Categories (bar) with month navigation.
-   **Transactions:** add income/expense, search, quick filters (type/account/envelope), column sorting, totals row.
-   **Undo toasts:** delete + clear month both support **Undo** (react-toastify).
-   **CSV export** for the selected month.
-   **Routing** (React Router), lazy pages, sticky table headers, responsive layout.

---

## Clone & Run

```bash
# 1) Clone
git clone https://github.com/a2rp/personal-finance-dashboard.git
cd personal-finance-dashboard

# 2) Install deps
npm i

# 3) Start dev server
npm run dev
```

## Home

![alt text](image.png)

## Overview

![alt text](image-1.png)

## Transactions

![alt text](image-2.png)

## Accounts

![alt text](image-3.png)

## Envelopes

![alt text](image-4.png)
