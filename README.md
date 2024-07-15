# PRIVATE_HUB: WebRTC Video Chat with Django Signaling Server

This project is a basic implementation of a WebRTC video chat application using Django Channels for signaling. It allows multiple peers to join a room, establish video connections, and communicate via data channels.

## Table of Contents

- [PRIVATE\_HUB: WebRTC Video Chat with Django Signaling Server](#private_hub-webrtc-video-chat-with-django-signaling-server)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Requirements](#requirements)
  - [Installation](#installation)
    - [Windows](#windows)
    - [Linux](#linux)
  - [Usage](#usage)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)
    - [Logging](#logging)
  - [Contributing](#contributing)

## Features

- Multi-peer video chat
- Real-time data channels
- ICE candidate exchange
- Basic logging for debugging

## Requirements

- Python 3.7+
- Django 3.1+
- Django Channels 3.0+
- Redis (for WebSocket backend)
- Bootstrap (for frontend design)

## Installation

### Windows

1. **Clone the repository:**

   ```sh
   git clone https://github.com/hrsh-hp/PrivateHub.git
   cd PrivateHub
   ```

2. **Set up a virtual environment and install Python dependencies:**

   ```sh
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Install Redis:**

   Download and install Redis from [Install redis on Windows](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-windows/).

   Start the Redis server:

   ```sh
   redis-server
   ```

4. **Set up Django:**

   ```sh
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver
   ```

### Linux

1. **Clone the repository:**

   ```sh
   git clone https://github.com/hrsh-hp/PrivateHub.git
   cd PrivateHub
   ```

2. **Set up a virtual environment and install Python dependencies:**

   ```sh
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Install Redis:**

   ```sh
   sudo apt update
   sudo apt install redis-server
   ```

   Start the Redis server:

   ```sh
   sudo service redis-server start
   ```

4. **Set up Django:**

   ```sh
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver
   ```

## Usage

1. **Run the Django development server:**

   ```sh
   python manage.py runserver
   ```

2. **Access the application:**

   Open your web browser and navigate to `http://localhost:8000`.

3. **Join the chat room:**

   - Enter a username and click the "Join" button.
   - Allow access to your camera and microphone.
   - You should see your video feed on the page.

4. **Invite another peer:**

   - Open another browser window or tab.
   - Enter a different username and join the same room.
   - You should see both video feeds in each window.

## Troubleshooting

### Common Issues

1. **WebSocket connection errors:**
   - Check if the WebSocket server is running.
   - Ensure the correct WebSocket URL (ws:// or wss:// based on your setup).

2. **SDP offer/answer not exchanged:**
   - Verify that SDP messages are being sent and received correctly.
   - Check the WebSocket logs for any errors.

3. **ICE candidate issues:**
   - Ensure that ICE candidates are being gathered and sent.
   - Check network conditions and ensure STUN/TURN servers are reachable.

4. **No video stream:**
   - Ensure that media permissions are granted in the browser.
   - Check if the video elements are correctly assigned media streams.

### Logging

Extensive logging is added throughout the code to assist in debugging. Check the browser console and server logs for detailed information.

## Contributing

If you'd like to contribute to this project, please fork the repository and use a feature branch. Pull requests are warmly welcome.

