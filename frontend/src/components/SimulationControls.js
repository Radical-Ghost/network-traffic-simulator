import React, { useState } from "react";

const SimulationControls = ({
	isRunning,
	onStart,
	onPause,
	onReset,
	onUpdateTrafficRate,
	onUpdateLinkCapacity,
	nodes,
	links,
}) => {
	const [selectedNode, setSelectedNode] = useState("A");
	const [trafficRate, setTrafficRate] = useState(5);
	const [selectedLink, setSelectedLink] = useState("");
	const [linkCapacity, setLinkCapacity] = useState(10);

	const handleTrafficRateUpdate = () => {
		onUpdateTrafficRate(selectedNode, parseInt(trafficRate));
	};

	const handleLinkCapacityUpdate = () => {
		if (selectedLink) {
			onUpdateLinkCapacity(selectedLink, parseInt(linkCapacity));
		}
	};

	const handleNodeChange = (nodeId) => {
		setSelectedNode(nodeId);
		const node = nodes.find((n) => n.id === nodeId);
		if (node) {
			setTrafficRate(node.trafficRate);
		}
	};

	const handleLinkChange = (linkId) => {
		setSelectedLink(linkId);
		const link = links.find((l) => l.id === linkId);
		if (link) {
			setLinkCapacity(link.capacity);
		}
	};

	return (
		<div className="controls">
			<h3>Simulation Controls</h3>

			<div className="control-buttons">
				<button
					className={`btn ${
						isRunning ? "btn-warning" : "btn-primary"
					}`}
					onClick={isRunning ? onPause : onStart}>
					{isRunning ? "Pause" : "Start"}
				</button>
				<button className="btn btn-danger" onClick={onReset}>
					Reset
				</button>
			</div>

			<div className="parameter-controls">
				<div className="control-group">
					<label>Node Traffic Rate</label>
					<select
						value={selectedNode}
						onChange={(e) => handleNodeChange(e.target.value)}>
						{nodes.map((node) => (
							<option key={node.id} value={node.id}>
								Node {node.id}
							</option>
						))}
					</select>
					<input
						type="number"
						min="0"
						max="20"
						value={trafficRate}
						onChange={(e) => setTrafficRate(e.target.value)}
						placeholder="Packets/sec"
					/>
					<button
						className="btn btn-primary"
						onClick={handleTrafficRateUpdate}
						style={{ marginTop: "5px" }}>
						Update Rate
					</button>
				</div>

				<div className="control-group">
					<label>Link Capacity</label>
					<select
						value={selectedLink}
						onChange={(e) => handleLinkChange(e.target.value)}>
						<option value="">Select Link</option>
						{links.map((link) => (
							<option key={link.id} value={link.id}>
								{link.from} → {link.to}
							</option>
						))}
					</select>
					<input
						type="number"
						min="1"
						max="50"
						value={linkCapacity}
						onChange={(e) => setLinkCapacity(e.target.value)}
						placeholder="Packets/sec"
						disabled={!selectedLink}
					/>
					<button
						className="btn btn-primary"
						onClick={handleLinkCapacityUpdate}
						disabled={!selectedLink}
						style={{ marginTop: "5px" }}>
						Update Capacity
					</button>
				</div>
			</div>

			<div
				style={{
					marginTop: "15px",
					fontSize: "16px",
					color: "#b8b8b8",
					fontWeight: "500",
				}}>
				<div>
					<strong>Instructions:</strong>
				</div>
				<div>• Use Start/Pause to control simulation</div>
				<div>• Adjust traffic rates (0-20 packets/sec)</div>
				<div>• Modify link capacities (1-50 packets/sec)</div>
				<div>• Reset to restore default parameters</div>
			</div>
		</div>
	);
};

export default SimulationControls;
