import React from "react";

const NodeInfo = ({ nodes }) => {
	const getNodeStatusText = (node) => {
		if (node.queueLength > 8) return "Congested";
		if (node.queueLength > 4) return "Busy";
		return "Normal";
	};

	const getNodeStatusClass = (node) => {
		if (node.queueLength > 8) return "node-status-congested";
		if (node.queueLength > 4) return "node-status-busy";
		return "node-status-normal";
	};

	return (
		<div className="node-info">
			<h3>Node Information</h3>

			<div className="node-list">
				{nodes.map((node) => (
					<div key={node.id} className="node-item">
						<h4>
							Node {node.id}
							<span
								className={`node-status-badge ${getNodeStatusClass(
									node
								)}`}>
								{getNodeStatusText(node)}
							</span>
						</h4>

						<div className="node-stats">
							<div className="node-stat-item">
								<span className="node-stat-label">
									Traffic Rate:
								</span>
								<span className="node-stat-value">
									{node.trafficRate} pps
								</span>
							</div>
							<div className="node-stat-item">
								<span className="node-stat-label">Queue:</span>
								<span className="node-stat-value">
									{node.queueLength}
								</span>
							</div>
							<div className="node-stat-item">
								<span className="node-stat-label">
									Generated:
								</span>
								<span className="node-stat-value">
									{node.packetsGenerated}
								</span>
							</div>
							<div className="node-stat-item">
								<span className="node-stat-label">
									Received:
								</span>
								<span className="node-stat-value">
									{node.packetsReceived}
								</span>
							</div>
							<div className="node-stat-item">
								<span className="node-stat-label">
									Dropped:
								</span>
								<span className="node-stat-value">
									{node.packetsDropped}
								</span>
							</div>
							<div className="node-stat-item">
								<span className="node-stat-label">
									Position:
								</span>
								<span className="node-stat-value">
									({node.position.x}, {node.position.y})
								</span>
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="node-legend">
				<div className="node-legend-title">Status Legend</div>
				<div className="node-legend-item">
					<div
						className="node-legend-color"
						style={{ backgroundColor: "#27ae60" }}></div>
					<span>Normal Operation</span>
				</div>
				<div className="node-legend-item">
					<div
						className="node-legend-color"
						style={{ backgroundColor: "#f39c12" }}></div>
					<span>Moderate Load</span>
				</div>
				<div className="node-legend-item">
					<div
						className="node-legend-color"
						style={{ backgroundColor: "#e74c3c" }}></div>
					<span>High Congestion</span>
				</div>
			</div>
		</div>
	);
};

export default NodeInfo;
