/**
 * Found at
 *   http://stackoverflow.com/questions/21605989/how-to-draw-a-polygon-using-easeljs
 *
 * Thanks to Tyris.
 **/

(createjs.Graphics.Polygon = function(x, y, points) {
    this.x = x;
    this.y = y;
    this.points = points;
}).prototype.exec = function(ctx) {
    var start = this.points[0];
    ctx.moveTo(start.x, start.y);
    this.points.slice(1).forEach(function(point) {
        ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(start.x, start.y);
}
createjs.Graphics.prototype.drawPolygon = function(x, y, args) {
    var points = [];
    if (Array.isArray(args)) {
        args.forEach(function(point) {
            point = Array.isArray(point) ? {x:point[0], y:point[1]} : point;
            points.push(point);
        });
    } else {
        args = Array.prototype.slice.call(arguments).slice(2);
        var x = null;
        args.forEach(function(val) {
            if (x == null) {
                x = val;
            } else {
                points.push({x: x, y: val});
                x = null;
            }
        });
    }
    return this.append(new createjs.Graphics.Polygon(x, y, points));
}
