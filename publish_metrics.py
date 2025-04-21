import psutil
import paho.mqtt.client as mqtt
import time
import json
import psycopg2
from flask import Flask, jsonify
import threading
from flask_cors import CORS

BROKER = "broker.emqx.io"
PORT = 1883
TOPIC = "system/metrics"

# Database connection details
DB_HOST = "localhost"
DB_PORT = 5432
DB_NAME = "metrics_db"
DB_USER = "postgres"
DB_PASSWORD = "postgres"

app = Flask(__name__)  # Initialize Flask app
CORS(app)

def get_system_metrics():
    battery = psutil.sensors_battery()
    battery_percent = battery.percent if battery else None
    
    net_io_start = psutil.net_io_counters()
    time.sleep(1)  # Measure over 1 second
    net_io_end = psutil.net_io_counters()

    # Calculate WiFi speed (upload + download)
    total_bytes_sent = net_io_end.bytes_sent - net_io_start.bytes_sent
    total_bytes_recv = net_io_end.bytes_recv - net_io_start.bytes_recv
    wifi_speed = round((total_bytes_sent + total_bytes_recv) * 8 / 1_000, 2)  # Convert to Mbps

    return {
        "cpu": psutil.cpu_percent(interval=1),
        "memory": psutil.virtual_memory().percent,
        "disk": psutil.disk_usage('/').percent,
        "network": round(psutil.net_io_counters().bytes_sent / (1024 * 1024), 2),  # MB sent
        "temperature": 42,
        "battery": battery_percent,
        "uptime": int(time.time() - psutil.boot_time()) // 3600,
        "wifi_speed": wifi_speed,
        "process_count": len(psutil.pids())
    }

def save_to_database(metrics):
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cursor = conn.cursor()
        query = """
        INSERT INTO system_metrics (cpu, memory, disk, network, temperature, battery, uptime, wifi_speed, process_count, timestamp)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
        """
        cursor.execute(query, (
            metrics["cpu"],
            metrics["memory"],
            metrics["disk"],
            metrics["network"],
            metrics["temperature"],
            metrics["battery"],
            metrics["uptime"],
            metrics["wifi_speed"],
            metrics["process_count"]
        ))
        conn.commit()
        cursor.close()
        conn.close()
        print("Data inserted successfully")
    except Exception as e:
        print(f"Error saving to database: {e}")

# Flask route to fetch data from the database
@app.route('/api/reports', methods=['GET'])
def get_reports():
    """Fetch all system metrics data from the database."""
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        query = "SELECT timestamp, cpu, memory, disk, battery FROM system_metrics ORDER BY timestamp DESC LIMIT 100;"
        cursor = conn.cursor()
        cursor.execute(query)
        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        data = [dict(zip(columns, row)) for row in rows]
        cursor.close()
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'SimpleCache'})

@app.route('/api/analytics/summary', methods=['GET'])
@cache.cached(timeout=60)
def get_summary():
    """Fetch summary statistics for metrics."""
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        query = """
        SELECT 
            MIN(cpu) AS min_cpu, MAX(cpu) AS max_cpu, AVG(cpu) AS avg_cpu,
            MIN(memory) AS min_memory, MAX(memory) AS max_memory, AVG(memory) AS avg_memory,
            MIN(disk) AS min_disk, MAX(disk) AS max_disk, AVG(disk) AS avg_disk,
            MIN(battery) AS min_battery, MAX(battery) AS max_battery, AVG(battery) AS avg_battery
        FROM system_metrics;
        """
        cursor = conn.cursor()
        cursor.execute(query)
        result = cursor.fetchone()
        summary = {
            "cpu": {"min": result[0], "max": result[1], "avg": result[2]},
            "memory": {"min": result[3], "max": result[4], "avg": result[5]},
            "disk": {"min": result[6], "max": result[7], "avg": result[8]},
            "battery": {"min": result[9], "max": result[10], "avg": result[11]},
        }
        cursor.close()
        conn.close()
        return jsonify(summary)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/analytics/trends', methods=['GET'])
def get_trends():
    """Fetch historical trends for metrics."""
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        query = """
        SELECT 
            date_trunc('minute', timestamp) AS time_interval,
            AVG(cpu) AS avg_cpu,
            AVG(memory) AS avg_memory,
            AVG(disk) AS avg_disk,
            AVG(battery) AS avg_battery
        FROM system_metrics
        GROUP BY time_interval
        ORDER BY time_interval;
        """
        cursor = conn.cursor()
        cursor.execute(query)
        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        data = [dict(zip(columns, row)) for row in rows]
        cursor.close()
        conn.close()
        return jsonify(data)
    except Exception as e:
        print(f"Error in /api/analytics/trends: {e}")
        return jsonify({"error": str(e)}), 500

def publish_metrics():
    client = mqtt.Client()
    client.connect(BROKER, PORT, 60)

    try:
        while True:
            metrics = get_system_metrics()
            client.publish(TOPIC, json.dumps(metrics))
            save_to_database(metrics)
            print(f"Published and saved: {metrics}")
            time.sleep(5)  # Publish every 5 seconds
    except KeyboardInterrupt:
        print("Stopped publishing metrics.")
    finally:
        client.disconnect()

# Start the Flask app in a separate thread
def start_flask_app():
    app.run(debug=True, use_reloader=False)

if __name__ == "__main__":
    # Start the Flask app in a separate thread
    flask_thread = threading.Thread(target=start_flask_app)
    flask_thread.start()

    # Start publishing metrics
    publish_metrics()

# Removed JavaScript code. It has been moved to a separate file named 'downloadPDF.js'.
