import {MediaRecorder, register} from 'extendable-media-recorder';
import {connect} from 'extendable-media-recorder-wav-encoder';

let mediaRecorder = null;
let audioBlobs = [];
let capturedStream = null

export async function con() {
    await register(await connect());
}

// Starts recording audio
export async function startRecording() {

    return navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
      }
    }).then(stream => {
        audioBlobs = [];
        capturedStream = stream;
  
        // Use the extended MediaRecorder library
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/wav'
        });
  
        // Add audio blobs while recording 
        mediaRecorder.addEventListener('dataavailable', event => {
          audioBlobs.push(event.data);
        });
  
        mediaRecorder.start();
    }).catch((e) => {
      console.error(e);
    });
  
}

export async function stopRecording() {
    return new Promise(resolve => {
      if (!mediaRecorder) {
        resolve(null);
        console.log('No media recorder')
        return;
      }
  
      mediaRecorder.addEventListener('stop', () => {
        const mimeType = mediaRecorder.mimeType;
        const audioBlob = new Blob(audioBlobs, { type: mimeType });
  
        if (capturedStream) {
          capturedStream.getTracks().forEach(track => track.stop());
        }
  
        resolve(audioBlob);
      });
      
      mediaRecorder.stop();
      
    });
}

export function playAudio(audioBlob) {
    if (audioBlob) {
      const audio = new Audio();
      audio.src = URL.createObjectURL(audioBlob);
      audio.play();
    }
  }