export const startAnalyzing = (onAnalysisStateChange, audioContextRef, sourceRef, analyserRef, gainNodeRef) => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
  
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1
        }
      })
      .then((stream) => {
        sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
  
        analyserRef.current = audioContextRef.current.createAnalyser();
        gainNodeRef.current = audioContextRef.current.createGain();
  
        sourceRef.current.connect(gainNodeRef.current);
        gainNodeRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
  
        analyserRef.current.fftSize = 1024;
        gainNodeRef.current.gain.value = 0.4;
  
        onAnalysisStateChange(true, analyserRef.current);
      })
      .catch((err) => {
        console.error("Error accessing microphone:", err);
      });
  };
  
  export const stopAnalyzing = (onAnalysisStateChange, audioContextRef) => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  
    onAnalysisStateChange(false, null);
  };
  