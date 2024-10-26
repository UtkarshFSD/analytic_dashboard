import React, { useMemo } from 'react';
import { Scatter } from 'react-chartjs-2';

interface MakeRangeComparisonProps {
  data: Array<{
    Make: string;
    "Electric Range": number;
    "Base MSRP": number;
  }>;
}

export function MakeRangeComparison({ data }: MakeRangeComparisonProps) {
  const scatterData = useMemo(() => {
    const makeCount = data.reduce((acc, curr) => {
      acc[curr.Make] = (acc[curr.Make] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topMakes = Object.entries(makeCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([make]) => make);

    const colors = [
      'rgba(99, 102, 241, 0.7)', 
      'rgba(236, 72, 153, 0.7)',  
      'rgba(16, 185, 129, 0.7)',   
      'rgba(245, 158, 11, 0.7)',   
      'rgba(139, 92, 246, 0.7)',   
    ];

    const datasets = topMakes.map((make, index) => {
      const makeData = data
        .filter(item => item.Make === make)
        .map(item => ({
          x: item["Base MSRP"],
          y: item["Electric Range"],
        }));

      return {
        label: make,
        data: makeData,
        backgroundColor: colors[index],
        pointRadius: 6,
        pointHoverRadius: 8,
      };
    });

    return { datasets };
  }, [data]);

  return (
    <div className="h-[300px]">
      <Scatter
        data={scatterData}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 10,
                padding: 10,
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const point = context.raw as { x: number; y: number };
                  return `${context.dataset.label}: $${point.x.toLocaleString()} - ${point.y} miles`;
                },
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
                text: 'Electric Range (miles)',
              },
            },
            x: {
              grid: {
                display: false,
              },
              title: {
                display: true,
                text: 'Base MSRP ($)',
              },
              ticks: {
                callback: (value) => `$${(value as number).toLocaleString()}`,
              },
            },
          },
        }}
      />
    </div>
  );
}