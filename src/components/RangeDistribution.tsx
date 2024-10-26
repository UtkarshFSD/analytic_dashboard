import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';

interface RangeDistributionProps {
  data: Array<{
    "Electric Range": number;
  }>;
}

export function RangeDistribution({ data }: RangeDistributionProps) {
  const rangeData = useMemo(() => {
    const ranges = data.map(item => item["Electric Range"]);
    const min = Math.min(...ranges);
    const max = Math.max(...ranges);
    const binSize = 50;
    const bins: number[] = Array(Math.ceil((max - min) / binSize)).fill(0);

    ranges.forEach(range => {
      const binIndex = Math.floor((range - min) / binSize);
      bins[binIndex]++;
    });

    const labels = bins.map((_, i) => `${min + i * binSize}-${min + (i + 1) * binSize}`);

    return {
      labels,
      datasets: [{
        label: 'Number of Vehicles',
        data: bins,
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderRadius: 8,
      }],
    };
  }, [data]);

  return (
    <div className="h-[300px]">
      <Bar
        data={rangeData}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                title: (items) => `Range: ${items[0].label} miles`,
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
                text: 'Range (miles)',
              },
            },
          },
        }}
      />
    </div>
  );
}