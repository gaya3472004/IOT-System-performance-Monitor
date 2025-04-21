import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMQTTMetrics } from '../hooks/useMQTTMetrics';

function predictNextValue(values: number[]): number {
  if (values.length < 2) return values[0] || 0;
  const lastTwo = values.slice(-2);
  const trend = lastTwo[1] - lastTwo[0];
  return Math.max(0, Math.min(100, lastTwo[1] + trend));
}

export function Predictions() {
  const metrics = useMQTTMetrics();
  const [historicalData, setHistoricalData] = React.useState<any[]>([]);
  const [predictions, setPredictions] = React.useState<any[]>([]);

  React.useEffect(() => {
    setHistoricalData(prev => {
      const newData = [...prev, { ...metrics, timestamp: new Date().toISOString() }];
      return newData.slice(-30);
    });
  }, [metrics]);

  React.useEffect(() => {
    if (historicalData.length >= 2) {
      const cpuValues = historicalData.map(d => d.cpu);
      const memoryValues = historicalData.map(d => d.memory);
      const tempValues = historicalData.map(d => d.temperature);

      const nextTimestamp = new Date(Date.now() + 5000).toISOString();
      const prediction = {
        timestamp: nextTimestamp,
        cpu: predictNextValue(cpuValues),
        memory: predictNextValue(memoryValues),
        temperature: predictNextValue(tempValues)
      };

      setPredictions([...predictions.slice(-5), prediction]);
    }
  }, [historicalData]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Performance Predictions</h2>
        <p className="mt-1 text-sm text-gray-500">Forecasting system metrics based on historical trends</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">CPU Usage Prediction</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[...historicalData, ...predictions]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cpu" stroke="#2563eb" name="Actual CPU %" />
                <Line type="monotone" dataKey="cpu" stroke="#dc2626" name="Predicted CPU %" data={predictions} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">System Health Predictions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {predictions.slice(-1).map((prediction, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-50">
                <h4 className="text-sm font-medium text-gray-600">Predicted in 5 minutes</h4>
                <div className="mt-2 space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">CPU Usage:</span>
                    <span className="ml-2 font-semibold">{prediction.cpu.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Memory Usage:</span>
                    <span className="ml-2 font-semibold">{prediction.memory.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Temperature:</span>
                    <span className="ml-2 font-semibold">{prediction.temperature.toFixed(1)}°C</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}