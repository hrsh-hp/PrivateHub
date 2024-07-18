import json
from channels.generic.websocket import AsyncWebsocketConsumer


# logger = logging.getLogger(__name__)

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        # print(self.scope)
        self.group_name = self.scope['url_route']['kwargs']['room_name']
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        # print(f"Connected to group: {self.group_name}, channel: {self.channel_name}")

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        # print(f"Disconnected from group: {self.group_name}, channel: {self.channel_name}, code: {code}")

    async def receive(self, text_data=None, bytes_data=None):
        try:
            rec_dict = json.loads(text_data)
            print(f"Received message: {rec_dict}")

            message = rec_dict['message']
            
            action = rec_dict['action']

            if (action == 'new-offer') or (action == 'new-answer'):
                rec_channel_name = rec_dict['message']['rec_channel_name']
                
                rec_dict['message']['rec_channel_name'] = self.channel_name

                await self.channel_layer.send(
                    rec_channel_name,
                    {
                        'type': 'send.sdp',
                        'rec_dict': rec_dict,            
                    }
                )
                return
            
            rec_dict['message']['rec_channel_name'] = self.channel_name
            
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'send.sdp',
                    'rec_dict': rec_dict              
                }
            )
        except Exception as e:
            print(f"Error receiving message: {e}")

    async def send_sdp(self, event):
        try:
            receive_dict = event['rec_dict']
            this_peer = receive_dict['peer']
            action = receive_dict['action']
            message = receive_dict['message']
            # if( action != 'new-peer'):
            #     print(event)

            await self.send(text_data=json.dumps({
                'peer': this_peer,
                'action': action,
                'message': message,
            }))
        except Exception as e:
            print(f"Error sending SDP: {e}")
