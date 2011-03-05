 
/**
 * The equation. Returns the number of iterations required for the supplied point on the complex plane to escape.
 * 
 * @param {int} cx Point x on the complex plane.
 * @param {int} cy Point y on the xomplex plane.
 * @param {int} max The maximum number of iterations to attempt before giving up.
 */
function get_iterations(cx, cy, max) {
	var iteration = 1;
	
	var x = cx;
	var y = cy;

	while ( (x*x) + (y*y) < 4  &&  (iteration < max) ) { // Point has not escaped, max_iterations not yet reached
		var temp_x = (x*x) - (y*y) + cx;
    	y = (2 * x * y) + cy;
		x = temp_x;
		
		iteration++;
	}
	
	// var mu = (iteration + 1) - (Math.log (Math.log  (Math.sqrt( x * x + y * y ))) / Math.log(2));
	// return mu;

	return iteration;
}


onmessage = function(event) {
  var settings = event.data.settings;
  var width = event.data.width;
  var height = event.data.height;
  var gradient = event.data.gradient;
  var image = event.data.image;
  
  var dx = (settings.max_x - settings.min_x) / width;
	var dy = (settings.max_y - settings.min_y) / height;

	// This is the color used for the set itself, commonly black
	var set_color    = {};
	set_color.red    = 0;
	set_color.green  = 0;
	set_color.blue   = 0;
	set_color.alpha  = 255;

	// Loop over each pixel
	for (var y = 0; y < height; y++) {
		for (var x = 0; x < width; x++) {

			var cx = settings.min_x + (x * dx);
			var cy = settings.max_y - (y * dy);
			
			var iterations = get_iterations(cx, cy, settings.max_iterations);
	
			var color;
			if (iterations == settings.max_iterations) {
				color = set_color;
			} else {
				color = gradient[iterations - 1];
			}

			var i = ((y * width) + x) * 4; // Convert 2D coordinats to 1D array coordinates.
			
			image.data[i]     = color.red; // red channel
			image.data[i + 1] = color.green; // green channel
			image.data[i + 2] = color.blue; // blue channel
   		image.data[i + 3] = color.alpha; // alpha channel
			
		}
	}
	
	postMessage(image);
};