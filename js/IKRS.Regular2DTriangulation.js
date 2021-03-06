/**
 * This class makes overlaying triangle patterns of regular triangles.
 *
 * It uses the create.js library.
 *
 * @author  Ikaros Kappler
 * @date    2016-02-26
 * @version 1.0.0
 **/

var Point = function(x, y) {
    this.x = x;
    this.y = y;
};


/**
 * The constructor.
 *
 * The options object needs to have these members:
 * @param {number}  options.size   
 * @param {int}     options.width 
 * @param {int}     options.height 
 * @param {object}  options.origin { x, y }
 * @param {boolean} options.up     Indicates if the first triangle is upside.
 * @param {function} options.onmousein
 * @param {function} options.onmouseout
 *  -
 **/
IKRS.Regular2DTriangulation = function( options ) {

    IKRS.Object.call( this, options );

    this.options = options;
    if( typeof this.options.size == "undefined" )
	this.options.size = 32;
    if( typeof options.width == "undefined" )
	this.options.width = 800;
    if( typeof options.height == "undefined" )
	this.options.height = 600;
    if( typeof options.origin == "undefined" )
	this.options.origin = { x : this.options.width/2.0, y : this.options.height/2.0 };
    if( typeof options.up == "undefined" )
	this.options.up = false;

    this.matrix = new Array();
    this._makeTriangles( this.options.size,
			 this.options.origin			 
		       );
};

IKRS.Regular2DTriangulation.prototype                = Object.create( IKRS.Object.prototype );
IKRS.Regular2DTriangulation.prototype.constructor    = IKRS.Regular2DTriangulation;


/**
 * Fill the area with triangles.
 **/
IKRS.Regular2DTriangulation.prototype._makeTriangles = function( size,
								 origin
							       ) {
    console.debug( "_makeTriangles" );
    console.debug( "createjs is defined? " + (typeof createjs=="undefined"?"no":"yes") );
    
    var tLength = this.options.size;
    var tHeight = Math.sqrt( Math.pow(this.options.size,2) - Math.pow(this.options.size/2.0,2) );

    var up = this.options.up; // true;
    // Draw triangle rows down from origin
    var hIndex = 0;
    for( var x = this.options.origin.x; x < this.options.width+tLength/2.0; x+= tLength/2.0 ) {
	this._makeTriangleColumn( { x : x, //this.options.origin.x,
				    y : this.options.origin.y
				  },
				  tLength,
				  tHeight,
				  up,     // center triangle up?
				  hIndex
				);
	hIndex++;
	up = !up;
    }
    // Draw triangle rows up from origin
    up = !this.options.up; // false;
    hIndex = -1;
    for( var x = this.options.origin.x-tLength/2.0; x >= -tLength/2.0; x-= tLength/2.0 ) {
	this._makeTriangleColumn( { x : x, //this.options.origin.x,
				    y : this.options.origin.y
				  },
				  tLength,
				  tHeight,
				  up,     // center triangle up?
				  hIndex
			     );
	hIndex--;
	up = !up;
    }
};

IKRS.Regular2DTriangulation.prototype._makeTriangleColumn = function( pos,
								      tLength,
								      tHeight,
								      up,
								      hIndex
								    ) {
    // Build row to the right
    this.matrix[ hIndex ] = new Array();
    var tmpUp  = up;
    var vIndex = 0;
    for( var y = pos.y; y <= this.options.height; y+= tHeight ) {	
	var triangle = this._makeTriangleAt( { x : pos.x,
					       y : y
					     },
					     tLength,
					     tHeight,
					     tmpUp,
					     hIndex, vIndex
					   );
	vIndex++;
	tmpUp = !tmpUp;
	// this.options.stage.addChild( triangle );	
    }

    // Build row to the left
    //var tmpUp = up;
    tmpUp  = !up;
    vIndex = -1;
    for( var y = pos.y-tHeight; y >= 0; y-= tHeight ) {	
	var triangle = this._makeTriangleAt( { x : pos.x,
					       y : y
					     },
					     tLength,
					     tHeight,
					     tmpUp,
					     hIndex, vIndex
					   );
	vIndex--;
	tmpUp = !tmpUp;
		
    }
    
    this.options.stage.update();
};

IKRS.Regular2DTriangulation.prototype._makeTriangleAt = function( pos,
								  tLength,
								  tHeight,
								  up,
								  hIndex,
								  vIndex
								) {
    var triangle = new createjs.Shape();
    // Draw outline?
    //triangle.graphics.beginStroke("black").setStrokeStyle(1);
    var color = "#"+((1<<24)*Math.random()|0).toString(16);
    triangle.color = color;
    //triangle.graphics.beginFill( color );
    var points = [];
    if( up ) {
	points.push( new Point( 0          , -tHeight/2.0 ) );
	points.push( new Point( tLength/2.0,  tHeight/2.0 ) );
	points.push( new Point(-tLength/2.0,  tHeight/2.0 ) );
	/*
	triangle.graphics
	    .moveTo(  0          , -tHeight/2.0 )
	    .lineTo(  tLength/2.0,  tHeight/2.0 )
	    .lineTo( -tLength/2.0,  tHeight/2.0 )
	    .lineTo(  0          , -tHeight/2.0 )
	    .closePath();
	*/
    } else { // down
	points.push( new Point( 0          ,  tHeight/2.0 ) );
	points.push( new Point(-tLength/2.0, -tHeight/2.0 ) );
	points.push( new Point( tLength/2.0, -tHeight/2.0 ) );
	/* 
	triangle.graphics
	    .moveTo(  0          ,  tHeight/2.0 )
	    .lineTo( -tLength/2.0, -tHeight/2.0 )
	    .lineTo(  tLength/2.0, -tHeight/2.0 )
	    .lineTo(  0          ,  tHeight/2.0 )
	    .closePath();
	*/
    }
    triangle.points = points;       
    triangle.x += pos.x;
    triangle.y += pos.y;   
    triangle.hIndex = hIndex;
    triangle.vIndex = vIndex;
    
    this.matrix[ hIndex ][ vIndex ] = triangle;

    if( typeof this.options.onTriangleInit == "function" )
	this.options.onTriangleInit( triangle );

    IKRS.Regular2DTriangulation.fillTriangle( triangle );
    this.options.stage.addChild( triangle );

    // return triangle;
};


IKRS.Regular2DTriangulation.fillTriangle = function( triangle ) { //graphics, points, color) {
	//console.debug( "draw ... ");
    triangle.graphics.beginFill( triangle.color );
    triangle.graphics.beginStroke( triangle.color ).setStrokeStyle(1.0);
    /*
	triangle.graphics.
	    moveTo( triangle.points[0].x, triangle.points[0].y ).
	    lineTo( triangle.points[1].x, triangle.points[1].y ).
	    lineTo( triangle.points[2].x, triangle.points[2].y ).
	    lineTo( triangle.points[0].x, triangle.points[0].y ).
	    closePath();
    */
    triangle.graphics.drawPolygon( 0, 0, triangle.points );
    triangle.graphics.endStroke();
    triangle.graphics.endFill();
    };
