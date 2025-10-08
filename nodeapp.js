const path = require('path');
const approot = __dirname;
global.appRoot = require('path').resolve(__dirname);

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');

const { connectDB } = require(path.join(approot, 'config', 'db.config.js'));

const migrationRoutes = require(path.join(approot, 'server', 'api', 'routes', 'migrationRoutes.js'));


const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

// Routes
app.use("/api", require(path.join(approot, 'server', 'api', 'routes', 'mainroutes.js')));
app.use("/api/schema", require(path.join(approot, 'server', 'api', 'routes', 'schema.routes.js')));
app.use("/api/migrations", migrationRoutes);

console.log("✅ Routes loaded successfully");

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Global error handler:', err);
  if (!res.headersSent) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: err.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('API endpoint not found');
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(5004, '0.0.0.0', () => {
      console.log('🚀 Server is running on port 5004');
    });
  } catch (err) {
    console.error('❌ Error starting server:', err);
  }
};

startServer();
