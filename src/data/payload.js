const payload = {
  columns: [
      "base_currency",
      "base_currency_desc",
      "high",
      "close",
      "low",
      "pricescale",
      "change",
      "24h_close_change|5",
      "market_cap_calc",
      "24h_vol_to_market_cap",
      "24h_vol_change_cmc",
      "Volatility.D",
      "RSI|60"
  ],
  filter: [
      //{left: 'market_cap_calc', operation: 'eless', right: 10000000},
      //{left: "24h_close_change|5", operation: "eless", right: 0},
      {left: "24h_vol_to_market_cap", operation: "egreater", right: 0},
      {left: "24h_vol_change_cmc", operation: "egreater", right: 0},
      {left: "RSI|60", operation: "eless", right: 30},
      {left: "Volatility.D", operation: "egreater", right: 0}
  ],
  sort: {
    sortBy: "RSI|60",
    sortOrder: "asc"
  },
  ignore_unknown_fields: false,
  range: [0, 100],
  markets: ["coin"]
}

module.exports = payload