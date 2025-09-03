import React from "react";

const PlatformInsights = ({ clients, revenueByPlatform }) => {
  const getPlatformStats = () => {
    const platformCounts = {};
    const activeClients = clients.filter(client => {
      const lastActivity = new Date(client.createdAt || Date.now());
      const daysSinceActivity = (new Date() - lastActivity) / (1000 * 60 * 60 * 24);
      return daysSinceActivity <= 30;
    });

    clients.forEach(client => {
      const source = client.source || 'Direct';
      platformCounts[source] = (platformCounts[source] || 0) + 1;
    });

    return {
      totalClients: clients.length,
      activeClients: activeClients.length,
      inactiveClients: clients.length - activeClients.length,
      platformCounts
    };
  };

  const stats = getPlatformStats();

  const getPlatformIcon = (platform) => {
    const icons = {
      'LinkedIn': '🔗',
      'Upwork': '💼',
      'Fiverr': '🎯',
      'Email': '📧',
      'Direct': '👤',
      'Manual': '✏️'
    };
    return icons[platform] || '📊';
  };

  const getPlatformColor = (platform) => {
    const colors = {
      'LinkedIn': 'bg-blue-100 text-blue-800',
      'Upwork': 'bg-green-100 text-green-800',
      'Fiverr': 'bg-purple-100 text-purple-800',
      'Email': 'bg-orange-100 text-orange-800',
      'Direct': 'bg-gray-100 text-gray-800',
      'Manual': 'bg-yellow-100 text-yellow-800'
    };
    return colors[platform] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Platform Insights</h3>
        <div className="text-sm text-gray-500">
          {stats.totalClients} total clients
        </div>
      </div>
      
      {/* Client Activity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Active Clients</span>
            <span className="text-2xl font-bold text-green-600">{stats.activeClients}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${stats.totalClients > 0 
                  ? (stats.activeClients / stats.totalClients * 100) 
                  : 0}%` 
              }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.totalClients > 0 
              ? `${((stats.activeClients / stats.totalClients) * 100).toFixed(1)}% of total`
              : 'No clients yet'
            }
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Inactive Clients</span>
            <span className="text-2xl font-bold text-orange-600">{stats.inactiveClients}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${stats.totalClients > 0 
                  ? (stats.inactiveClients / stats.totalClients * 100) 
                  : 0}%` 
              }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.totalClients > 0 
              ? `${((stats.inactiveClients / stats.totalClients) * 100).toFixed(1)}% of total`
              : 'No clients yet'
            }
          </div>
        </div>
      </div>
      
      {/* Platform Distribution */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4">Client Distribution by Platform</h4>
        <div className="space-y-3">
          {Object.entries(stats.platformCounts).length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No platform data available
            </div>
          ) : (
            Object.entries(stats.platformCounts)
              .sort(([,a], [,b]) => b - a)
              .map(([platform, count]) => {
                const percentage = stats.totalClients > 0 
                  ? (count / stats.totalClients * 100).toFixed(1)
                  : 0;
                
                return (
                  <div key={platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getPlatformIcon(platform)}</span>
                      <div>
                        <div className="font-medium text-gray-800">{platform}</div>
                        <div className="text-sm text-gray-500">{count} clients</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-600">{percentage}%</span>
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
        <div className="space-y-3">
          {revenueByPlatform.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No revenue data available
            </div>
          ) : (
            revenueByPlatform
              .sort((a, b) => b.revenue - a.revenue)
              .map((platform) => {
                const totalRevenue = revenueByPlatform.reduce((sum, p) => sum + p.revenue, 0);
                const percentage = totalRevenue > 0 
                  ? (platform.revenue / totalRevenue * 100).toFixed(1)
                  : 0;
                
                return (
                  <div key={platform.platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getPlatformIcon(platform.platform)}</span>
                      <div>
                        <div className="font-medium text-gray-800">{platform.platform}</div>
                        <div className="text-sm text-green-600 font-semibold">
                          ${platform.revenue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-600">{percentage}%</span>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>
      
      {/* Insights Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-md font-semibold text-gray-800 mb-3">Key Insights</h4>
        <div className="space-y-2 text-sm text-gray-600">
          {stats.totalClients > 0 && (
            <>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>
                  {Object.keys(stats.platformCounts).length} different platforms are bringing in clients
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>
                  {((stats.activeClients / stats.totalClients) * 100).toFixed(1)}% of clients are active
                </span>
              </div>
              {revenueByPlatform.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>
                    Top platform: {revenueByPlatform[0]?.platform} (${revenueByPlatform[0]?.revenue.toLocaleString()})
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlatformInsights;


