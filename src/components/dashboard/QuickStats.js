import React from 'react';

const QuickStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Clients',
      value: stats.totalClients,
      icon: '👥',
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      icon: '🚀',
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Pending Invoices',
      value: stats.pendingInvoices,
      icon: '📄',
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    },
    {
      title: 'Upcoming Meetings',
      value: stats.upcomingMeetings,
      icon: '📅',
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {stat.title}
              </p>
              <p className={`text-3xl font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center`}>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
          
          {/* Optional: Add trend indicator */}
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500 mr-1">↗</span>
            <span className="text-gray-500">+12% from last month</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;

