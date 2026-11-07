---
title: "Financial Analytics Should Add Up Before They Look Good"
date: "2026-11-07"
description: "Building expense analytics around allocation, household scope, and cash-flow semantics instead of treating every imported row as spending."
author: "Pranav Nedungadi"
tags: ["Go", "PostgreSQL", "Finance", "Data Modeling"]
---

# Financial Analytics Should Add Up Before They Look Good

An expense dashboard can look plausible while being wrong. Totals trend in the expected direction, categories have sensible names, and the charts are polished. Then a user compares the category total with the account total and finds money that exists twice.

Working on NeuroSpend pushed me to treat analytics as a set of accounting invariants before treating it as a visualization problem. The backend's job is to define which money a row represents and keep that definition consistent across every query.

## Joining categories can multiply money

Suppose a transaction of ₹1,000 is split between groceries and household supplies. Joining the transaction to two category rows and summing the original transaction amount reports ₹2,000.

The rows are not duplicates in the relational sense. The query is summing at the wrong grain.

Store or derive the allocated amount for each category, then aggregate that allocation. For a fully categorized transaction, category allocations should sum to the transaction amount. An uncategorized remainder needs a defined destination rather than disappearing from the chart.

```text
transaction amount = sum(category allocations) + unallocated amount
```

Rounding belongs in that contract too. If percentages produce fractional minor units, assign the remainder deterministically. Do not let independent display rounding invent or lose money.

## Scope is a shared predicate

A household view might include transactions owned by several people. If the summary query handles household scope one way and the trend query handles it another, both numbers can be locally reasonable and mutually inconsistent.

I keep scope construction in a shared repository boundary. Every summary, category breakdown, and trend query starts from the same eligible transaction set, then changes the grouping rather than redefining access and ownership.

That boundary should also distinguish data eligibility from presentation filters. Hiding a category from one chart should not silently change the meaning of the account balance elsewhere.

## An investment order is not always bank cash flow

Fund platforms can record a redemption and purchase for an internal switch. Importing both as external bank movements fabricates cash flow that never crossed the user's bank account.

Order history, account transactions, and investment valuations are related ledgers, not interchangeable sources. Portfolio-level XIRR needs external contributions and withdrawals plus terminal value. A fund-level calculation may include internal movements that cancel at the portfolio level.

The same distinction applies to expenses: transfers between owned accounts are not new spending merely because one account shows a debit.

## Historical balances need historical inputs

Current net worth is a point-in-time summary. A historical cash-balance series is a sequence derived from dated cash movements and an opening balance. Using today's investment valuation as if it were a historical cash transaction mixes those two questions.

I prefer naming each output after the question it actually answers. “Cash balance” and “net worth” should not be two labels over the same aggregation.

## Check conservation before insight

Before looking for spending patterns, I reconcile category allocations against eligible expense totals, verify transfers do not inflate spending, and compare household totals against their constituent records.

Date-dependent calculations also need an explicit valuation date. A fixture that passes today and fails next month is not testing a stable financial fact.

Better charts cannot rescue inconsistent money semantics. Once allocation, scope, and ledger boundaries are correct, the frontend becomes the easier part: presenting answers that already agree with each other.
