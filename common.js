var context;
var canvas;
var gameWidth = window.innerWidth;
var gameHeight = window.innerHeight;

function loadImage(filename)
{
	var ctemp = new Image();
	ctemp.src = filename;
	ctemp.onerror = function()
	{
		alert("common.js: cannot load image "+this.src);
	}
	return(ctemp);
}

function drawImage(img, x, y, w, h, a)
{
	//Needed for Opera
	w++;
	if (img.complete && img.width > 0 && img.height > 0)
	{
		ct++;
		context.save();
		context.translate(x+w/2, y+h/2);
		context.rotate(a);
		context.drawImage(img, -w/2, -h/2, w, h);
		context.restore();
	}
}

function drawImageEx(img, sx, sy, sw, sh, x, y, w, h, a)
{
	if (img.complete && img.width > 0 && img.height > 0)
	{
		ct++;
		context.save();
		context.translate(x+w/2, y+h/2);
		context.rotate(a);
		context.drawImage(img, sx, sy, sw, sh, -w/2, -h/2, w, h);
		context.restore();
	}
}

function testCollision(x, y, w, h, x2, y2, w2, h2, ex)
{
	return(y+h+ex > y2 && y < y2+h2+ex && x+w+ex > x2 && x < x2+w2+ex);
}

function loadSound(filename)
{
	name = filename.substring(0, filename.indexOf("."));
	document.getElementById("musicbox").innerHTML += "<audio src=\""+filename+"\" id=\"snd_"+name+"\"></audio>";
}

function getDL(x1, y1, x2, y2)
{
	return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

function playSound(name)
{
	document.getElementById("snd_"+name).play();
}

function getDL(x, y, x2, y2)
{
	return(Math.sqrt((x-x2)*(x-x2)+(y-y2)*(y-y2)));
}
