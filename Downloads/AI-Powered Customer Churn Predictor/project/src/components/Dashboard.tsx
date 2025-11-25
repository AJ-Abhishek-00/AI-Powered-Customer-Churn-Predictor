import { useEffect, useState } from 'react';
import { TrendingUp, Users, AlertTriangle, Activity } from 'lucide-react';
import type { Statistics } from '../types';
import { getStatistics } from '../services/api';

export function Dashboard() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const data = await getStatistics();
      setStats(data);
    } catch (error) {
      console.error('Error loading statistics:', error);
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

  const statCards = [
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'High Risk',
      value: stats?.highRisk || 0,
      icon: AlertTriangle,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Medium Risk',
      value: stats?.mediumRisk || 0,
      icon: Activity,
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Low Risk',
      value: stats?.lowRisk || 0,
      icon: TrendingUp,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Average Churn Probability</span>
                <span className="font-semibold text-gray-900">
                  {((stats.averageChurnProbability || 0) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(stats.averageChurnProbability || 0) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500 mb-1">High Risk</p>
                <p className="text-lg font-bold text-red-600">
                  {stats.totalPredictions > 0
                    ? ((stats.highRisk / stats.totalPredictions) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Medium Risk</p>
                <p className="text-lg font-bold text-amber-600">
                  {stats.totalPredictions > 0
                    ? ((stats.mediumRisk / stats.totalPredictions) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Low Risk</p>
                <p className="text-lg font-bold text-green-600">
                  {stats.totalPredictions > 0
                    ? ((stats.lowRisk / stats.totalPredictions) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
