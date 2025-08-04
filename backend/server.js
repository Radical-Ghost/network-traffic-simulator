const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const NetworkSimulator = require("./models/NetworkSimulator");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize the network simulator
const simulator = new NetworkSimulator();

// Socket.io connection handling
io.on("connection", (socket) => {
	console.log("Client connected:", socket.id);

	// Send initial network state
	socket.emit("networkUpdate", simulator.getNetworkState());

	// Handle simulation control commands
	socket.on("startSimulation", () => {
		simulator.start();
		console.log("Simulation started");
		// Broadcast updated state immediately
		io.emit("networkUpdate", simulator.getNetworkState());
	});

	socket.on("pauseSimulation", () => {
		simulator.pause();
		console.log("Simulation paused");
		// Broadcast updated state immediately
		io.emit("networkUpdate", simulator.getNetworkState());
	});

	socket.on("resetSimulation", () => {
		simulator.reset();
		socket.emit("networkUpdate", simulator.getNetworkState());
		console.log("Simulation reset");
	});

	socket.on("updateTrafficRate", (data) => {
		simulator.updateTrafficRate(data.nodeId, data.rate);
		console.log(
			`Traffic rate updated for node ${data.nodeId}: ${data.rate}`
		);
		// Broadcast updated state immediately
		io.emit("networkUpdate", simulator.getNetworkState());
	});

	socket.on("updateLinkCapacity", (data) => {
		simulator.updateLinkCapacity(data.linkId, data.capacity);
		console.log(
			`Link capacity updated for ${data.linkId}: ${data.capacity}`
		);
		// Broadcast updated state immediately
		io.emit("networkUpdate", simulator.getNetworkState());
	});

	socket.on("disconnect", () => {
		console.log("Client disconnected:", socket.id);
	});
});

// REST API endpoints
app.get("/api/network", (req, res) => {
	res.json(simulator.getNetworkState());
});

app.get("/api/stats", (req, res) => {
	res.json(simulator.getNetworkStats());
});

app.post("/api/simulation/start", (req, res) => {
	simulator.start();
	res.json({ message: "Simulation started" });
});

app.post("/api/simulation/pause", (req, res) => {
	simulator.pause();
	res.json({ message: "Simulation paused" });
});

app.post("/api/simulation/reset", (req, res) => {
	simulator.reset();
	res.json({ message: "Simulation reset" });
});

// Broadcast network updates to all connected clients
setInterval(() => {
	if (simulator.isRunning()) {
		simulator.simulateStep();
		const networkState = simulator.getNetworkState();

		// Debug logging
		const totalQueued = networkState.nodes.reduce(
			(sum, node) => sum + node.queueLength,
			0
		);
		if (totalQueued > 0 || networkState.stats.totalPacketsDropped > 0) {
			console.log(
				`Debug: Total packets in queues: ${totalQueued}, Dropped: ${networkState.stats.totalPacketsDropped}`
			);
		}

		io.emit("networkUpdate", networkState);
	}
}, 1000); // Update every second

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	console.log(`Network Traffic Simulator Backend started`);
});
