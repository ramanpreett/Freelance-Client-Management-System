import React from "react";

const FinancialSnapshot = ({ data }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPercentageChange = (current, previous) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  // Mock previous month data for comparison
  const previousMonthIncome = data.monthlyIncome * 0.85; // Mock 15% increase
  const incomeChange = getPercentageChange(data.monthlyIncome, previousMonthIncome);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Financial Snapshot</h3>
        <div className="text-sm text-gray-500">
          This Month
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(data.monthlyIncome)}
          </div>
          <div className="text-sm text-gray-600 mb-1">Monthly Income</div>
          <div className={`text-xs ${incomeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {incomeChange >= 0 ? '↗' : '↘'} {Math.abs(incomeChange)}% vs last month
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(data.pendingPayments)}
          </div>
          <div className="text-sm text-gray-600 mb-1">Pending Payments</div>
          <div className="text-xs text-gray-500">
            {data.pendingPayments > 0 ? 'Requires attention' : 'All caught up'}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(data.recurringRevenue)}
          </div>
          <div className="text-sm text-gray-600 mb-1">Recurring Revenue</div>
          <div className="text-xs text-gray-500">
            Monthly subscriptions
          </div>
        </div>
      </div>
      
      {/* Revenue by Client Chart */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4">Revenue by Client</h4>
        <div className="space-y-3">
          {data.revenueByClient.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No revenue data available</p>
              <p className="text-sm">Revenue will appear here as invoices are paid</p>
            </div>
          ) : (
            data.revenueByClient.slice(0, 5).map((client, index) => {
              const percentage = data.monthlyIncome > 0 
                ? (client.revenue / data.monthlyIncome * 100).toFixed(1)
                : 0;
              
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-800">{client.name}</span>
                      <span className="text-sm font-semibold text-green-600">
                        {formatCurrency(client.revenue)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{percentage}%</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      
      {/* Revenue by Platform */}
      <div>
        <h4 className="text-md font-semibold text-gray-800 mb-4">Revenue by Platform</h4>
        <div className="grid grid-cols-2 gap-4">
          {data.revenueByPlatform.length === 0 ? (
            <div className="col-span-2 text-center py-4 text-gray-500">
              No platform data available
            </div>
          ) : (
            data.revenueByPlatform.map((platform, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">{platform.platform}</span>
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(platform.revenue)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${data.monthlyIncome > 0 
                        ? (platform.revenue / data.monthlyIncome * 100) 
                        : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex gap-3">
          <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
            View Detailed Reports
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialSnapshot;


