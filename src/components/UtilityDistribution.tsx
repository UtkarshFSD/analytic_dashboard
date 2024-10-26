import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';

interface UtilityDistributionProps {
  data: Array<{
    "Electric Utility": string;
  }>;
}

export function UtilityDistribution({ data }: UtilityDistributionProps) {
  const chartData = useMemo(() => {
    const utilityCount = data.reduce((acc, curr) => {
      const utilities = curr["Electric Utility"]?.split('|') || [];
      utilities.forEach(utility => {
        const cleanUtility = utility.replace(' - (WA)', '').trim();
        acc[cleanUtility] = (acc[cleanUtility] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    // Get top 8 utilities by volume
    const topUtilities = Object.entries(utilityCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8);

    return {
      labels: topUtilities.map(([utility]) => utility),
      datasets: [{
        data: topUtilities.map(([, count]) => count),
        backgroundColor: [
          '#6366F1', '#EC4899', '#14B8A6', '#F59E0B',
          '#8B5CF6', '#10B981', '#3B82F6', '#EF4444'
        ],
        borderWidth: 0,
      }],
    };
  }, [data]);

  return (
    <div className="h-[300px] flex items-center justify-center">
      <Pie
        data={chartData}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                boxWidth: 12,
                padding: 15,
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => `${context.raw} vehicles`,
              },
            },
          },
        }}
      />
    </div>
  );
}