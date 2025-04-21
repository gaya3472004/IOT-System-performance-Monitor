import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useMQTTMetrics } from '../hooks/useMQTTMetrics';

export function Visualizations() {
  const metrics = useMQTTMetrics();
  const [historicalData, setHistoricalData] = React.useState<any[]>([]);

  React.useEffect(() => {
    setHistoricalData(prev => {
      const newData = [...prev, { ...metrics, timestamp: new Date().toISOString() }];
      return newData.slice(-30); // Keep last 30 data points
    });
  }, [metrics]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">System Metrics Visualization</h2>
        <p className="mt-1 text-sm text-gray-500">Real-time performance trends and historical data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU & Memory Usage */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">CPU & Memory Usage</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={formatTimestamp} />
                <YAxis />
                <Tooltip labelFormatter={formatTimestamp} />
                <Legend />
                <Area type="monotone" dataKey="cpu" stroke="#2563eb" fill="#2563eb" name="CPU %" />
                <Area type="monotone" dataKey="memory" stroke="#004b" fill="#004b" name="Memory %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
    
        {/* Wifi Speed & Network */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Wifi Speed & Network</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={formatTimestamp} />
                <YAxis />
                <Tooltip labelFormatter={formatTimestamp} />
                <Legend />
                <Area type="monotone" dataKey="wifi_speed" stroke="#dc2626" fill="#f87171" name="Wifi Speed Kbps" />
                <Area type="monotone" dataKey="network" stroke="#059669" fill="#34d399" name="Network MB/s" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}