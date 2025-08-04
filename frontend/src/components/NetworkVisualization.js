import React from "react";

const NetworkVisualization = ({ nodes, links, packets }) => {
	const svgWidth = 600;
	const svgHeight = 400;

	// Calculate link utilization color
	const getLinkColor = (utilization) => {
		if (utilization > 80) return "#e74c3c"; // Red for high utilization
		if (utilization > 50) return "#f39c12"; // Orange for moderate utilization
		return "#95a5a6"; // Gray for low utilization
	};  

	// Get link class based on utilization
	const getLinkClass = (utilization) => {
		if (utilization > 80) return "link congested";
		if (utilization > 50) return "link moderate";
		return "link";
	};

	// Calculate queue size indicator
	const getQueueIndicator = (queueLength) => {
		if (queueLength === 0) return "";
		return `(${queueLength})`;
	};

	return (
		<div className="network-visualization">
			<h3>Network Topology</h3>
			<svg width={svgWidth} height={svgHeight} className="network-svg">
				{/* Render links */}
				{links.map((link) => {
					const fromNode = nodes.find((n) => n.id === link.from);
					const toNode = nodes.find((n) => n.id === link.to);

					if (!fromNode || !toNode) return null;

					const x1 = fromNode.position.x;
					const y1 = fromNode.position.y;
					const x2 = toNode.position.x;
					const y2 = toNode.position.y;

					// Calculate midpoint for label
					const midX = (x1 + x2) / 2;
					const midY = (y1 + y2) / 2;

					return (
						<g key={link.id}>
							<line
								x1={x1}
								y1={y1}
								x2={x2}
								y2={y2}
								className={getLinkClass(link.utilization)}
								stroke={getLinkColor(link.utilization)}
							/>
							<text
								x={midX}
								y={midY - 10}
								className="link-label"
								fontSize="10"
								textAnchor="middle">
								{`${Math.round(link.utilization)}%`}
							</text>
							<text
								x={midX}
								y={midY + 10}
								className="link-label"
								fontSize="8"
								textAnchor="middle"
								fill="#666">
								{`${link.capacity}pps`}
							</text>
						</g>
					);
				})}

				{/* Render nodes */}
				{nodes.map((node) => (
					<g key={node.id} className="node">
						<circle
							cx={node.position.x}
							cy={node.position.y}
							r={25}
							className="node-circle"
							fill={node.queueLength > 5 ? "#e74c3c" : "#3498db"}
						/>
						<text
							x={node.position.x}
							y={node.position.y}
							className="node-text">
							{node.id}
						</text>
						{/* Queue indicator */}
						{node.queueLength > 0 && (
							<text
								x={node.position.x}
								y={node.position.y + 40}
								className="link-label"
								fontSize="10"
								textAnchor="middle"
								fill="#e74c3c">
								Q: {node.queueLength}
							</text>
						)}
						{/* Traffic rate indicator */}
						<text
							x={node.position.x}
							y={node.position.y - 35}
							className="link-label"
							fontSize="10"
							textAnchor="middle"
							fill="#2c3e50">
							{node.trafficRate} pps
						</text>
					</g>
				))}

				{/* Render packets in transit */}
				{packets.slice(0, 20).map((packet, index) => {
					// Limit visible packets for performance
					const currentNode = nodes.find(
						(n) => n.id === packet.currentNode
					);
					if (!currentNode) return null;

					// Add some randomness to packet positions to avoid overlap
					const offsetX = (Math.random() - 0.5) * 40;
					const offsetY = (Math.random() - 0.5) * 40;

					return (
						<circle
							key={`${packet.id}-${index}`}
							cx={currentNode.position.x + offsetX}
							cy={currentNode.position.y + offsetY}
							r={3}
							className="packet"
							fill="#e74c3c"
						/>
					);
				})}
			</svg>

			<div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
				<div>
					<strong>Legend:</strong>
				</div>
				<div>• Circle color: Blue (normal), Red (high queue)</div>
				<div>
					• Link color: Gray (&lt;50%), Orange (50-80%), Red (&gt;80%
					utilization)
				</div>
				<div>• Red dots: Packets in transit</div>
				<div>• Q: Queue length at each node</div>
			</div>
		</div>
	);
};

export default NetworkVisualization;
