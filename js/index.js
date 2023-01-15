var defaultColor = "#fffde8",
    open = false,
    duration  = 0.3,
    timing    = 'cubic-bezier(0.7, 0, 0.3, 1)',
    appData = {
      checkHands: '',
      category: '',
      design: ''
    },
    saveAsPNG = function(value) {
      saveSvgAsPng(document.getElementById("character"), value + ".png");
    },
    appendPicker = function() {
      // some categories do not need color picker
      if ($(".body-types, .glasses, .eyes, .mouth, .head").hasClass("active")) {
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
              updateStorage();
            }
          }
        });
      }
      // detect if shoes is active
      else if ($(".shoes").hasClass("active")) {
        $('.picker').val($(".viewer svg #"+ $(".active[data-call]").attr("data-call") +" path").attr('fill')).minicolors({
          format: 'rgb',
          defaultValue: this.value,
          opacity: true,
          position: 'top left',
          change: function(value, opacity) {
            if ($("[data-call]").hasClass("active")) {
              $(".viewer svg #"+ $(".active[data-call]").attr("data-call") +" path").attr('fill', this.value);
              updateStorage();
            }
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
              updateStorage();
            }
          }
        });
      }
    },
    openInNewTab = function(url) {
      var a = document.createElement("a");
      a.target = "_blank";
      a.href = url;
      a.click();
    };

// remember design in localStorage
function updateStorage() {
  // push character to localStorage
  appData.checkHands = $("[data-action=switch-hands]").text();
  appData.category   = $(".categories .category.active").attr('data-call');
  appData.design     = $(".viewer").html();

  localStorage.setItem('FlatDesignCharacterMaker', JSON.stringify(appData));
}

// change categories
$(".categories .category").on("click", function() {
  // check if this category is already active
  if ($(this).hasClass("active")) {
    updateStorage()
    return false;
  }
  $("[data-toggle=settings-panel]").hide();
  
  // hide all other categories except the new active
  $(".categories .category").removeClass("active");
  $(this).addClass("active");
  $(".feature[data-display]").hide();
  $(".feature[data-trigger]").hide();

  // check if this is background category or not
  if($(this).hasClass("background")) {
    $(".feature[data-trigger="+ $(this).attr("data-call") +"]").show();
    $(".move-holder").hide();
   } else {
    $(".feature[data-display="+ $(this).attr("data-call") +"]").show();
    $(".move-holder").show();
   }
  
  // color picker should only be visible for some attributes
  appendPicker();

  // remember changes in localStorage
  updateStorage()
});

// change character attributes
$(".asset").on("click", function() {
  if ($("[data-call=body-types]").hasClass("active")) {
    $(".viewer #character #" + $("[data-target]").attr("data-target")).html($(this).find("g#change").html());
  } else if ($("[data-call=shoes]").hasClass("active")) {
    $(".viewer #character #" + $(".active[data-call]").attr("data-call")).html($(this).find("g#change").html());
  } else {
    $(".viewer #character #head #" + $(".active[data-call]").attr("data-call")).html($(this).find("g#change").html());
  }
  
  updateStorage();
  appendPicker();
});

// Toggle scale and position `settings-panel`
$("[data-call=settings-panel]").click(function() {
  var category = $(".categories .category.active").attr("data-call");
  
  if ( $(".feature." + category).is(":visible") ) {
    $(".feature." + category).hide();
    $("[data-toggle=settings-panel]").show();
  } else {
    $(".feature." + category).show();
    $("[data-toggle=settings-panel]").hide();
  }
});

// adjust scale and position of character attributes
$("#scaleadj").on("change", function() {
  if(!$(this).hasClass("background")) {
    if ($("[data-call=body-types]").hasClass("active")) {
      $(".viewer #character #" + $("[data-target]").attr("data-target")).attr("transform", "scale("+ $("#scaleadj").val() +") translate("+ $("#translatexadj").val() +", "+ $("#translateyadj").val() +")");
    } else if ($("[data-call=shoes]").hasClass("active")) {
      $(".viewer #character #" + $(".active[data-call]").attr("data-call")).attr("transform", "scale("+ $("#scaleadj").val() +") translate("+ $("#translatexadj").val() +", "+ $("#translateyadj").val() +")");
    } else if ($("[data-call=head]").hasClass("active")) {
      $(".viewer #character #" + $(".active[data-call]").attr("data-call")).attr("transform", "scale("+ $("#scaleadj").val() +") translate("+ $("#translatexadj").val() +", "+ $("#translateyadj").val() +")");
    } else {
      $(".viewer #character #head #" + $(".active[data-call]").attr("data-call")).attr("transform", "scale("+ $("#scaleadj").val() +") translate("+ $("#translatexadj").val() +", "+ $("#translateyadj").val() +")");
    }
  }
  updateStorage();
});
$("#translatexadj").on("change", function() {
  if(!$(this).hasClass("background")) {
    if ($("[data-call=body-types]").hasClass("active")) {
      $(".viewer #character #" + $("[data-target]").attr("data-target")).attr("transform", "scale("+ $("#scaleadj").val() +") translate("+ $("#translatexadj").val() +", "+ $("#translateyadj").val() +")");
    } else if ($("[data-call=shoes]").hasClass("active")) {
      $(".viewer #character #" + $(".active[data-call]").attr("data-call")).attr("transform", "scale("+ $("#scaleadj").val() +") translate("+ $("#translatexadj").val() +", "+ $("#translateyadj").val() +")");
    } else if ($("[data-call=head]").hasClass("active")) {
      $(".viewer #character #" + $(".active[data-call]").attr("data-call")).attr("transform", "scale("+ $("#scaleadj").val() +") translate("+ $("#translatexadj").val() +", "+ $("#translateyadj").val() +")");
    } else {
      $(".viewer #character #head #" + $(".active[data-call]").attr("data-call")).attr("transform", "scale("+ $("#scaleadj").val() +") translate("+ $("#translatexadj").val() +", "+ $("#translateyadj").val() +")");
    }
  }
  updateStorage();
});
$("#translateyadj").on("change", function() {
  if(!$(this).hasClass("background")) {
    if ($("[data-call=body-types]").hasClass("active")) {
      $(".viewer #character #" + $("[data-target]").attr("data-target")).attr("transform", "scale("+ $("#scaleadj").val() +") translate("+ $("#translatexadj").val() +", "+ $("#translateyadj").val() +")");
    } else if ($("[data-call=shoes]").hasClass("active")) {
      $(".viewer #character #" + $(".active[data-call]").attr("data-call")).attr("transform", "scale("+ $("#scaleadj").val() +") translate("+ $("#translatexadj").val() +", "+ $("#translateyadj").val() +")");
    } else if ($("[data-call=head]").hasClass("active")) {
      $(".viewer #character #" + $(".active[data-call]").attr("data-call")).attr("transform", "scale("+ $("#scaleadj").val() +") translate("+ $("#translatexadj").val() +", "+ $("#translateyadj").val() +")");
    } else {
      $(".viewer #character #head #" + $(".active[data-call]").attr("data-call")).attr("transform", "scale("+ $("#scaleadj").val() +") translate("+ $("#translatexadj").val() +", "+ $("#translateyadj").val() +")");
    }
  }
  updateStorage();
});
$("#scalerange").on("change", function() {
  $("#scaleadj").val(this.value).trigger("change");
});
$("#translatexrange").on("change", function() {
  $("#translatexadj").val(this.value).trigger("change");
});
$("#translateyrange").on("change", function() {
  $("#translateyadj").val(this.value).trigger("change");
});

