import React from 'react';
import './stockstats.css';

function StockStats() {
  return (
    <div class="statistics-container">
        <div class="statistics-title">Key statistics</div>
            <div class="statistics-grid">
                <div class="stat-item">
                    <strong>Market cap</strong>
                    <span>544.31M</span>
                </div>
                <div class="stat-item">
                    <strong>Price-Earnings ratio</strong>
                    <span>-2.92</span>
                </div>
                <div class="stat-item">
                    <strong>Dividend yield</strong>
                    <span>—</span>
                </div>
                <div class="stat-item">
                    <strong>Average volume</strong>
                    <span>1.29M</span>
                </div>
                <div class="stat-item">
                    <strong>High today</strong>
                    <span>$2.64</span>
                </div>
                <div class="stat-item">
                    <strong>Low today</strong>
                    <span>$2.55</span>
                </div>
                <div class="stat-item">
                    <strong>Open price</strong>
                    <span>$2.55</span>
                </div>
                <div class="stat-item">
                    <strong>Volume</strong>
                    <span>500.11K</span>
                </div>
                <div class="stat-item">
                    <strong>52 Week high</strong>
                    <span>$3.35</span>
                </div>
                <div class="stat-item">
                    <strong>52 Week low</strong>
                    <span>$2.06</span>
                </div>
            </div>
        </div>
  );
}

export default StockStats;
