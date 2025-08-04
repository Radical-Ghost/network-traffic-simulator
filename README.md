# Network Traffic Simulator

A real-time network traffic simulator built for telecom companies to visualize and analyze network performance with a 5-node topology.

## 📋 Project Overview

This project simulates network traffic in a telecommunications network with the following features:

### Key Features

-   **Real-time Simulation**: Live network traffic simulation with packet generation and routing
-   **Interactive Dashboard**: Responsive web interface with real-time updates
-   **Network Topology**: 5-node network (A, B, C, D, E) with configurable links
-   **Traffic Control**: Adjustable traffic generation rates and link capacities
-   **Performance Metrics**: Real-time statistics including latency, packet loss, and delivery rates
-   **Congestion Handling**: Queue management and packet dropping under high load

### Technical Stack

-   **Backend**: Node.js, Express.js, Socket.io
-   **Frontend**: React, CSS3, SVG for visualization
-   **Real-time Communication**: WebSocket connections
-   **Algorithm**: Shortest path routing (Floyd-Warshall)

## � Demo Video

Watch the Network Traffic Simulator in action:

[Video](https://github.com/Radical-Ghost/network-traffic-simulator/blob/main/recording.mp4)

## �🏗️ Architecture

### Backend Components

1. **NetworkSimulator.js**: Core simulation engine
2. **Express Server**: REST API endpoints
3. **Socket.io**: Real-time WebSocket communication
4. **Routing Algorithm**: Shortest path calculation

### Frontend Components

1. **App.js**: Main application component
2. **NetworkVisualization**: SVG-based network topology display
3. **SimulationControls**: Interactive simulation controls
4. **StatsPanel**: Real-time performance metrics
5. **NodeInfo**: Detailed node information

##

## 🛠️ Installation & Setup

### Prerequisites

-   Node.js (v14 or higher)
-   npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Default Configuration

-   **Nodes**: A, B, C, D, E
-   **Links**: 7 bidirectional connections
-   **Traffic Rate**: 5 packets/second per node
-   **Link Capacities**: 6-15 packets/second

## 🎮 How to Use

1. **Start Simulation**: Click "Start" to begin packet generation
2. **Monitor Traffic**: Watch real-time packet flow and network statistics
3. **Adjust Parameters**:
    - Change traffic generation rates (0-20 pps)
    - Modify link capacities (1-50 pps)
4. **Analyze Performance**: Monitor delivery rates, packet loss, and latency
5. **Reset**: Clear all statistics and return to default settings

## 📈 Performance Metrics

-   **Packets Generated**: Total packets created
-   **Packets Delivered**: Successfully routed packets
-   **Packets Dropped**: Packets lost due to congestion
-   **Delivery Rate**: Success percentage
-   **Packet Loss**: Loss percentage
-   **Average Latency**: Mean packet delivery time

### Simulation Parameters

-   Traffic generation rates: 0-20 packets/second
-   Link capacities: 1-50 packets/second
-   Maximum queue size: 10 packets per node
-   Simulation step interval: 1 second



## 📝 Assignment Requirements Checklist

✅ **Simulation Engine (Backend)**

-   Node.js and Express.js implementation
-   Multi-node network simulation
-   Packet transmission logic
-   Variable traffic loads

✅ **Visualization Dashboard (Frontend)**

-   React-based responsive UI
-   Graphical network topology
-   Real-time statistics display
-   Simulation controls

✅ **Data Management**

-   In-memory storage structures
-   JSON-based configuration
-   State persistence

✅ **Algorithm Implementation**

-   Shortest path routing
-   Network load calculation
-   Congestion control
-   Queue management

## �👨‍💻 Developer Information

**Name**: Soham Mandavkar  
**Roll Number**: A754  
**Email**: soham10098@gmail.com


