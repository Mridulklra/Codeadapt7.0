/*  ==========================================================================
    GLOBAL VARIABLES
    ========================================================================== */  

	var percs = [22, 17, 57, 4];
	var percsRange = []; // array of percentage ranges for the arcs to animate from to
	var percsEnd = []; // array of percentages for the divider lines to animate to
	var markersAngles = []; // array of percentages for markers to be positioned mid arcs
	var $sLine = $('.mt-line'); // starting line
	var $mtText = $('.mt-text'); // media type text
	var $ring = $('.mt-ring'); // each percentage arc
	var $percLine = $('.mt-perc-line'); // percentage divider lines
	var $mtBase2 = $('.mt-base-2'); // thick white ring
	var $mtTrack = $('.mt-base-2-track'); // thick ring track
	var $mtMarker =$('.mt-marker'); // marker lines

/*  ==========================================================================
    INIT ITEMS
    ========================================================================== */  

	TweenMax.set('svg', {
		visibility: 'visible'
	});

	TweenMax.set($sLine, {
		drawSVG: '0px 2px'
	});

	TweenMax.set($percLine, {
		transformOrigin: '1px 200px',
		opacity: 0
	});

	TweenMax.set($mtBase2, {
		transformOrigin: '50% 50%',
		rotation: -90,
		drawSVG: '0% 0%'
	});

	TweenMax.set($mtTrack, {
		transformOrigin: '50% 50%',
		drawSVG: '0% 0%'
	});

	TweenMax.set($mtMarker, {
		transformOrigin: '1px 277px',
		drawSVG: '0% 0%'
	});


/*  Set each ring to its starting position and populate arrays
    ========================================================================== */  

	var addPercs = 0;
	$ring.each( function(i, val) {
		percsEnd.push(addPercs);

		var tempStart = addPercs;
		// set the starting positions
		TweenMax.set('.mt-ring-'+i, {
			drawSVG: addPercs + '% ' + addPercs + '%'
		});
		// get the ending positions and set the drawSVG ranges in an array
		addPercs = addPercs + percs[i];
		var rangeString = tempStart + '% ' + addPercs + '%';
		percsRange.push(rangeString);
		markersAngles.push((tempStart + (addPercs-tempStart)/2)/100*360);

	}); 

	percsEnd.reverse(); // reverse the array so the line travelling furthest goes first, and so on
	markersAngles.reverse(); // reverse the array so the line travelling furthest goes first, and so on


/*  ==========================================================================
    TIMELINE ANIMATION
    ========================================================================== */  

	var mtl = new TimelineMax({yoyo: true, repeat: -1, repeatDelay: 2});
		// animate the base line
		mtl.to($sLine, 0.4, {
			drawSVG: '0px 200px',
			ease: Power3.easeIn,
			delay: 0.3
		})
		.to($sLine, 0.3, {
			drawSVG: '200px 150px',
			ease: Power3.easeOut
		})
		.set($sLine, {
			opacity: 0
		})
		.set($percLine, {
			opacity: 1
		})
		// animate the title text
		.from($mtText, 0.7, { 
			y: 50, 
			autoAlpha: 0, 
			ease: Elastic.easeOut.config(1.1, 0.3) 
		}, "-=0.25")
		// animate the base circle
		.to($mtBase2, 1.4, {
			drawSVG: '0% 100%',
			ease: Power4.easeInOut
		}, "-=0.8")
		// animate the base circle track
		.to($mtTrack, 1, {
			drawSVG: '0% 100%',
			ease: Power4.easeInOut
		}, "-=1.05")
		// animate the perctage lines
		.staggerTo($percLine, 1.4, {
			cycle: {
				rotation: function(i) {
					return percsEnd[i]/100 * 360;
				}
			},
			ease:Power4.easeInOut
		}, 0.1, "-=1.2")
		// animate in marker lines
		.staggerTo($mtMarker, 0.8, {
			cycle: {
				rotation: function(i) {
					return markersAngles[i];
				}
			},
			drawSVG: '0% 100%',
			ease: Power3.easeOut
		}, 0.1, "-=0.9")
		// animate the rings
		.staggerTo($ring, 1.4, {
			cycle: {
				drawSVG: function(i) { return percsRange[i] }
			},
			ease: Power4.easeInOut
		}, 0, "-=1.3")
		.from('.mt-figures', 1, {
			opacity: 0
		}, "-=0.5");

	

/*  ==========================================================================
    SLIDER
    ========================================================================== */  

	var $slider = $('#slider'),
		sliderValue = { value: 0 };

	$slider.slider({
	  range: false,
	  min: 0,
	  max: 100,
	  step: .1,
	  start: function() {
		mtl.pause();
	  },
	  slide: function(event, ui) {
		mtl.progress(ui.value / 100);
	  },
	  stop: function() {
		mtl.play();
	  }
	});

	mtl.eventCallback("onUpdate", function() {
	  sliderValue.value = mtl.progress() * 100;
	  $slider.slider(sliderValue);
	});