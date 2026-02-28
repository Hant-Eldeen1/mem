class MemoryModel:
    def __init__(self, size=128):
        self.bytes = [0] * size
        self.cursor = 0
