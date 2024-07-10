from channels.generic.websocket import AsyncWebsocketConsumer

class VideoChat(AsyncWebsocketConsumer):
    
    def connect(self):
        print()
        self.accept()
        
    def receive(self, text_data=None, bytes_data=None):
        pass
    
    