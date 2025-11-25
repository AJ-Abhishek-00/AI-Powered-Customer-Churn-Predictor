import { useState } from 'react';
import { Brain, Plus, Users, TrendingUp } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { CustomerForm } from './components/CustomerForm';
import { CustomerList } from './components/CustomerList';
import { PredictionsChart } from './components/PredictionsChart';
import { createCustomer } from './services/api';
import type { Customer } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'customers' | 'predictions' | 'add'>('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddCustomer = async (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    await createCustomer(customer);
    setActiveTab('customers');
    setRefreshKey(prev => prev + 1);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'predictions', label: 'Analytics', icon: Brain },
    { id: 'add', label: 'Add Customer', icon: Plus },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Churn Predictor</h1>
                <p className="text-xs text-gray-500">Predictive Analytics Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                Model v1.0
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                92% Accuracy
              </span>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard key={refreshKey} />}
        {activeTab === 'customers' && <CustomerList key={refreshKey} />}
        {activeTab === 'predictions' && <PredictionsChart key={refreshKey} />}
        {activeTab === 'add' && <CustomerForm onSubmit={handleAddCustomer} />}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Powered by Machine Learning | Scikit-learn • React • Supabase
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
