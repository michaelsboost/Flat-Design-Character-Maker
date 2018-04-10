var defaultColor = "#fffde8",
    open = false,
    duration  = 0.3,
    timing    = 'cubic-bezier(0.7, 0, 0.3, 1)',
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
    },
    initializeLocalStorage = function() {
      if ( localStorage.getItem("SVGBGColor")) {
        $(".background").not(".feature.background").css('background', localStorage.getItem("SVGBGColor"));
      }
      if ( localStorage.getItem("checkHands")) {
        // detect ui left or right handed
        if ( localStorage.getItem("checkHands") === "leftHanded" ) {
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
      }
      if ( localStorage.getItem("rememberCategory")) {
        var rememberedClass = $(".categories .category." + localStorage.getItem("rememberCategory"));
        
        // hide all other categories except the new active
        $(".categories .category").removeClass("active");

        // revert back to previous category
        rememberedClass.addClass("active");
        $(".feature[data-display]").hide();
        $(".feature[data-trigger]").hide();

        // check and see of category is background or not
        if ( localStorage.getItem("rememberCategory") === "background" ) {
          $(".feature[data-trigger="+ rememberedClass.attr("data-call") +"]").show();
         } else {
          $(".feature[data-display="+ rememberedClass.attr("data-call") +"]").show();
         }
        appendPicker();
      }
      if ( localStorage.getItem("rememberDesign")) {
        $(".viewer").html(localStorage.getItem("rememberDesign"));
      }
    },
    rememberDesign = function() {
      localStorage.setItem("rememberDesign", $(".viewer").html());
    },
    appendPicker = function() {
      // some categories do not need color picker
      if ($(".body-types, .glasses, .eyes, .mouth").hasClass("active")) {
        $('.cp-holder').empty();
        return false;
      }
      
      // add color picker to dom
      $('.cp-holder').empty().append('<input type="text" class="picker" data-opacty="1">');
      
      // detect if background is active
      if ($(".background").hasClass("active")) {
        defaultColor = tinycolor($(".background").css("background-color"));
        defaultColor = defaultColor.toHexString();

        $('.picker').val(defaultColor).minicolors({
          format: 'hex',
          defaultValue: this.value,
          position: 'top left',
          change: function(value, opacity) {
            if ($(".background").hasClass("active")) {            $(".background").not(".feature.background").css('background', this.value);
              localStorage.setItem("SVGBGColor", this.value);
              rememberDesign();
            }
          }
        });
      }
      // detect if shoes is active
      else if ($(".shoes").hasClass("active")) {
        $('.picker').val($(".viewer svg #shoes path").attr('fill')).minicolors({
          format: 'rgb',
          defaultValue: this.value,
          opacity: true,
          position: 'top left',
          change: function(value, opacity) {
            $(".viewer svg #shoes path").attr('fill', this.value);
            rememberDesign();
          }
        });
      } else {
        $('.picker').val($(".viewer svg #head #"+ $(".active[data-call]").attr("data-call") +" path").attr('fill')).minicolors({
          format: 'rgb',
          defaultValue: this.value,
          opacity: true,
          position: 'top left',
          change: function(value, opacity) {
            if ($("[data-call]").hasClass("active")) {
              $(".viewer svg #head #"+ $(".active[data-call]").attr("data-call") +" path").attr('fill', this.value);
              rememberDesign();
            }
          }
        });
      }
    };

// change categories
$(".categories .category").on("click", function() {
  // save active category
  localStorage.setItem("rememberCategory", $(this).attr("data-call"));
  
  // check if this category is already active
  if ($(this).hasClass("active")) {
    return false;
  }
  
  // hide all other categories except the new active
  $(".categories .category").removeClass("active");
  $(this).addClass("active");
  $(".feature[data-display]").hide();
  $(".feature[data-trigger]").hide();

  // check if this is background category or not
  if($(this).hasClass("background")) {
    $(".feature[data-trigger="+ $(this).attr("data-call") +"]").show();
    $()
   } else {
    $(".feature[data-display="+ $(this).attr("data-call") +"]").show();
   }
  
  // color picker should only be visible for some attributes
  appendPicker();
});

// change character attributes
$(".asset").on("click", function() {
  $(".viewer #character #" + $("[data-target]").attr("data-target")).html($(this).find("g#change").html());
  
  rememberDesign();
});

// generate a random character
$("[data-design=random]").click(function() {
  alertify.message("coming soon...");
  
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

// open donate dialog
$("[data-action=export]").click(function() {
  
  // before export ask to donate
  $("[data-class=setexport]").attr("class", this.className.toString()).trigger("change");
  
  // opens donate dialog
  $(".donatebanner").fadeIn();

  // close menu
  $(".barstrigger").trigger("click");
});

// switch hands button clicked
$("[data-action=switch-hands]").click(function() {
  // detect ui left or right handed
  if ( $(".cp-holder").hasClass("cp-left") ) {
    localStorage.setItem("checkHands", "leftHanded");
    
    // switch to left handed
    $(".cp-holder").addClass("cp-right");
    $(".cp-holder").removeClass("cp-left");
    
    $(".categories").addClass("fl");
    $(".categories").removeClass("fr");
    
    $('.picker').minicolors({
      position: 'top right'
    });
  } else {
    localStorage.setItem("checkHands", "rightHanded");

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
appendPicker();

// save design via localStorage
initializeLocalStorage();

// save svg as png test
// saveAsPNG("test.png");