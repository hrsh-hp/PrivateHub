
const constaints = {
    'video' :true,
    'audio':true
}

const localVideo = document.getElementById('local-video');    
var localStream = new MediaStream();
btnToggleAudio = document.getElementById('toggle-audio');    
btnToggleVideo = document.getElementById('toggle-video');
console.log(localVideo)

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
                btnToggleAudio.classList.remove("bg-gray-500","hover:bg-gray-600");
                btnToggleAudio.classList.add("bg-red-500","hover:bg-red-600");
                btnToggleAudio.innerHTML = `<i class="fa-solid fa-microphone"></i>`;
                btnToggleAudio.title = "Mute";
                return;
            }
            btnToggleAudio.classList.remove("bg-red-500","hover:bg-red-600");
            btnToggleAudio.classList.add("bg-gray-500","hover:bg-gray-600");
            btnToggleAudio.innerHTML = `<i class="fa-solid fa-microphone-slash"></i>`;
            btnToggleAudio.title = "Unmute";
    
        };
        btnToggleVideo.onclick = function(){
            videoTracks[0].enabled = !videoTracks[0].enabled;

            if(videoTracks[0].enabled){
                btnToggleVideo.classList.remove("bg-gray-500","hover:bg-gray-600");
                btnToggleVideo.classList.add("bg-red-500","hover:bg-red-600");
                btnToggleVideo.innerHTML = `<i class="fa-solid fa-video"></i>`;
                btnToggleVideo.title = "Video Off";
                return;
            }
            btnToggleVideo.classList.remove("bg-red-500","hover:bg-red-600");
            btnToggleVideo.classList.add("bg-gray-500","hover:bg-gray-600");
            btnToggleVideo.innerHTML = `<i class="fa-solid fa-video-slash"></i>`;
            btnToggleVideo.title = "Video On";
    
        };

    })
    .catch(error =>{
        console.log('error in accesing media devices', error)
    });