// 
//  main.js
//  mandelbrot
//  
//  Created by Jay Roberts on 2009-06-12.
//  Copyright 2009 GloryFish.org. Some rights reserved.
//  http://creativecommons.org/licenses/by-nc-sa/3.0/
//

var current_gradient;
var current_settings;


/**
 * Generates an array of colors representing a smooth transition betwene two starting colors.
 * 
 * @param {Color} start_color The color to start from. Is an object with integer parameters for red, green, blue, and alpha 
 * @param {Color} end_color The color to end on. Is an object with integer parameters for red, green, blue, and alpha 
 * @param {int} steps The number of discreet colors to include in the array.
 */
function get_gradient(start_color, end_color, steps) { 
		  var step = {};
        step.red    = (end_color.red - start_color.red) / (steps); 
        step.green  = (end_color.green - start_color.green ) / (steps); 
        step.blue   = (end_color.blue  - start_color.blue) / (steps); 
        step.alpha  = (end_color.alpha - start_color.alpha) / (steps); 
         
        var gradient = {}; 
         
        for(var i = 0; i < steps; i++) 
        { 
				var color = {};
				color.red    = Math.floor(start_color.red    + (step.red   * i));
				color.green  = Math.floor(start_color.green  + (step.green * i));
				color.blue   = Math.floor(start_color.blue   + (step.blue  * i));
				color.alpha  = Math.floor(start_color.alpha  + (step.alpha  * i));
	
            gradient[i] = color;
        } 
         
        return gradient; 
}

function write_log(message) {
	$('div#log').append('<span class="time">' + message + '</span>');
}

function clear_log() {
	$('div#log').empty();
}

function get_settings(x, y, width, max_iterations) {
	var half = width / 2;

	var settings = {};
	settings.min_x = x - half;
	settings.min_y = y - half;
	settings.max_x = x + half;
	settings.max_y = y + half;
	settings.max_iterations = max_iterations;
	
	return settings;
}


function draw_set(context, settings, gradient) {

  var width = $('canvas#mandelbrot').width();
  var height = $('canvas#mandelbrot').height();
  var image = context.createImageData(width, height);
  
  var worker = new Worker('mandelbrot-worker.js');
  console.log(worker);
  
  worker.onerror = function(error) {
    console.log("MANDELBROT WORKER ERROR:");
    console.log(error);
  }
  
  worker.onmessage = function(event) {
  	context.putImageData(event.data, 0,0);
  }
  
  var work = {
    settings: settings,
    width: width,
    height: height,
    gradient: gradient,
    image: image
  };
  
  console.log(work);
  worker.postMessage(work);
  console.log("Returned from Mandelbrot worker postMessage()");
	
}

$(document).ready(function() {
	var canvas = $('canvas#mandelbrot').get(0);
	if (canvas.getContext){
		var context = canvas.getContext('2d');

		$('canvas#mandelbrot').click(function(e) {
			var point = {};
			point.x = e.clientX - e.currentTarget.offsetLeft;
			point.y = e.clientY - e.currentTarget.offsetTop;

			var set = {};
			set.x = current_settings.min_x + (point.x / $('canvas#mandelbrot').width())  * (current_settings.max_x - current_settings.min_x);
			set.y = current_settings.max_y - (point.y / $('canvas#mandelbrot').height()) * (current_settings.max_y - current_settings.min_y);

			current_settings = get_settings(set.x, set.y, current_settings.max_x - current_settings.min_x, current_settings.max_iterations);

			draw_set(context, current_settings, current_gradient);
		});

		$('a.zoom-in').click(function() {
			var width = current_settings.max_x - current_settings.min_x; 
			var x = current_settings.min_x + (width / 2);
			var y = current_settings.max_y - (width / 2);

			// Reduce width by 10%
			width = width * 0.85;
			
			current_settings = get_settings(x, y, width, current_settings.max_iterations);
			
			// Redraw set
			draw_set(context, current_settings, current_gradient);
		});

		$('a.zoom-out').click(function() {
			var width = current_settings.max_x - current_settings.min_x; 
			var x = current_settings.min_x + (width / 2);
			var y = current_settings.max_y - (width / 2);

			// Increase width by 10%
			width = width * 1.15;
			
			current_settings = get_settings(x, y, width, current_settings.max_iterations);
			
			// Redraw set
			draw_set(context, current_settings, current_gradient);
		});

		time.setReportMethod(write_log);

		current_settings = get_settings(-0.5, 0, 2, 128); // Starting point for set
		
		// Create a gradient
		var start_color   = {};
		start_color.red   = 255;
		start_color.green = 0;
		start_color.blue  = 0;
		start_color.alpha = 255;
		var end_color   = {};
		end_color.red   = 0;
		end_color.green = 0;
		end_color.blue  = 255;
		end_color.alpha = 255;

		current_gradient = get_gradient(start_color, end_color, current_settings.max_iterations);
		
		time.start('Generate Set');
		draw_set(context, current_settings, current_gradient);
		time.stop('Generate Set');

		time.report('Generate Set');
		
	} else {
		alert('Canvas element not supported.');
	}
});

