#!/usr/bin/env python3
"""
Memory Visual IDE - Backend Entry Point
Handles C code parsing, execution simulation, and WebSocket communication
"""

import asyncio
import json
import logging
from typing import Dict, List, Any
import websockets
from dataclasses import dataclass, asdict
from enum import Enum

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OperationType(Enum):
    FSEEK = "fseek"
    FREAD = "fread"
    FWRITE = "fwrite"
    MALLOC = "malloc"
    FREE = "free"
    ASSIGN = "assign"

@dataclass
class MemoryOperation:
    type: str
    description: str
    file_pointer: int = 0
    byte_offset: int = 0
    struct_index: int = 0
    data: Dict = None
    
    def to_dict(self):
        return {
            'type': self.type,
            'description': self.description,
            'filePointer': self.file_pointer,
            'byteOffset': self.byte_offset,
            'structIndex': self.struct_index,
            'data': self.data or {}
        }

class CMemoryExecutor:
    """
    Simulates C code execution with memory visualization
    """
    def __init__(self):
        self.file_pointer = 0
        self.file_size = 1024  # Simulated file size
        self.struct_size = 24  # Default struct size
        self.struct_type = "Student"
        self.variables = {}
        self.history: List[MemoryOperation] = []
        
    def parse_and_execute(self, code: str) -> List[MemoryOperation]:
        """
        Parse C code and generate memory operations
        This is a simplified parser for educational purposes
        """
        self.history = []
        lines = code.split('\n')
        
        for line_num, line in enumerate(lines, 1):
            line = line.strip()
            if not line or line.startswith('//'):
                continue
                
            # Detect fseek operations
            if 'fseek' in line:
                self._handle_fseek(line, line_num)
            # Detect fread/fwrite
            elif 'fread' in line or 'fwrite' in line:
                self._handle_fread_write(line, line_num)
            # Detect struct definitions
            elif 'typedef struct' in line:
                self._handle_struct_def(line, line_num)
            # Variable assignments
            elif '=' in line and not line.startswith('if'):
                self._handle_assignment(line, line_num)
        
        return self.history
    
    def _handle_fseek(self, line: str, line_num: int):
        """Parse fseek(fp, offset, whence)"""
        import re
        match = re.search(r'fseek\(\s*(\w+)\s*,\s*([^,]+)\s*,\s*(\w+)\s*\)', line)
        
        if match:
            file_var = match.group(1)
            offset_expr = match.group(2)
            whence = match.group(3)
            
            # Calculate offset (simplified)
            offset = self._evaluate_offset(offset_expr)
            
            old_pos = self.file_pointer
            
            if whence == 'SEEK_SET':
                self.file_pointer = offset
            elif whence == 'SEEK_CUR':
                self.file_pointer += offset
            elif whence == 'SEEK_END':
                self.file_pointer = self.file_size + offset
            
            struct_idx = self.file_pointer // self.struct_size
            byte_off = self.file_pointer % self.struct_size
            
            op = MemoryOperation(
                type=OperationType.FSEEK.value,
                description=f"Line {line_num}: fseek({file_var}, {offset}, {whence}) → Position {self.file_pointer} bytes (Struct {struct_idx + 1})",
                file_pointer=self.file_pointer,
                byte_offset=byte_off,
                struct_index=struct_idx,
                data={
                    'from': old_pos,
                    'to': self.file_pointer,
                    'whence': whence
                }
            )
            self.history.append(op)
            logger.info(f"fseek: moved to {self.file_pointer}")
    
    def _handle_fread_write(self, line: str, line_num: int):
        """Handle fread/fwrite operations"""
        is_read = 'fread' in line
        op_type = OperationType.FREAD if is_read else OperationType.FWRITE
        
        op = MemoryOperation(
            type=op_type.value,
            description=f"Line {line_num}: {'fread' if is_read else 'fwrite'}() → {'Read from' if is_read else 'Wrote to'} position {self.file_pointer}",
            file_pointer=self.file_pointer,
            struct_index=self.file_pointer // self.struct_size,
            data={'operation': 'read' if is_read else 'write'}
        )
        self.history.append(op)
    
    def _handle_struct_def(self, line: str, line_num: int):
        """Extract struct name from typedef"""
        import re
        match = re.search(r'typedef\s+struct\s*\{[^}]*\}\s*(\w+)', line)
        if match:
            self.struct_type = match.group(1)
    
    def _handle_assignment(self, line: str, line_num: int):
        """Handle variable assignments"""
        if 'sizeof' in line:
            import re
            match = re.search(r'sizeof\(\s*(\w+)\s*\)', line)
            if match:
                type_name = match.group(1)
                # Update struct size based on type
                self.struct_size = self._calculate_struct_size(type_name)
    
    def _evaluate_offset(self, expr: str) -> int:
        """Evaluate offset expressions like 'sizeof(Student) * 2'"""
        import re
        
        # Replace sizeof() with actual values
        expr = re.sub(r'sizeof\(\s*(\w+)\s*\)', str(self.struct_size), expr)
        
        # Evaluate simple arithmetic
        try:
            return eval(expr, {"__builtins__": {}}, {})
        except:
            return 0
    
    def _calculate_struct_size(self, type_name: str) -> int:
        """Calculate struct size (simplified)"""
        # In real implementation, parse struct definition
        sizes = {
            'Student': 24,
            'int': 4,
            'char': 1,
            'double': 8
        }
        return sizes.get(type_name, 24)
    
    def get_memory_state(self) -> Dict[str, Any]:
        """Get current memory state for visualization"""
        # Generate sample data for visualization
        num_structs = max(5, (self.file_size // self.struct_size))
        data = []
        
        for i in range(num_structs):
            data.append({
                'index': i,
                'offset': i * self.struct_size,
                'fields': [
                    {'name': 'id', 'type': 'int', 'value': f'{1000 + i}'},
                    {'name': 'name', 'type': 'char[20]', 'value': f'Student_{i+1}'},
                    {'name': 'grade', 'type': 'float', 'value': f'{3.5 + (i * 0.1):.2f}'}
                ]
            })
        
        return {
            'filePointer': self.file_pointer,
            'fileSize': self.file_size,
            'structSize': self.struct_size,
            'structType': self.struct_type,
            'data': data,
            'variables': self.variables
        }

class WebSocketServer:
    def __init__(self, host='localhost', port=8765):
        self.host = host
        self.port = port
        self.clients = set()
        self.executor = CMemoryExecutor()
        
    async def register(self, websocket):
        self.clients.add(websocket)
        logger.info(f"Client connected. Total: {len(self.clients)}")
        
    async def unregister(self, websocket):
        self.clients.remove(websocket)
        logger.info(f"Client disconnected. Total: {len(self.clients)}")
        
    async def handle_message(self, websocket, message: str):
        """Handle incoming messages from frontend"""
        try:
            data = json.loads(message)
            action = data.get('action')
            
            if action == 'execute':
                code = data.get('code', '')
                logger.info(f"Executing code ({len(code)} chars)")
                
                # Execute code step by step
                operations = self.executor.parse_and_execute(code)
                
                # Send initial memory state
                await websocket.send(json.dumps({
                    'type': 'memory:update',
                    'data': self.executor.get_memory_state()
                }))
                
                # Send each operation with delay for visualization
                for i, op in enumerate(operations):
                    await asyncio.sleep(0.5)  # Delay for animation
                    await websocket.send(json.dumps({
                        'type': 'execution:step',
                        'step': i,
                        'operation': op.to_dict(),
                        'memoryState': self.executor.get_memory_state()
                    }))
                
                # Send completion
                await websocket.send(json.dumps({
                    'type': 'execution:complete',
                    'totalSteps': len(operations)
                }))
                
            elif action == 'reset':
                self.executor = CMemoryExecutor()
                await websocket.send(json.dumps({
                    'type': 'memory:update',
                    'data': self.executor.get_memory_state()
                }))
                
            elif action == 'step':
                # Handle single step execution
                pass
                
        except json.JSONDecodeError:
            logger.error("Invalid JSON received")
        except Exception as e:
            logger.error(f"Error handling message: {e}")
            await websocket.send(json.dumps({
                'type': 'execution:error',
                'error': str(e)
            }))
    
    async def ws_handler(self, websocket, path):
        await self.register(websocket)
        try:
            async for message in websocket:
                await self.handle_message(websocket, message)
        except websockets.exceptions.ConnectionClosed:
            pass
        finally:
            await self.unregister(websocket)
    
    async def start(self):
        logger.info(f"Starting WebSocket server on {self.host}:{self.port}")
        async with websockets.serve(self.ws_handler, self.host, self.port):
            await asyncio.Future()  # Run forever

def main():
    server = WebSocketServer()
    asyncio.run(server.start())

if __name__ == '__main__':
    main()