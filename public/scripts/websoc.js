$(document).ready(function() {

   var socket = io.connect();
   var target;

   fetch('config.json')
      .then(response => response.json())
      .then(data => {
         $.each(data, function(i, item) {
            console.log(item)
            $("#" + item.target).css({
               left: item.x + "px",
               top: item.y + "px"
            });
            $('#draggable-wrapper').css({
               'display': 'block'
            });
         })
      })
      .catch(error => console.error(error))

   socket.on('update_position', function(data) {
      var x = data.x;
      var y = data.y;
      var target = data.target;
      // move div at sockets
      $(".left").val(x);
      $(".top").val(y);
      $("#" + target).css({
         left: x + "px",
         top: y + "px"
      });
   });

   $(".draggable").draggable({
      containment: "body"
   }, {
      drag: function(event, ui) {
         $("body").css("background-color", "white");
         $(".draggable").css("color", "#FA7268");
         $("h1").css("color", "#FA7268");
         $("h2").css("color", "#FA7268");
         var coord = $(this).position();
         target = this.id;
         $(".left").val(coord.left);
         $(".top").val(coord.top);
         socket.emit('receive_position', {
            target: target,
            x: coord.left,
            y: coord.top
         });
      },
      stop: function() {
         $("body").css("background-color", "#0C2340");
         $(".draggable").css("color", "#FA7268");
         $("h1").css("color", "white");
         $("h2").css("color", "white");
      }
   });
});