// save button file dialog
$("[data-class=setexport]").change(function() {
  // save as svg image
  $(".svg-export[data-class=setexport]").click(function() {
    $(".donatebanner").fadeOut();
    
    swal({
      title: 'File name below!',
      input: 'text',
      inputPlaceholder: ".svg is added on save",
      showCancelButton: true,
      confirmButtonText: 'Save',
      showLoaderOnConfirm: true
    }).then((result) => {
      if (result.value) {
        blob = new Blob([ $(".viewer").html() ], {type: "text/html"});
        saveAs(blob, result.value + ".svg");

        swal(
          'Yay!',
          'You\'re character was successfully saved!',
          'success'
        );
      } else {
        swal(
          'Oops!',
          console.error().toString(),
          'error'
        );
      }
    });
  });
  
  // save as png image
  $(".png-export[data-class=setexport]").click(function() {
    $(".donatebanner").fadeOut();
    
    swal({
      title: 'File name below!',
      input: 'text',
      inputPlaceholder: ".png is added on save",
      showCancelButton: true,
      confirmButtonText: 'Save',
      showLoaderOnConfirm: true
    }).then((result) => {
      if (result.value) {
        saveAsPNG(result.value);

        swal(
          'Yay!',
          'You\'re was character successfully saved!',
          'success'
        );
      } else {
        swal(
          'Oops!',
          console.error().toString(),
          'error'
        );
      }
    });
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
    // switch to left handed
    $(".cp-holder").addClass("cp-right");
    $(".cp-holder").removeClass("cp-left");
    
    $(".categories").addClass("fl");
    $(".categories").removeClass("fr");
    
    $('.picker').minicolors({
      position: 'top right'
    });
    
    this.textContent = "Switch to right handed";
  } else {
    // switch to right handed
    $(".cp-holder").addClass("cp-left");
    $(".cp-holder").removeClass("cp-right");
    
    $(".categories").addClass("fr");
    $(".categories").removeClass("fl");
    
    $('.picker').minicolors({
      position: 'top left'
    });
    
    this.textContent = "Switch to left handed";
  }
  
  // close menu
  $(".barstrigger").trigger("click");

  // remember ui state
  updateStorage();
});

// clear saved character
$("[data-revert=design]").click(function() {
  swal({
    title: 'Revert to default design?',
    text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true
  }).then((result) => {
    if (result.value) {
      localStorage.clear();
      location.reload(true);
    }
  })
});

// sets the color picker
appendPicker();

// initialize localStorage
if (!localStorage.getItem('FlatDesignCharacterMaker')) {
  updateStorage()
} else {
  appData = JSON.parse(localStorage.getItem('FlatDesignCharacterMaker'));

  // update avatar design
  $(".viewer").html(appData.design);

  // go to remembered category
  $(".categories .category[data-call="+ appData.category +"]").click();

  // If stored data says 'switch to right handed'
  // means that the user chose to have the tabs
  // open the categories on the left
  if (appData.checkHands === 'Switch to left handed') {
    $(".cp-holder").addClass("cp-left");
    $(".cp-holder").removeClass("cp-right");

    $(".categories").addClass("fr");
    $(".categories").removeClass("fl");

    $('.picker').minicolors({
      position: 'top left'
    });
    
    $("[data-action=switch-hands]").text("Switch to left handed");
  }

  // If stored data says 'switch to left handed'
  // means that the user chose to have the tabs
  // open the categories on the right
  if (appData.checkHands === 'Switch to right handed') {
    $(".cp-holder").addClass("cp-right");
    $(".cp-holder").removeClass("cp-left");

    $(".categories").addClass("fl");
    $(".categories").removeClass("fr");

    $('.picker').minicolors({
      position: 'top right'
    });
    
    $("[data-action=switch-hands]").text("Switch to right handed");
  }

  localStorage.setItem('FlatDesignCharacterMaker', JSON.stringify(appData));
}

// save svg as png test
// saveAsPNG("test.png");