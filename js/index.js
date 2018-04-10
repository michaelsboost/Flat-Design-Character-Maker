var open = false,
    duration = 0.3,
    timing   = 'cubic-bezier(0.7, 0, 0.3, 1)',
    saveAsPNG = function(value) {
      var canvas = new fabric.StaticCanvas('canvas');
      canvas.clear();

      var svgString = $(".viewer").html();

      fabric.loadSVGFromString(svgString, function(results, options) {
        var newImage = results[0];
        canvas.add(newImage);
        console.log(canvas.toDataURL("image/png"));
      });

      var iframe = Object.assign(document.createElement('iframe'), {
        onload() {
          var doc = this.contentDocument;
          var a = Object.assign(doc.createElement('a'), {
            href: canvas.toDataURL("image/png"),
            download: value,
          });
          doc.body.appendChild(a);
          a.dispatchEvent(new MouseEvent('click'));
          setTimeout(() => this.remove());
        },
        style: 'display: none',
      });
      document.body.appendChild(iframe);
    };

// hamburger menu settings
Moveit.put(first, {
    start: '0%',
    end: '14%',
    visibility: 1
});
Moveit.put(second, {
    start: '0%',
    end: '11.5%',
    visibility: 1
});
Moveit.put(middle, {
    start: '0%',
    end: '100%',
    visibility: 1
});

// hamburger menu click actions
$('.barstrigger').click(function() {
  if (!open) {
      Moveit.animate(first, {
          visibility: 1,
          start: '78%',
          end: '93%',
          duration: duration,
          delay: 0,
          timing: timing
      });
      Moveit.animate(middle, {
          visibility: 1,
          start: '50%',
          end: '50%',
          duration: duration,
          delay: 0,
          timing: timing
      });
      Moveit.animate(second, {
          visibility: 1,
          start: '81.5%',
          end: '94%',
          duration: duration,
          delay: 0,
          timing: timing
      });
      // $(".barscontainer svg path, .barscontainer svg line").css({'stroke': 'black'});
      
      $(".menu .btn").delay().slideDown(300);
      $(".menu").fadeIn(300);
  } else {
    Moveit.animate(middle, {
          visibility: 1,
          start: '0%',
          end: '100%',
          duration: duration,
          delay: 0,
          timing: timing
      });
              Moveit.animate(middle, {
          visibility: 1,
          duration: duration,
          delay: 0,
          timing: timing
      });
    Moveit.animate(first, {
          visibility: 1,
          start: '0%',
                  end: '14%',
          duration: duration,
          delay: 0,
          timing: timing
      });
    Moveit.animate(second, {
          visibility: 1,
          start: '0%',
                  end: '11.5%',
          duration: duration,
          delay: 0,
          timing: timing
      });
    // $(".barscontainer svg path, .barscontainer svg line").css({'stroke': 'white'});

    $(".menu .btn").fadeOut();
    $(".menu").fadeOut();
  }
  open = !open;
});

// resizable container
$('#mainSplitter').jqxSplitter({
//  width: "calc(100% - 1px)",
  width: "auto",
  height: "100%",
  orientation: 'horizontal',
  panels: [{ size: "50%",collapsible:false },
           { size: "50%" }]
});

// generate a random character
$("[data-design=random]").click(function() {
  alertify.message("coming soon...");
  
  // close menu
  $(".barstrigger").trigger("click");
});

// open donate dialog
$("[data-action=export]").click(function() {
  
  // before export ask to donate
  $("[data-class=setexport]").attr("class", this.className.toString()).trigger("change");
  
  // opens donate dialog
  $(".donatebanner").fadeIn();

  // close menu
  $(".barstrigger").trigger("click");
});

// save button file dialog
$("[data-class=setexport]").change(function() {
  // save as svg image
  $(".svg-export[data-class=setexport]").click(function() {
    $(".donatebanner").fadeOut();
    
    alertify.prompt("File name & type below!", "",
    function(evt, value) {
      blob = new Blob([ $(".viewer").html() ], {type: "text/html"});
      saveAs(blob, value + ".svg");

      swal(
        'Yay!',
        'You\'re was character successfully saved!',
        'success'
      );
    },
    function() {
      // User clicked cancel
    }).set('basic', true);
  });
  
  // save as png image
  $(".png-export[data-class=setexport]").click(function() {
    $(".donatebanner").fadeOut();
    
    alertify.prompt("File name & type below!", "",
    function(evt, value) {
      saveAsPNG(value + ".png");

      swal(
        'Yay!',
        'You\'re was character successfully saved!',
        'success'
      );
    },
    function() {
      // User clicked cancel
    }).set('basic', true);
  });
  
  return false;
});

// switch hands button clicked
$("[data-action=switch-hands]").click(function() {
  // detect ui left or right handed
  if ( $(".cp-holder").hasClass("cp-left") ) {
    // switch to left handed
    $(".cp-holder").addClass("cp-right");
    $(".cp-holder").removeClass("cp-left");
    
    $(".categories").addClass("fl");
    $(".categories").removeClass("fr");
    
    $('.picker').minicolors({
      position: 'top right'
    });
  } else {
    // switch to right handed
    $(".cp-holder").addClass("cp-left");
    $(".cp-holder").removeClass("cp-right");
    
    $(".categories").addClass("fr");
    $(".categories").removeClass("fl");
    
    $('.picker').minicolors({
      position: 'top left'
    });
  }
  
  // close menu
  $(".barstrigger").trigger("click");
});

// sets the color picker
$('.picker').minicolors({
  format: 'hex',
  defaultValue: "#f3fff1",
  position: 'top left',
  change: function(value, opacity) {
    
  }
});

// sets the background color
$('.picker').on("change", function() {
  $(".background").not(".feature.background").css('background', this.value);
});
$(".background").not(".feature.background").css('background', $('.picker').val());

// save svg as png test
// saveAsPNG("test.png");