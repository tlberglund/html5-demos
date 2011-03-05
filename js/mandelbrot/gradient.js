// 
//  gradient.js
//  mandelbrot
//  
//  Created by Jay Roberts on 2009-06-30.
//  Copyright 2009 GloryFish.org. Some rights reserved.
//  http://creativecommons.org/licenses/by-nc-sa/3.0/
//

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