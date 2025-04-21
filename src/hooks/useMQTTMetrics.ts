import { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import { SystemMetrics } from '../types';

const MQTT_BROKER_URL = 'ws://broker.emqx.io:8083/mqtt'; // Updated broker URL
const MQTT_TOPIC = 'system/metrics'; // Topic remains the same

export function useMQTTMetrics(): SystemMetrics {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
    temperature: 0,
    battery:0,
    uptime: 0,
    wifi_speed: 0,
    process_count: 0
  });

  useEffect(() => {
    const client = mqtt.connect(MQTT_BROKER_URL);

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.subscribe(MQTT_TOPIC);
    });

    client.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        setMetrics(prevMetrics => ({
          ...prevMetrics,
          ...data
        }));
      } catch (error) {
        console.error('Error parsing MQTT message:', error);
      }
    });

    client.on('error', (error) => {
      console.error('MQTT connection error:', error);
    });

    return () => {
      client.end();
    };
  }, []);

  return metrics;
}