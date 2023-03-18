import React from 'react'

export default function formatIdr(value, compact = false) {
    const formatIdr = (value) => {
        if (value < 0) {
          return `(Rp. ${`${value})`
          .replace(".", ",")
          .replace("-", "")
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
        }
        return `Rp. ${`${value}`
          .replace(".", ",")
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
      };
    
      const formatCompactIdr = (value) => {
        if (value < 0) {
          return `(Rp. ${`${nFormatter(Math.abs(value), 2)})`
            .replace(".", ",")
            .replace("-", "")
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
        }
        return `Rp. ${`${nFormatter(Math.abs(value), 2)}`
          .replace(".", ",")
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
      };
    
      const nFormatter = (num, digits) => {
        const lookup = [
          { value: 1, symbol: "" },
          { value: 1e3, symbol: " K" },
          { value: 1e6, symbol: " Jt" },
          { value: 1e9, symbol: " M" },
          { value: 1e12, symbol: " T" },
          { value: 1e15, symbol: " P" },
          { value: 1e18, symbol: " E" }
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var item = lookup.slice().reverse().find(function(item) {
          return num >= item.value;
        });
        return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
      }

      return compact ? formatCompactIdr(value) : formatIdr(value)
    
}
