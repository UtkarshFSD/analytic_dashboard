import React, { useMemo } from 'react';
import { Car, Battery, Zap, MapPin } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { StatsCard } from './components/StatsCard';
import { ChartCard } from './components/ChartCard';
import { TypeDistribution } from './components/TypeDistribution';
import evData from './data';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const stats = useMemo(() => {
    const totalVehicles = evData.length;
    const makeCount = evData.reduce((acc, curr) => {
      acc[curr.Make] = (acc[curr.Make] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const typeCount = evData.reduce((acc, curr) => {
      acc[curr["Electric Vehicle Type"]] = (acc[curr["Electric Vehicle Type"]] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const cityCount = evData.reduce((acc, curr) => {
      acc[curr.City] = (acc[curr.City] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgRange = evData.reduce((acc, curr) => acc + curr["Electric Range"], 0) / totalVehicles;

    return { totalVehicles, makeCount, typeCount, cityCount, avgRange };
  }, []);

  const makeData = {
    labels: Object.keys(stats.makeCount),
    datasets: [
      {
        data: Object.values(stats.makeCount),
        backgroundColor: [
          '#6366F1',
          '#EC4899',
          '#14B8A6',
          '#F59E0B',
          '#8B5CF6',
          '#10B981',
          '#3B82F6',
          '#EF4444',
        ],
        borderWidth: 0,
      },
    ],
  };

  const cityData = {
    labels: Object.keys(stats.cityCount).slice(0, 10),
    datasets: [
      {
        label: 'Vehicles per City',
        data: Object.values(stats.cityCount).slice(0, 10),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Electric Vehicle Dashboard</h1>
          <p className="mt-2 text-indigo-100">Washington State EV Registration Data Analysis</p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 py-8">
          <StatsCard
            title="Total Vehicles"
            value={stats.totalVehicles}
            icon={Car}
            color="bg-gradient-to-r from-indigo-500 to-indigo-600"
          />
          <StatsCard
            title="Average Range"
            value={`${Math.round(stats.avgRange)} mi`}
            icon={Battery}
            color="bg-gradient-to-r from-emerald-500 to-emerald-600"
          />
          <StatsCard
            title="Unique Makes"
            value={Object.keys(stats.makeCount).length}
            icon={Zap}
            color="bg-gradient-to-r from-amber-500 to-amber-600"
          />
          <StatsCard
            title="Cities"
            value={Object.keys(stats.cityCount).length}
            icon={MapPin}
            color="bg-gradient-to-r from-rose-500 to-rose-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartCard title="Vehicle Makes Distribution">
            <div className="h-[300px] flex items-center justify-center">
              <Pie
                data={makeData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                  },
                }}
              />
            </div>
          </ChartCard>

          <ChartCard title="Top 10 Cities">
            <div className="h-[300px]">
              <Bar
                data={cityData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        display: false,
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            </div>
          </ChartCard>
        </div>

        <ChartCard title="Vehicle Type Distribution">
          <TypeDistribution typeCount={stats.typeCount} totalVehicles={stats.totalVehicles} />
        </ChartCard>
      </main>
    </div>
  );
}

export default App;