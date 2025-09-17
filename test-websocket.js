const WebSocket = require('ws');

// Test WebSocket connection
const ws = new WebSocket('ws://localhost:8000?workflowId=test-workflow');

ws.on('open', function open() {
  console.log('✅ WebSocket connected successfully');
  console.log('Waiting for node status updates...');
});

ws.on('message', function message(data) {
  const update = JSON.parse(data);
  console.log('📡 Received status update:', update);
});

ws.on('close', function close() {
  console.log('❌ WebSocket disconnected');
});

ws.on('error', function error(err) {
  console.error('❌ WebSocket error:', err);
});

// Keep the connection alive for testing
setTimeout(() => {
  console.log('Test completed');
  ws.close();
}, 10000);
