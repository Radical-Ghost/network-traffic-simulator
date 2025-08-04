import React from "react";

const NodeInfo = ({ nodes }) => {
	const getNodeStatusColor = (node) => {
		if (node.queueLength > 8) return "#e74c3c"; // Red for high congestion
		if (node.queueLength > 4) return "#f39c12"; // Orange for moderate congestion
		return "#27ae60"; // Green for normal
	};

	const getNodeStatusText = (node) => {
		if (node.queueLength > 8) return "Congested";
		if (node.queueLength > 4) return "Busy";
		return "Normal";
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
								style={{
									marginLeft: "10px",
									fontSize: "12px",
									color: getNodeStatusColor(node),
									fontWeight: "normal",
								}}>
								({getNodeStatusText(node)})
							</span>
						</h4>

						<div className="node-stats">
							<div>Traffic Rate: {node.trafficRate} pps</div>
							<div>Queue Length: {node.queueLength}</div>
							<div>Generated: {node.packetsGenerated}</div>
							<div>Received: {node.packetsReceived}</div>
							<div>Dropped: {node.packetsDropped}</div>
							<div>
								Position: ({node.position.x}, {node.position.y})
							</div>
						</div>
					</div>
				))}
			</div>

			<div style={{ marginTop: "15px", fontSize: "11px", color: "#666" }}>
				<div>
					<strong>Node Status:</strong>
				</div>
				<div>
					• <span style={{ color: "#27ae60" }}>Green</span>: Normal
					operation
				</div>
				<div>
					• <span style={{ color: "#f39c12" }}>Orange</span>: Moderate
					load
				</div>
				<div>
					• <span style={{ color: "#e74c3c" }}>Red</span>: High
					congestion
				</div>
			</div>
		</div>
	);
};

export default NodeInfo;
