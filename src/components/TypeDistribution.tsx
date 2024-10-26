import React from 'react';

interface TypeDistributionProps {
  typeCount: Record<string, number>;
  totalVehicles: number;
}

export function TypeDistribution({ typeCount, totalVehicles }: TypeDistributionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(typeCount).map(([type, count]) => (
        <div key={type} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">{type}</span>
            <div className="flex items-center">
              <span className="text-indigo-600 font-bold">{count}</span>
              <span className="text-gray-500 text-sm ml-2">
                ({Math.round((count / totalVehicles) * 100)}%)
              </span>
            </div>
          </div>
          <div className="mt-3 bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full h-2.5 transition-all duration-500"
              style={{ width: `${(count / totalVehicles) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}