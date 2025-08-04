const { v4: uuidv4 } = require("uuid");

class NetworkSimulator {
	constructor() {
		this.nodes = new Map();
		this.links = new Map();
		this.packets = [];
		this.running = false;
		this.stats = {
			totalPacketsGenerated: 0,
			totalPacketsDelivered: 0,
			totalPacketsDropped: 0,
			averageLatency: 0,
		};

		this.initializeNetwork();
	}

	initializeNetwork() {
		const nodeIds = ["A", "B", "C", "D", "E"];

		nodeIds.forEach((id) => {
			// High traffic configuration to demonstrate congestion
			let trafficRate;
			if (id === "A") {
				trafficRate = 15; // Very busy data center
			} else if (id === "E") {
				trafficRate = 12; // Major traffic hub
			} else if (id === "C") {
				trafficRate = 10; // Central router under load
			} else {
				trafficRate = 8; // Edge nodes with significant traffic
			}

			this.nodes.set(id, {
				id: id,
				position: this.getNodePosition(id),
				trafficRate: trafficRate,
				queue: [],
				queueLength: 0,
				packetsGenerated: 0,
				packetsReceived: 0,
				packetsDropped: 0,
			});
		});

		// Define network topology with lower capacities to create congestion
		const linkConnections = [
			{ from: "A", to: "B", capacity: 3 }, // Bottleneck link
			{ from: "A", to: "C", capacity: 4 }, // Limited capacity
			{ from: "B", to: "C", capacity: 5 }, // Moderate capacity
			{ from: "B", to: "D", capacity: 2 }, // Major bottleneck
			{ from: "C", to: "D", capacity: 4 }, // Limited alternative
			{ from: "C", to: "E", capacity: 3 }, // Bottleneck to E
			{ from: "D", to: "E", capacity: 3 }, // Limited final path
		];

		linkConnections.forEach((link) => {
			const linkId = `${link.from}-${link.to}`;
			this.links.set(linkId, {
				id: linkId,
				from: link.from,
				to: link.to,
				capacity: link.capacity,
				currentLoad: 0,
				packetsInTransit: [],
				utilization: 0,
			});
		});

		this.buildRoutingTable();
	}

	getNodePosition(nodeId) {
		const positions = {
			A: { x: 150, y: 130 },
			B: { x: 400, y: 130 },
			C: { x: 275, y: 275 },
			D: { x: 550, y: 275 },
			E: { x: 400, y: 420 },
		};
		return positions[nodeId] || { x: 0, y: 0 };
	}

	buildRoutingTable() {
		this.routingTable = new Map();
		const nodeIds = Array.from(this.nodes.keys());
		const dist = {};
		const next = {};

		nodeIds.forEach((i) => {
			dist[i] = {};
			next[i] = {};
			nodeIds.forEach((j) => {
				if (i === j) {
					dist[i][j] = 0;
				} else {
					dist[i][j] = Infinity;
				}
				next[i][j] = null;
			});
		});

		this.links.forEach((link) => {
			dist[link.from][link.to] = 1;
			dist[link.to][link.from] = 1;
			next[link.from][link.to] = link.to;
			next[link.to][link.from] = link.from;
		});

		nodeIds.forEach((k) => {
			nodeIds.forEach((i) => {
				nodeIds.forEach((j) => {
					if (dist[i][k] + dist[k][j] < dist[i][j]) {
						dist[i][j] = dist[i][k] + dist[k][j];
						next[i][j] = next[i][k];
					}
				});
			});
		});

		this.routingTable = next;
	}

	getNextHop(from, to) {
		return this.routingTable[from][to];
	}

	generatePacket(sourceNode) {
		const nodeIds = Array.from(this.nodes.keys());
		const destinationNodes = nodeIds.filter((id) => id !== sourceNode);
		const destination =
			destinationNodes[
				Math.floor(Math.random() * destinationNodes.length)
			];

		return {
			id: uuidv4(),
			source: sourceNode,
			destination: destination,
			currentNode: sourceNode,
			createdAt: Date.now(),
			hops: 0,
		};
	}

	simulateStep() {
		if (!this.running) return;

		// Reset link loads for this simulation step
		this.links.forEach((link) => {
			link.currentLoad = 0;
			link.packetsInTransit = [];
		});

		// Generate new packets at each node
		this.nodes.forEach((node, nodeId) => {
			// Generate packets based on traffic rate with some randomness
			const basePackets = Math.floor(node.trafficRate / 2); // Reduce intensity for gradual buildup
			const probabilityForExtra = node.trafficRate / 2 - basePackets;

			// Generate guaranteed packets
			for (let i = 0; i < basePackets; i++) {
				const packet = this.generatePacket(nodeId);
				this.packets.push(packet);
				node.packetsGenerated++;
				this.stats.totalPacketsGenerated++;
			}

			// Generate probabilistic extra packet
			if (Math.random() < probabilityForExtra) {
				const packet = this.generatePacket(nodeId);
				this.packets.push(packet);
				node.packetsGenerated++;
				this.stats.totalPacketsGenerated++;
			}
		});

		// Process queued packets first - they get priority
		this.processQueuedPackets();

		// Process new packets
		this.processPackets();

		// Update link utilization based on final loads
		this.updateLinkUtilization();

		// Update node queue lengths for display
		this.updateNodeQueueLengths();
	}

