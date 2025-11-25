import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import type { Prediction } from '../types';
import { getAllPredictions } from '../services/api';

export function PredictionsChart() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    try {
      const data = await getAllPredictions();
      setPredictions(data);
    } catch (error) {
      console.error('Error loading predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const highRisk = predictions.filter((p) => p.churn_risk_level === 'High').length;
  const mediumRisk = predictions.filter((p) => p.churn_risk_level === 'Medium').length;
  const lowRisk = predictions.filter((p) => p.churn_risk_level === 'Low').length;
  const total = predictions.length || 1;

  const chartData = [
    { label: 'High Risk', count: highRisk, color: 'bg-red-500', percentage: (highRisk / total) * 100 },
    { label: 'Medium Risk', count: mediumRisk, color: 'bg-amber-500', percentage: (mediumRisk / total) * 100 },
    { label: 'Low Risk', count: lowRisk, color: 'bg-green-500', percentage: (lowRisk / total) * 100 },
  ];

  const maxCount = Math.max(highRisk, mediumRisk, lowRisk, 1);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Risk Distribution</h2>
      </div>

      {predictions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No predictions yet. Add customers and run predictions to see the distribution.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {chartData.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <span className="text-sm text-gray-600">
                    {item.count} ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-8">
                    <div
                      className={`${item.color} h-8 rounded-full flex items-center justify-end pr-3 transition-all duration-500`}
                      style={{ width: `${(item.count / maxCount) * 100}%` }}
                    >
                      {item.count > 0 && (
                        <span className="text-white text-xs font-semibold">{item.count}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 mt-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total Predictions</span>
              <span className="text-2xl font-bold text-gray-900">{predictions.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-lg font-bold text-red-600">{highRisk}</span>
              </div>
              <p className="text-xs text-gray-600">High Risk</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-lg font-bold text-amber-600">{mediumRisk}</span>
              </div>
              <p className="text-xs text-gray-600">Medium Risk</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-lg font-bold text-green-600">{lowRisk}</span>
              </div>
              <p className="text-xs text-gray-600">Low Risk</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
