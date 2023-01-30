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
      
  ],
  sort: {
    sortBy: "market_cap_calc",
    sortOrder: "desc"
  },
  ignore_unknown_fields: false,
  range: [0, 100],
  markets: ["coin"]
}

module.exports = payload