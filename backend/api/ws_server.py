import asyncio
import websockets
import json

memory = [0] * 64
cursor = 0

async def handler(ws):
    global cursor
    await ws.send(json.dumps({
        'memory': memory,
        'cursor': cursor
    }))
    async for msg in ws:
        data = json.loads(msg)
        if data.get('cmd') == 'seek':
            cursor = data['pos']
            await ws.send(json.dumps({
                'memory': memory,
                'cursor': cursor
            }))

def start_server():
    asyncio.get_event_loop().run_until_complete(
        websockets.serve(handler, 'localhost', 8765)
    )
    asyncio.get_event_loop().run_forever()
