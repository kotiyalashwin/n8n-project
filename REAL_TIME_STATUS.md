# Real-Time Node Execution Status

This document explains the real-time node execution status feature implemented in the n8n clone project.

## Overview

The system now provides real-time visual feedback during workflow execution, showing the status of each node as it processes. This includes:

- **Processing**: Yellow border with spinning loader icon
- **Completed**: Green border with checkmark icon  
- **Error**: Red border with error icon

## Architecture

### Backend (WebSocket Server)
- **File**: `server/websocket.ts`
- **Purpose**: Manages WebSocket connections and broadcasts node status updates
- **Key Features**:
  - Maintains client connections per workflow ID
  - Broadcasts status updates to connected clients
  - Handles connection lifecycle (connect/disconnect/error)

### Execution System Updates
- **File**: `server/execution/index.ts`
- **Changes**:
  - Added WebSocket manager integration
  - Emits status updates at key execution points:
    - `processing`: When node execution starts
    - `completed`: When node execution finishes successfully
    - `error`: When node execution fails

### Frontend (React Hook)
- **File**: `web/hooks/useWebSocket.ts`
- **Purpose**: Manages WebSocket connection and node status state
- **Key Features**:
  - Connects to WebSocket server
  - Maintains node status map
  - Provides status lookup functions
  - Handles connection state

### UI Components Updates
All node components now support status indicators:

#### TaskNode (`web/components/nodes/TaskNode.tsx`)
- Visual status indicators with colored borders
- Status icons (spinner, checkmark, error)
- Smooth transitions between states

#### ManualNode (`web/components/nodes/ManualNode.tsx`)
- Same visual indicators as TaskNode
- Disabled execute button during processing
- Dynamic button text ("Executing..." vs "Execute Workflow")

#### AiNode (`web/components/nodes/AiNode.tsx`)
- Status indicators for AI processing
- Visual feedback during AI model execution

## Usage

### For Developers

1. **Adding Status to New Node Types**:
   ```typescript
   interface YourNodeProps {
     data: YourNodeData;
     nodeStatus?: NodeStatusUpdate;
   }
   
   export const YourNode = ({ data, nodeStatus }: YourNodeProps) => {
     // Use getStatusStyles() and getStatusIcon() patterns
   };
   ```

2. **WebSocket Integration**:
   ```typescript
   const { getNodeStatus, clearNodeStatuses, isConnected } = useWebSocket(workflowId);
   
   // Get status for specific node
   const status = getNodeStatus(nodeId);
   
   // Clear all statuses (useful before execution)
   clearNodeStatuses();
   ```

### For Users

1. **Visual Feedback**:
   - Yellow border + spinner = Node is processing
   - Green border + checkmark = Node completed successfully
   - Red border + error icon = Node failed

2. **Connection Status**:
   - Green indicator = Connected to real-time updates
   - Red indicator = Disconnected (fallback to manual refresh)

## Technical Details

### WebSocket Message Format
```typescript
interface NodeStatusUpdate {
  workflowId: string;
  nodeId: string;
  status: 'processing' | 'completed' | 'error';
  timestamp: number;
  error?: string;
}
```

### Status Flow
1. User clicks "Execute Workflow"
2. Frontend clears previous statuses
3. Backend starts execution
4. For each node:
   - Emit `processing` status
   - Execute node logic
   - Emit `completed` or `error` status
5. Frontend receives updates and updates UI

### Error Handling
- WebSocket connection errors are logged
- Failed node executions show error status
- Connection status indicator shows real-time state
- Graceful fallback when WebSocket is unavailable

## Testing

### Manual Testing
1. Start both servers (backend + frontend)
2. Create a workflow with multiple nodes
3. Execute the workflow
4. Observe real-time status updates

### WebSocket Test Script
```bash
node test-websocket.js
```

This will connect to the WebSocket server and display any status updates received.

## Future Enhancements

- **Progress Indicators**: Show percentage completion for long-running tasks
- **Execution Logs**: Real-time console output for debugging
- **Node Dependencies**: Visual indication of which nodes are waiting for others
- **Performance Metrics**: Execution time tracking per node
- **Retry Logic**: Visual indicators for retry attempts

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**:
   - Check if backend server is running on port 8000
   - Verify CORS settings allow WebSocket connections
   - Check browser console for connection errors

2. **Status Updates Not Showing**:
   - Verify WebSocket connection is established (green indicator)
   - Check browser network tab for WebSocket messages
   - Ensure workflow ID matches between frontend and backend

3. **Visual Indicators Not Updating**:
   - Check if node components are using the `nodeStatus` prop
   - Verify CSS classes are applied correctly
   - Check for JavaScript errors in browser console

### Debug Mode
Enable debug logging by adding to browser console:
```javascript
localStorage.setItem('debug', 'websocket');
```
