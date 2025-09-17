import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';

export interface NodeStatusUpdate {
  workflowId: string;
  nodeId: string;
  status: 'processing' | 'completed' | 'error';
  timestamp: number;
  error?: string;
}

class WebSocketManager {
  private wss: WebSocketServer;
  private clients: Map<string, WebSocket> = new Map();

  constructor(server: any) {
    this.wss = new WebSocketServer({ server });
    this.setupWebSocketServer();
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      const url = new URL(req.url!, `http://${req.headers.host}`);
      const workflowId = url.searchParams.get('workflowId');
      
      if (workflowId) {
        this.clients.set(workflowId, ws);
        console.log(`Client connected for workflow: ${workflowId}`);
      }

      ws.on('close', () => {
        if (workflowId) {
          this.clients.delete(workflowId);
          console.log(`Client disconnected for workflow: ${workflowId}`);
        }
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        if (workflowId) {
          this.clients.delete(workflowId);
        }
      });
    });
  }

  public broadcastNodeStatus(update: NodeStatusUpdate) {
    const client = this.clients.get(update.workflowId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(update));
      console.log(`Broadcasted status for node ${update.nodeId}: ${update.status}`);
    }
  }

  public broadcastToWorkflow(workflowId: string, message: any) {
    const client = this.clients.get(workflowId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }
}

export default WebSocketManager;
