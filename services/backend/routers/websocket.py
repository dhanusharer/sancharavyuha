from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict, Any
import json
import asyncio

router = APIRouter(prefix="/ws", tags=["Realtime WebSocket Streaming"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: Dict[str, Any]):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

@router.websocket("/live-feed")
async def websocket_live_feed(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive and accept incoming messages
            data = await websocket.receive_text()
            try:
                payload = json.loads(data)
                # If message is a broadcast request from CV stream or simulator
                await manager.broadcast(payload)
            except Exception:
                await websocket.send_json({"status": "acknowledged"})
    except WebSocketDisconnect:
        manager.disconnect(websocket)
