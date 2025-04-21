import { Cpu, HardDrive, MemoryStick as Memory, Network, Thermometer, Timer } from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { useMQTTMetrics } from '../hooks/useMQTTMetrics';
import { Battery } from 'lucide-react';

export function Dashboard() {
  const metrics = useMQTTMetrics();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">System Performance Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">Monitor your system's real-time performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="CPU Usage"
          value={metrics.cpu}
          unit="%"
          icon={<Cpu className="h-6 w-6 text-blue-600" />}
        />
        <MetricCard
          title="Memory Usage"
          value={metrics.memory}
          unit="%"
          icon={<Memory className="h-6 w-6 text-blue-600" />}
        />
        <MetricCard
          title="Disk Usage"
          value={metrics.disk}
          unit="%"
          icon={<HardDrive className="h-6 w-6 text-blue-600" />}
        />
        <MetricCard
          title="Network Activity"
          value={metrics.network}
          unit="MB/s"
          icon={<Network className="h-6 w-6 text-blue-600" />}
        />
        <MetricCard
          title="Wifi Speed"
          value={metrics.wifi_speed}
          unit="Kbps"
          icon={<Network className="h-6 w-6 text-blue-600" />}
        />
        <MetricCard
          title="Temperature"
          value={metrics.temperature}
          unit="°C"
          icon={<Thermometer className="h-6 w-6 text-blue-600" />}
        />
        <MetricCard
          title="Battery Percentage"
          value={metrics.battery}
          unit="%"
          icon={<Battery className="h-6 w-6 text-blue-600" />}
        />
        
        <MetricCard
          title="Uptime"
          value={metrics.uptime}
          unit="hours"
          icon={<Timer className="h-6 w-6 text-blue-600" />}
        />
         <MetricCard
          title="Process Count"
          value={metrics.process_count}
          unit=""
          icon={<Cpu className="h-6 w-6 text-blue-600" />}
          />
      </div>
    </div>
  );
}