import { useEffect, useRef, useState } from 'react';

export interface NodeStatusUpdate {
  workflowId: string;
  nodeId: string;
  status: 'processing' | 'completed' | 'error';
  timestamp: number;
  error?: string;
}

export const useWebSocket = (workflowId: string) => {
  const [nodeStatuses, setNodeStatuses] = useState<Map<string, NodeStatusUpdate>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!workflowId) return;

    // Create WebSocket connection
    const ws = new WebSocket(`ws://localhost:8000?workflowId=${workflowId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const update: NodeStatusUpdate = JSON.parse(event.data);
        setNodeStatuses(prev => {
          const newMap = new Map(prev);
          newMap.set(update.nodeId, update);
          return newMap;
        });
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [workflowId]);

  const getNodeStatus = (nodeId: string): NodeStatusUpdate | undefined => {
    return nodeStatuses.get(nodeId);
  };

  const clearNodeStatuses = () => {
    setNodeStatuses(new Map());
  };

  return {
    nodeStatuses,
    isConnected,
    getNodeStatus,
    clearNodeStatuses
  };
};
