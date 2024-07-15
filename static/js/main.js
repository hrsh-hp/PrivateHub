// console.log('hey')

var mapPeers = {};
const localVideo = document.getElementById('local-video');    
var localStream = new MediaStream();


btnToggleAudio = document.getElementById('toggle-audio');    
btnToggleVideo = document.getElementById('toggle-video');

var btnSendMesg = document.getElementById('send-msg');
var msgInput = document.getElementById('msg')
var messageList = document.getElementById('message-list');

var loc = window.location;
var wsStart = 'ws://'

if(loc.protocol == 'https:'){
    wsStart = 'wss://'
}
var wsEndPoint = wsStart + loc.host + "/ws/";
var ws;

var inputUsername = document.getElementById('username');
var userName;
var joinBtn = document.getElementById('btn-join');

var servers = {
    iceServers: [
      {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
      },
    ],
    iceCandidatePoolSize: 10,
};  


joinBtn.onclick = ()=>{
    userName = inputUsername.value;
    if(userName == ''){
        return;
    }
    inputUsername.value = '';
    inputUsername.disabled = true;
    inputUsername.style.visibility = 'hidden';

    joinBtn.disabled = true;
    joinBtn.style.visibility = 'hidden';

    var labelUsername = document.getElementById('label-username');
    labelUsername.innerHTML = userName;

    // console.log(wsEndPoint);
    ws = new WebSocket(wsEndPoint);
    
    ws.onopen = function(e){
        console.log('Connection opened',e);
        sendSignal('new-peer',{});
    }
    ws.onmessage = webSocketOnMessage

    ws.onclose = (e)=>{
        console.log('connection closed',e );
    }

    ws.onerror= (e)=>{
        console.log("error occured", e);
    }

    btnSendMesg.disabled = false;
    msgInput.disabled = false;

}

function webSocketOnMessage(event){
    var data = JSON.parse(event.data);
    console.log(data)
    var message = data.message
    var peerUserName = data.peer
    var action = data.action
    var rec_channel_name = data.message.rec_channel_name
    if(userName == peerUserName){
        return;
    }
    console.log('rec channel name',rec_channel_name)
   
    if(action == "new-peer"){
        console.log('New Peer ', peerUserName);
        createOfferer(peerUserName, rec_channel_name)
        console.log(mapPeers)
        return;
    }

    if(action == "new-offer"){
        console.log("Got a new offer from ", peerUserName);
        var offer = data.message.sdp;
        console.log('Offer ',offer);
        createAnswerer(offer, peerUserName, rec_channel_name);
        return; 
    }
    if(action == "new-answer"){
        var peer = null;
        peer = mapPeers[peerUserName][0];
        var answer = data['message']['sdp'];
        
        console.log('mapPeers:');
        for(key in mapPeers){
            console.log(key, ': ', mapPeers[key]);
        }

        console.log('peer: ', peer);
        console.log('answer: ', answer);

        // set remote description of the RTCPeerConnection
        peer.setRemoteDescription(answer);

        return;
    }
}

btnSendMesg.onclick = sendMsgOnClick;

function sendMsgOnClick(){
    var message = msgInput.value;
    var li = document.createElement('li');
    li.appendChild(document.createTextNode('Me: '+ message));
    messageList.appendChild(li);
     
    var dcs = getDataChannels();
    console.log('Sending: ', message);

    message = userName + ': ' + message;
    
    for(index in dcs){
        dcs[index].send( message);

    }
    msgInput.value = '';

}

const constaints = {
    'video' :true,
    'audio':true
}

var userMedia = navigator.mediaDevices.getUserMedia(constaints)
    .then(stream => {
        localStream = stream;
        console.log('Got MediaStream:', stream);
        var mediaTracks = stream.getTracks();
        
        for(i=0; i < mediaTracks.length; i++){
            console.log(mediaTracks[i]);
        }

        localVideo.srcObject = localStream;
        localVideo.muted = true;

        window.stream = stream; 

        var audioTracks =stream.getAudioTracks();
        var videoTracks = stream.getVideoTracks();

        audioTracks[0].enabled = true;
        videoTracks[0].enabled = true;

        btnToggleAudio.onclick = function(){
            audioTracks[0].enabled = !audioTracks[0].enabled;

            if(audioTracks[0].enabled){
                btnToggleAudio.innerHTML = "Audio Mute";
                return;
            }
    
            btnToggleAudio.innerHTML = "Audio Unmute";
    
        };
        btnToggleVideo.onclick = function(){
            videoTracks[0].enabled = !videoTracks[0].enabled;

            if(videoTracks[0].enabled){
                btnToggleVideo.innerHTML = "Video Off";
                return;
            }
    
            btnToggleVideo.innerHTML = "Video On";
    
        };

    })
    .catch(error =>{
        console.log('error in accesing media devices', error)
    });


function sendSignal(action, message){
    
    // json_str = ;

    ws.send(
        JSON.stringify({
            'peer':userName,
            'action':action,
            'message':message,
        })
    )

}

