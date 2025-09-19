import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { createClient } from "redis";

export interface NodeStatusUpdate {
  workflowId: string;
  nodeId: string;
  status: "processing" | "completed" | "error";
  timestamp: number;
  error?: string;
  result?: any;
}

class WebSocketManager {
  private wss: WebSocketServer;
  private clients: Map<string, WebSocket> = new Map();
  private redisSub;

  constructor(server: any) {
    this.wss = new WebSocketServer({ server });
    this.redisSub = createClient();
    this.initializeRedis();
    this.setupWebSocketServer();
  }

  private async initializeRedis() {
    try {
      await this.redisSub.connect();
      console.log("Redis subscriber connected");
    } catch (error) {
      console.error("Redis connection error:", error);
    }
  }

  private setupWebSocketServer() {
    this.wss.on("connection", async (ws: WebSocket, req: IncomingMessage) => {
      const url = new URL(req.url!, `http://${req.headers.host}`);
      const workflowId = url.searchParams.get("workflowId");

      if (workflowId) {
        this.clients.set(workflowId, ws);
        console.log(`Client connected for workflow: ${workflowId}`);

        // Subscribe for updates from Redis
        try {
          await this.redisSub.subscribe(`updates:${workflowId}`, (message) => {
            try {
              const parsed = JSON.parse(message);
              console.log(`Received Redis message for ${workflowId}:`, parsed);

              // Send the message directly to the connected client
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(
                  JSON.stringify({
                    workflowId,
                    nodeId: parsed.nodeId,
                    status: parsed.status, // Make sure this matches what you're sending
                    timestamp: Date.now(), // Include any other fields
                  })
                );
                console.log(
                  `Sent update to frontend for node ${parsed.nodeId}: ${parsed.status}`
                );
              }
            } catch (parseError) {
              console.error("Error parsing Redis message:", parseError);
            }
          });
        } catch (error) {
          console.error(
            `Error subscribing to Redis channel for workflow ${workflowId}:`,
            error
          );
        }
      }

      ws.on("close", async () => {
        if (workflowId) {
          this.clients.delete(workflowId);
          try {
            await this.redisSub.unsubscribe(`updates:${workflowId}`);
            console.log(
              `Unsubscribed from Redis channel for workflow: ${workflowId}`
            );
          } catch (error) {
            console.error(
              `Error unsubscribing from Redis channel for workflow ${workflowId}:`,
              error
            );
          }
          console.log(`Client disconnected for workflow: ${workflowId}`);
        }
      });

      ws.on("error", (error) => {
        console.error("WebSocket error:", error);
        if (workflowId) {
          this.clients.delete(workflowId);
        }
      });
    });
  }

  // Keep this method for direct broadcasting (bypassing Redis)
  public broadcastNodeStatus(update: NodeStatusUpdate) {
    const client = this.clients.get(update.workflowId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(update));
      console.log(
        `Direct broadcast - status for node ${update.nodeId}: ${update.status}`
      );
    } else {
      console.log(
        `No client found or connection closed for workflow: ${update.workflowId}`
      );
    }
  }

  public broadcastToWorkflow(workflowId: string, message: any) {
    const client = this.clients.get(workflowId);
    if (!client || client.readyState !== WebSocket.OPEN) {
      console.log(`No client or connection closed for workflow: ${workflowId}`);
      return;
    }

    const payload =
      typeof message === "string" ? message : JSON.stringify(message);
    client.send(payload);
    console.log(`Direct broadcast to workflow ${workflowId}: ${payload}`);
  }

  // Clean up Redis connection
  public async cleanup() {
    try {
      await this.redisSub.disconnect();
      console.log("Redis subscriber disconnected");
    } catch (error) {
      console.error("Error disconnecting Redis subscriber:", error);
    }
  }
}

export default WebSocketManager;
