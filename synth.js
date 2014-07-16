var synth = flock.synth({
  synthDef:{
      id: "testy",
      ugen: "flock.ugen.sin",
      mul: {
        id: "freqy",
        ugen: "flock.ugen.dust",
        density: 100,
        mul: 0.3,
        add: 0.4
      }, 
  }
});

var dustyfreq = {
        id: "freqy",
        ugen: "flock.ugen.dust",
        density: 100,
        mul: 0.3,
        add: 0.4
      };

$('#f1').on("change", function() {
    synth.set( "testy.freq",$(this).val() * 2 + 200 );
    console.log("fadfadf");
});

$('#f2').on("change", function() {
    synth.set("testy.mul", dustyfreq);
    var thing = $(this).val()/127;
    synth.set( "freqy.mul",thing  );
    synth.set( "freqy.add",1-thing  );
});

$('input[type="range"]').each( function(index){
   $(this).on("change mousemove", function(){
     $(this).next().html($(this).val());
   });
});

$('#onoff').on("change", function(){
    if ( $(this).prop('checked') ){
      synth.play();
    }else{
      synth.pause();
    }
});


function midi2Freq (num){
  return Math.pow(2, (num-69)/12) * 440;    
};
console.log(midi2Freq(60));

var midiConnection = flock.midi.connection({
    openImmediately: true,
    ports: 0,
    listeners: {
        noteOn: function (msg) {
         $('#midiDisplay').html( fluid.prettyPrintJSON(msg) );
    	   synth.set("testy.freq", midi2Freq(msg.note+24));
    	   synth.set("testy.mul", 1);
        },
        noteOff: function (msg) {
         $('#midiDisplay').html( fluid.prettyPrintJSON(msg) );
          synth.set("testy.mul", 0);
        },
        control: function (msg) {
         $('#midiDisplay').html( fluid.prettyPrintJSON(msg) );
          switch(msg.number){
            case 1:
              $('#f1').val(msg.value).trigger("change");
              break;
            case 2:  
              $('#f2').val(msg.value).trigger("change");
              break;
            case 3:  
              $('#f3').val(msg.value).trigger("change");
              break;
            case 4:  
              $('#f4').val(msg.value).trigger("change");
              break;
            case 5:  
              $('#f5').val(msg.value).trigger("change");
              break;
            case 3:  
              $('#f6').val(msg.value).trigger("change");
              break;
            case 7:  
              $('#f7').val(msg.value).trigger("change");
              break;
            case 8:  
              $('#f8').val(msg.value).trigger("change");
              break;
          }
        }
    }
});


var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 57110
});

udpPort.on("ready", function () {
    $("#udpStatus").text("Listening for UDP on port " + udpPort.options.localPort);
});

udpPort.on("message", function(message){
  $("#message").html( fluid.prettyPrintJSON(message) );
});

udpPort.on("error", function (err) {
    throw new Error(err);
});

udpPort.open();

$("document").ready(function(){
  $("#onoff").prop('checked', true).trigger("change");
});
