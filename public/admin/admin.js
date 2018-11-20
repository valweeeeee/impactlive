$( document ).ready(function() {
  $("#username").focus();
  window.getCookie = (function (name) {
    //console.log('hi');
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1,c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return null;
  });
  window.toJSONString = (function (form) {
    var obj = {};
    var elements = form.querySelectorAll( "input, select, textarea" );
    for( var i = 0; i < elements.length; ++i ) {
      var element = elements[i];
      var name = element.name;
      var value = element.value;

      if( name ) {
        obj[ name ] = value;
      }
    }

    return JSON.stringify( obj );
  });

window.setCookie=(function(name,value,days) {
  var expires = "";
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
});
  $.QueryString = (function(paramsArray) {
       let params = {};
       for (let i = 0; i < paramsArray.length; ++i){
           let param = paramsArray[i]
               .split('=', 2);
           if (param.length !== 2)
               continue;
           params[param[0]] = decodeURIComponent(param[1].replace(/\+/g, " "));
       }
       return params;
   })(window.location.search.substr(1).split('&'))
  let room = $.QueryString["r"];
  var socket = io.connect('',{query: 'v='+room,'transports': ['websocket']});
  socket.removeAllListeners();
  socket.on('connect', () => {
    socket.emit("joinRoom",room);
  });


$( "#pushFrame2" ).on('click',function() {
    socket.emit("adminPush","Frame2");
});
$( "#pushFrame3" ).on('click',function() {
    socket.emit("adminPush","Frame3");
});
$( "#pushFrame4" ).on('click',function() {
    socket.emit("adminPush","Frame4");
});
$( "#pushFrame5" ).on('click',function() {
    socket.emit("adminPush","Frame5");
});
$( "#pushEnd" ).on('click',function() {
    socket.emit("adminPush","Finish");
});
$( "#pushStartOver" ).on('click',function() {
  if(confirm("Are you sure you wish to start over?"))
    socket.emit("adminPush","StartOver");
});

});
