import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import NetworkVisualization from "./components/NetworkVisualization";
import SimulationControls from "./components/SimulationControls";
import StatsPanel from "./components/StatsPanel";
import NodeInfo from "./components/NodeInfo";

const BACKEND_URL =
	process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

function App() {
	const [socket, setSocket] = useState(null);
	const [networkData, setNetworkData] = useState(null);
	const [isConnected, setIsConnected] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Initialize socket connection
		const newSocket = io(BACKEND_URL);

		newSocket.on("connect", () => {
			console.log("Connected to server");
			setIsConnected(true);
			setError(null);
		});

		newSocket.on("disconnect", () => {
			console.log("Disconnected from server");
			setIsConnected(false);
		});

		newSocket.on("networkUpdate", (data) => {
			setNetworkData(data);
		});

		newSocket.on("connect_error", (err) => {
			console.error("Connection error:", err);
			setError(
				"Failed to connect to server. Please ensure the backend is running."
			);
		});

		setSocket(newSocket);

		// Cleanup on unmount
		return () => {
			newSocket.close();
		};
	}, []);

	const handleStartSimulation = () => {
		if (socket) {
			socket.emit("startSimulation");
		}
	};

	const handlePauseSimulation = () => {
		if (socket) {
			socket.emit("pauseSimulation");
		}
	};

	const handleResetSimulation = () => {
		if (socket) {
			socket.emit("resetSimulation");
		}
	};

	const handleUpdateTrafficRate = (nodeId, rate) => {
		if (socket) {
			socket.emit("updateTrafficRate", { nodeId, rate });
		}
	};

	const handleUpdateLinkCapacity = (linkId, capacity) => {
		if (socket) {
			socket.emit("updateLinkCapacity", { linkId, capacity });
		}
	};

	if (error) {
		return (
			<div className="app">
				<div className="header">
					<h1>Network Traffic Simulator</h1>
					<p>Real-time Telecom Network Simulation</p>
				</div>
				<div className="error">{error}</div>
			</div>
		);
	}

	if (!isConnected || !networkData) {
		return (
			<div className="app">
				<div className="header">
					<h1>Network Traffic Simulator</h1>
					<p>Real-time Telecom Network Simulation</p>
				</div>
				<div className="loading">
					Connecting to simulation server...
				</div>
			</div>
		);
	}

	return (
		<div className="app">
			<div className="header">
				<h1>Network Traffic Simulator</h1>
				<p>Telecom Network Simulation Dashboard</p>
				<div className="status-indicator-container">
					<span
						className={`status-indicator ${
							networkData.running
								? "status-running"
								: "status-paused"
						}`}></span>
					<span>
						{networkData.running
							? "Simulation Running"
							: "Simulation Paused"}
					</span>
				</div>
			</div>

			<div className="dashboard">
				<div className="main-content">
					<SimulationControls
						isRunning={networkData.running}
						onStart={handleStartSimulation}
						onPause={handlePauseSimulation}
						onReset={handleResetSimulation}
						onUpdateTrafficRate={handleUpdateTrafficRate}
						onUpdateLinkCapacity={handleUpdateLinkCapacity}
						nodes={networkData.nodes}
						links={networkData.links}
					/>

					<NetworkVisualization
						nodes={networkData.nodes}
						links={networkData.links}
						packets={networkData.packets}
					/>
				</div>

				<div className="sidebar">
					<StatsPanel stats={networkData.stats} />
					<NodeInfo nodes={networkData.nodes} />
				</div>
			</div>
		</div>
	);
}

export default App;
