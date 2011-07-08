// to be put into drawH()

timHead = document.getElementById('tim');
ctx.translate(142.0115,34.522);
ctx.rotate(angle);
ctx.scale(8*Math.sin(angle),8*Math.sin(angle));
ctx.drawImage(timHead,-47,-50,94,100);
