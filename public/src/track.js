var context, recorder, input, master, bufferLoader, track1, track;


  function startUserMedia(stream) {
    master = context.createGainNode();
    master.connect(context.destination);
    input = context.createMediaStreamSource(stream);
    input.connect(master);
    loadTrack();
    recorder = new Recorder(master);
  }

  function startRecording(button) {
    if (master.gain === 0){
      master.gain = 1;
    }
    if (track === false){
      reloadTrack();
    }
    recorder && recorder.record();
    button.disabled = true;
    button.nextElementSibling.disabled = false;
    startTrack();
  }

  function stopRecording(button) {
    recorder && recorder.stop();
    button.disabled = true;
    button.previousElementSibling.disabled = false;

    createPlaybackLink();
    master.gain = 0;
    stopTrack();
    recorder.clear();
  }

  function createPlaybackLink() {
    recorder && recorder.exportWAV(function(blob){
      var url = URL.createObjectURL(blob);
      var li = document.createElement('li');
      var au = document.createElement('audio');

      au.controls = true;
      au.src = url;
      li.appendChild(au);
      recordslist.appendChild(li);
    });
  }

  function loadTrack(){
      bufferLoader = new BufferLoader(
      context,
      [
        '../audio/track1.wav'
      ],
      bufferTrack
      );
      bufferLoader.load();
    }

  function bufferTrack(bufferList){
    track1 = context.createBufferSource();
    track1.buffer = bufferList[0];
    track1.connect(master);
    track = true;
  }

  function reloadTrack(){
    bufferLoader.load();
    track1.connect(master);
  }

  function startTrack(){
    track1.start(0, 0);

  }

  function stopTrack(){
    track1.stop(0);
    track1.disconnect();
    track = false;
    loadTrack();
  }

  function inputAudio(){
    context = new AudioContext;
    navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
      });
  }

  window.onload = function init(){
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.webkitURL;
    inputAudio();
  };
