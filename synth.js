var synth = flock.synth({
  synthDef:{
      id: "testy",
      ugen: "flock.ugen.sin",
      freq: 400, 
      mul:0.5,
  }
});

$('#f1').on("change mousemove", function() {
    synth.set( "testy.freq",$(this).val() * 2 + 200 );
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

var midiConnection = flock.midi.connection({
    openImmediately: true,
    ports: 0,
    listeners: {
        noteOn: function (msg) {
    	   synth.set("testy.mul", 1);
        },
        noteOff: function (msg) {
          synth.set("testy.mul", 0);
        },
        control: function (msg) {
          switch(msg.number){
            case 1:
              $('#f1').val(msg.value).trigger("change");
              break;
            case 2:  
              $('#f2').val(msg.value).trigger("change");
              break;
            case 3:  
              $('#f2').val(msg.value).trigger("change");
              break;
          }
        }
    }
});

$("document").ready(function(){
  $("#onoff").prop('checked', true).trigger("change");
});