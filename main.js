/**
 * Inspiration:
 *   http://jsfiddle.net/sebastian_derossi/PYxu7/
 *
 * @author  Ikaros Kappler
 * @date    2016-02-26
 * @version 1.0.0
 **/

(function($) {

    $( document ).ready( function() {

	var canvasWidth  = 800;
	var canvasHeight = 600;
	var origin       = { x : canvasWidth/2.0,
			     y : canvasHeight/2.0
			   };
	
	function onTriangleMouseOver( event ) {
	    //console.debug( "[mouse over]" );
	    //console.debug( "Event: " + event + ", hIndex=" + event.target.hIndex + ", vIndex=" + event.target.vIndex );
	    //event.target.color = "#"+((1<<24)*Math.random()|0).toString(16);
	    //IKRS.Regular2DTriangulation.fillTriangle( event.target );
	}

	function onTriangleInit( triangle ) {
	    // Valid event listener names are
	    // - click
	    // - mousedown
	    // - dblclick
	    // - pressmove
	    // - pressup
	    // - mouseover / mouseout
	    // - rollover / rollout
	    triangle.addEventListener( "mouseover", onTriangleMouseOver );
	    //var relativeDistance = Math.sqrt( Math.pow(triangle.hIndex,2) + Math.pow(triangle.vIndex,2) );
	    var distance         = { x : triangle.x-origin.x,
				     y : triangle.y-origin.y
				   };
	    var relativeDistance = Math.sqrt( Math.pow(distance.x,2) + Math.pow(distance.y,2) );
	    var intensity        = Math.min( 1.0,
					     relativeDistance / (Math.min( canvasWidth, canvasHeight )/2.0 )
					   );
	    //console.debug( "distance=" + JSON.stringify(distance) + ", relativeDistance=" + relativeDistance + ", intensity=" + intensity );
	    // ORANGE AND COLORFUL
	    //    triangle.color = "#" + Math.floor(0xFF8800*intensity*2).toString(16);

	    // ORANGE ON BLACK
	    /*
	    intensity = 1.0-intensity;
	    triangle.color = 
		"rgb(" + Math.round(255*intensity) + "," +
		Math.round(64*intensity) + "," +
		Math.round(0*intensity) + ")";
	    */
	    // ORANGE WITH SOME RANDOM BITS
	    /*
	    intensity *= (1.0 - Math.random()*0.3 );
	    intensity = 1.0-intensity;
	    triangle.color = 
		"rgb(" + Math.round(255*intensity) + "," +
		Math.round(64*intensity) + "," +
		Math.round(0*intensity) + ")";
	    */
	    var additional = Math.random()*0.5;
	    intensity = 1.0-intensity;
	    triangle.color = 
		"rgb(" + Math.round(255*intensity) + "," +
		Math.min(255,Math.round(64*intensity+192*additional)) + "," +
		Math.min(255,Math.round(0*intensity+255*additional)) + ")";
	    //console.debug( "intensity=" + intensity + ", color=" + triangle.color );
	}
	// Init sage
	this.stage = new createjs.Stage( "triangleCanvas" );
	this.stage.enableMouseOver( 10 );  // peeks per second (default=20)
	window.triangulation = new IKRS.Regular2DTriangulation( { stage          : this.stage,
								  size           : 32,
								  width          : canvasWidth,
								  height         : canvasHeight,
								  origin         : origin,
								  up             : false,
								  onTriangleInit : onTriangleInit
								} );
	var _self = this;
	function tick() {
	    //console.debug( "tick" );
	    _self.stage.update();
	}
	createjs.Ticker.addEventListener('tick', tick);

    } );

})(jQuery);