function createOfferer(peerUserName, rec_channel_name){
    console.log('inside offerer')
    
    var peer = new RTCPeerConnection(servers);
    console.log('offerer peer ',peer);
    addLocalTracks(peer);

    var dc = peer.createDataChannel("channel");
    dc.onopen = ()=>{
        console.log('ofer dc connection opened..')
    };

    dc.onmessage = dcOnMessage;

    var remoteVideo = null;
    remoteVideo = createVideo(peerUserName);
    setOnTrack(peer, remoteVideo);
    console.log('Remote video source: ', remoteVideo.srcObject);

    mapPeers[peerUserName] = [peer, dc];

    peer.oniceconnectionstatechange = () => {
        console.log(`ICE connection state: ${peer.iceConnectionState}`); 
        var iceConnectionState = peer.iceConnectionState;
        if(iceConnectionState === 'failed' || iceConnectionState === 'closed' || iceConnectionState === 'disconnected'){
            console.log('Deleting peer');
            delete mapPeers[peerUserName];
            
            if(iceConnectionState != 'closed'){
                peer.close();
            }
            removeVideo(remoteVideo);
        }

    };

    peer.onicecandidate = (event)=>{
        if(event.candidate){
            console.log('New Ice candidates offerer:'+ JSON.stringify(peer.localDescription));
            return;
        }

        console.log('Gathering finished! Sending offer SDP to ', peerUserName, '.');
        console.log('receiverChannelName: ', rec_channel_name);

        console.log('Sending offer:', peer.localDescription);
        sendSignal('new-offer',{
            'sdp': peer.localDescription,
            'rec_channel_name': rec_channel_name,
        });
    }

    peer.createOffer()
        .then(o => peer.setLocalDescription(o))
        .then(function(event){
            console.log("Local Description Set successfully.");
        });

    console.log('mapPeers[', peerUserName, ']: ', mapPeers[peerUserName]);

    return peer;//changed
}

function createAnswerer(offer, peerUserName, rec_channel_name){
    var peer = new RTCPeerConnection(servers);
    addLocalTracks(peer);

    var remoteVideo = createVideo(peerUserName);
    setOnTrack(peer, remoteVideo);

    peer.ondatachannel = e=>{
        peer.dc = e.channel;
        peer.dc.onmessage = dcOnMessage;
        peer.dc.onopen = () => {
            console.log("dc answer Connection opened.");
        }
    
        mapPeers[peerUserName] = [peer, peer.dc];
    };

    peer.oniceconnectionstatechange = () => {
        console.log(`ICE connection state: ${peer.iceConnectionState}`);
        var iceConnectionState = peer.iceConnectionState;
        // console.log(iceConnectionState);
        if(iceConnectionState === 'failed' || iceConnectionState === 'closed' || iceConnectionState === 'disconnected'){
            delete mapPeers[peerUserName];
            
            if(iceConnectionState != 'closed'){
                peer.close();
            }
            removeVideo(remoteVideo);
        }

    };

    console.log('Sending offer:', peer.localDescription);
    peer.onicecandidate = (event)=>{
        if(event.candidate){
            console.log('New Ice candidates:', JSON.stringify(peer.localDescription));
            return;
        }
        console.log('Gathering finished! Sending answer SDP to ', peerUserName, '.');
        console.log('receiverChannelName: ', rec_channel_name); //changed, peerUserName made to remove confusion

        sendSignal('new-answer',{
            'sdp': peer.localDescription,
            'rec_channel_name': rec_channel_name,
        });
    }

    peer.setRemoteDescription(offer)
        .then(() => {
            console.log("remote description set successfullty for %s", peerUserName);
            return peer.createAnswer();
        })
        .then(a => {
            console.log('Setting local answer for %s.', peerUserName);
            peer.setLocalDescription(a);
            // console.log(peer)
        })
        .then(() => {
            console.log('Answer created for %s.', peerUserName);
            console.log('localDescription: ', peer.localDescription);
            console.log('remoteDescription: ', peer.remoteDescription);
        })
        .catch(error => {
            console.log('Error creating answer for %s.', peerUserName);
            console.log(error);
        });

    return peer
}

function dcOnMessage(event){
    var message = event.data;
    
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(message));
    messageList.appendChild(li);
}

function getDataChannels(){
    var dcs = [];
    for (peerUserName in mapPeers){
        console.log('mapPeers[', peerUserName, ']: ', mapPeers[peerUserName]);
        var datachannel = mapPeers[peerUserName][1];
        console.log('dataChannel: ', datachannel);
        dcs.push(datachannel);
    }
    return dcs;
}

// get all stored RTCPeerConnections
// peerStorageObj is an object (either mapPeers or mapScreenPeers)
function getPeers(peerStorageObj){
    var peers = [];
    
    for(peerUserName in peerStorageObj){
        var peer = peerStorageObj[peerUserName][0];
        console.log('peer: ', peer);

        peers.push(peer);
    }
    
    return peers;
}

function createVideo(peerUserName){
    var videoContainer = document.getElementById('video-container');
    
    var remoteVideo = document.createElement('video');
    remoteVideo.id = peerUserName + '-video'
    remoteVideo.autoplay = true
    remoteVideo.playsInline = true
    // remoteVideo.srcObject = "";
    
    var videoWrapper = document.createElement('div');
    videoContainer.appendChild(videoWrapper);
    videoWrapper.appendChild(remoteVideo);
    
    return remoteVideo;
}

function setOnTrack(peer, remoteVideo){
    console.log('Setting ontrack:');
    var remoteStream = new MediaStream();
    // remoteStream.onaddtrack = (event)=>{
    //     console.log('remote stream on addtrack add');
    // }
    // console.log("EMpty media stream: ", remoteStream)
    remoteVideo.srcObject = remoteStream;
    console.log('remoteVideo: ', remoteVideo.id);
    // console.log(peer);
    // console.log('calling on track remotevideo')
    peer.ontrack = async (event) => {
        console.log('Adding track: ', event.track);
        remoteStream.addTrack(event.track, remoteStream);
    }; 
    console.log(peer)
}

function addLocalTracks(peer){
    localStream.getTracks().forEach(track =>{
        console.log('Adding localStream tracks.');
        peer.addTrack(track, localStream);
        // console.log(localStream, track);
    });
    return;
}

function removeVideo(video){
    var videoWrapper = video.parentNode;
    videoWrapper.parentNode.removeChild(videoWrapper)
}

