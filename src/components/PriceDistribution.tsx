import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';

interface PriceDistributionProps {
  data: Array<{
    "Base MSRP": number;
  }>;
}

export function PriceDistribution({ data }: PriceDistributionProps) {
  const priceData = useMemo(() => {
    const prices = data
      .map(item => item["Base MSRP"])
      .filter(price => price > 0);

    if (prices.length === 0) {
      return {
        labels: ['No price data available'],
        datasets: [{
          label: 'Number of Vehicles',
          data: [0],
          backgroundColor: 'rgba(236, 72, 153, 0.8)',
          borderRadius: 8,
        }],
      };
    }

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    

    const binSize = Math.max(10000, Math.ceil((max - min) / 20));
    const numBins = Math.min(20, Math.ceil((max - min) / binSize));
    
    const bins = new Array(numBins).fill(0);
    const binRanges: string[] = [];

    prices.forEach(price => {
      const binIndex = Math.min(
        numBins - 1,
        Math.floor(((price - min) / (max - min)) * (numBins - 1))
      );
      bins[binIndex]++;
    });

    for (let i = 0; i < numBins; i++) {
      const start = min + (i * (max - min) / numBins);
      const end = min + ((i + 1) * (max - min) / numBins);
      binRanges.push(`$${(start/1000).toFixed(0)}k-${(end/1000).toFixed(0)}k`);
    }

    return {
      labels: binRanges,
      datasets: [{
        label: 'Number of Vehicles',
        data: bins,
        backgroundColor: 'rgba(236, 72, 153, 0.8)',
        borderRadius: 8,
      }],
    };
  }, [data]);

  return (
    <div className="h-[300px]">
      <Bar
        data={priceData}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                title: (items) => `Price Range: ${items[0].label}`,
                label: (context) => `${context.raw} vehicles`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                display: false,
              },
              title: {
                display: true,
                text: 'Number of Vehicles',
              },
            },
            x: {
              grid: {
                display: false,
              },
              title: {
                display: true,
                text: 'Price Range',
              },
              ticks: {
                maxRotation: 45,
                minRotation: 45,
              },
            },
          },
        }}
      />
    </div>
  );
}