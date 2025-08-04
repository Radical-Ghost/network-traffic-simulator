import React from "react";

const StatsPanel = ({ stats }) => {
	const formatNumber = (num) => {
		return num ? num.toLocaleString() : "0";
	};

	const formatLatency = (latency) => {
		return latency ? `${Math.round(latency)}ms` : "0ms";
	};

	const calculatePacketLoss = () => {
		const total = stats.totalPacketsGenerated;
		const dropped = stats.totalPacketsDropped;
		if (total === 0) return "0%";
		return `${((dropped / total) * 100).toFixed(1)}%`;
	};

	const calculateDeliveryRate = () => {
		const total = stats.totalPacketsGenerated;
		const delivered = stats.totalPacketsDelivered;
		if (total === 0) return "0%";
		return `${((delivered / total) * 100).toFixed(1)}%`;
	};

	return (
		<div className="stats-panel">
			<h3>Network Statistics</h3>

			<div className="stat-item">
				<span className="stat-label">Packets Generated:</span>
				<span className="stat-value">
					{formatNumber(stats.totalPacketsGenerated)}
				</span>
			</div>

			<div className="stat-item">
				<span className="stat-label">Packets Delivered:</span>
				<span className="stat-value">
					{formatNumber(stats.totalPacketsDelivered)}
				</span>
			</div>

			<div className="stat-item">
				<span className="stat-label">Packets Dropped:</span>
				<span className="stat-value">
					{formatNumber(stats.totalPacketsDropped)}
				</span>
			</div>

			<div className="stat-item">
				<span className="stat-label">Delivery Rate:</span>
				<span className="stat-value" style={{ color: "#27ae60" }}>
					{calculateDeliveryRate()}
				</span>
			</div>

			<div className="stat-item">
				<span className="stat-label">Packet Loss:</span>
				<span className="stat-value" style={{ color: "#e74c3c" }}>
					{calculatePacketLoss()}
				</span>
			</div>

			<div className="stat-item">
				<span className="stat-label">Avg Latency:</span>
				<span className="stat-value">
					{formatLatency(stats.averageLatency)}
				</span>
			</div>

			<div
				style={{
					marginTop: "15px",
					fontSize: "16px",
					color: "#b8b8b8",
					fontWeight: "500",
				}}>
				<div>
					<strong>Performance Indicators:</strong>
				</div>
				<div>• Delivery Rate: Higher is better</div>
				<div>• Packet Loss: Lower is better</div>
				<div>• Latency: Lower is better</div>
			</div>
		</div>
	);
};

export default StatsPanel;