	processPackets() {
		const packetsToRemove = [];

		this.packets.forEach((packet, index) => {
			if (packet.currentNode === packet.destination) {
				// Packet reached destination
				const destinationNode = this.nodes.get(packet.destination);
				destinationNode.packetsReceived++;
				this.stats.totalPacketsDelivered++;

				// Calculate latency
				const latency = Date.now() - packet.createdAt;
				this.updateAverageLatency(latency);

				packetsToRemove.push(index);
			} else {
				// Route packet to next hop
				const nextHop = this.getNextHop(
					packet.currentNode,
					packet.destination
				);
				if (nextHop) {
					const linkId = `${packet.currentNode}-${nextHop}`;
					const reverseLink = `${nextHop}-${packet.currentNode}`;
					const link =
						this.links.get(linkId) || this.links.get(reverseLink);

					if (link && link.currentLoad < link.capacity) {
						// Packet can be transmitted
						packet.currentNode = nextHop;
						packet.hops++;
						link.currentLoad++;
						link.packetsInTransit.push(packet);
						// Keep packet in main array - don't remove it
					} else {
						// Link is congested, add to queue or drop
						const currentNode = this.nodes.get(packet.currentNode);
						if (currentNode.queue.length < 10) {
							// Max queue size - add to queue
							currentNode.queue.push(packet);
							packetsToRemove.push(index); // Remove from main array
							console.log(
								`Packet queued at node ${
									packet.currentNode
								}, queue length now: ${
									currentNode.queue.length + 1
								}`
							);
						} else {
							// Drop packet - queue is full
							currentNode.packetsDropped++;
							this.stats.totalPacketsDropped++;
							packetsToRemove.push(index);
							console.log(
								`Packet dropped at node ${packet.currentNode} - queue full`
							);
						}
					}
				} else {
					// No route available - drop packet
					const currentNode = this.nodes.get(packet.currentNode);
					currentNode.packetsDropped++;
					this.stats.totalPacketsDropped++;
					packetsToRemove.push(index);
				}
			}
		});

		// Remove processed packets
		packetsToRemove.reverse().forEach((index) => {
			this.packets.splice(index, 1);
		});
	}
	updateLinkUtilization() {
		this.links.forEach((link) => {
			link.utilization = (link.currentLoad / link.capacity) * 100;
		});
	}

	processQueuedPackets() {
		this.nodes.forEach((node, nodeId) => {
			const packetsToRetry = [];
			const initialQueueLength = node.queue.length;
			let processedThisStep = 0;
			const maxProcessPerStep = 2; // Limit queue processing to make congestion more persistent

			// Try to route queued packets (limited per step)
			while (
				node.queue.length > 0 &&
				processedThisStep < maxProcessPerStep
			) {
				const packet = node.queue.shift();
				processedThisStep++;

				// Try to route the packet
				const nextHop = this.getNextHop(
					packet.currentNode,
					packet.destination
				);
				if (nextHop) {
					const linkId = `${packet.currentNode}-${nextHop}`;
					const reverseLink = `${nextHop}-${packet.currentNode}`;
					const link =
						this.links.get(linkId) || this.links.get(reverseLink);

					if (link && link.currentLoad < link.capacity) {
						// Can transmit - move packet
						packet.currentNode = nextHop;
						packet.hops++;
						link.currentLoad++;
						link.packetsInTransit.push(packet);
						this.packets.push(packet);
					} else {
						// Still congested - put back in queue
						packetsToRetry.push(packet);
					}
				} else {
					// No route - put back in queue
					packetsToRetry.push(packet);
				}
			}

			// Add remaining unprocessed packets back to retry list
			while (node.queue.length > 0) {
				packetsToRetry.push(node.queue.shift());
			}

			// Put unrouted packets back in queue
			node.queue = packetsToRetry;

			// Debug logging for queue changes
			if (initialQueueLength > 0 || packetsToRetry.length > 0) {
				console.log(
					`Node ${nodeId}: Queue ${initialQueueLength} -> ${packetsToRetry.length} (processed: ${processedThisStep})`
				);
			}
		});
	}

	updateNodeQueueLengths() {
		this.nodes.forEach((node) => {
			node.queueLength = node.queue.length;
		});
	}

	updateAverageLatency(newLatency) {
		const totalDelivered = this.stats.totalPacketsDelivered;
		if (totalDelivered === 0) {
			this.stats.averageLatency = newLatency;
		} else {
			this.stats.averageLatency =
				(this.stats.averageLatency * (totalDelivered - 1) +
					newLatency) /
				totalDelivered;
		}
	}
	start() {
		this.running = true;
	}

	pause() {
		this.running = false;
	}

	reset() {
		this.running = false;
		this.packets = [];
		this.stats = {
			totalPacketsGenerated: 0,
			totalPacketsDelivered: 0,
			totalPacketsDropped: 0,
			averageLatency: 0,
		};

		// Reset node stats
		this.nodes.forEach((node) => {
			node.queue = [];
			node.queueLength = 0;
			node.packetsGenerated = 0;
			node.packetsReceived = 0;
			node.packetsDropped = 0;
		});

		// Reset link stats
		this.links.forEach((link) => {
			link.currentLoad = 0;
			link.packetsInTransit = [];
			link.utilization = 0;
		});
	}

	isRunning() {
		return this.running;
	}

	updateTrafficRate(nodeId, rate) {
		const node = this.nodes.get(nodeId);
		if (node) {
			node.trafficRate = rate;
		}
	}

	updateLinkCapacity(linkId, capacity) {
		const link = this.links.get(linkId);
		if (link) {
			link.capacity = capacity;
		}
	}

	getNetworkState() {
		return {
			nodes: Array.from(this.nodes.values()),
			links: Array.from(this.links.values()),
			packets: this.packets,
			running: this.running,
			stats: this.stats,
		};
	}

	getNetworkStats() {
		return this.stats;
	}
}

module.exports = NetworkSimulator;
