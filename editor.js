var mouseX = 0;
var mouseY = 0;
var mouseObject;
var sourceWin;
var editWin;
var terrainWin;
var editObj;
var terrainEdit;
dragX = 0;
dragY = 0;

function initEditor()
{
	if (init())
	{
		mode = 0;
		selection = 0;
		mouseObject = dbFunc[selection](0, 0);
		sourceWin = document.getElementById("source");
		editWin = document.getElementById("edit");
		terrainWin = document.getElementById("terrain");
		//addTerrain(new Terrain(loadImage("sand.png"), 50, 50, 0, 0, 50, 50, "#f3bd00"));
		terrainEdit = -1;
		setInterval("loop()", 50);
	}
}

function generateSource()
{
	s = "";
	for (var i = 0; i < terrain.length; i++)
	{
		s += "new Terrain(\""+terrain[i].img.src+"\", "+terrain[i].sw+", "+terrain[i].sh+", "+terrain[i].x+", "+terrain[i].y+", ";
		s += terrain[i].w+", "+terrain[i].h+", \""+terrain[i].color+"\");";
	}
	for (var i = 0; i < obj.length; i++)
	{
		if (obj[i].blocks)
		{
			etemp = createObject(obj[i].name);
			if (etemp == null || etemp.w != obj[i].w || etemp.h != obj[i].h || etemp.d != obj[i].d || etemp.img.src != obj[i].img.src)
			{
				if (etemp != null)
				{
					s +=  "etemp = createObject(\""+obj[i].name+"\", "+obj[i].x+", "+obj[i].y+");\n";
					if (etemp.w != obj[i].w) s += "etemp.w = "+obj[i].w+";\n";
					if (etemp.h != obj[i].h) s += "etemp.h = "+obj[i].h+";\n";
					if (etemp.d != obj[i].d) s += "etemp.d = "+obj[i].d+";\n";
					if (etemp.img.src != obj[i].img.src) s += "etemp.img = loadImage(\""+obj[i].img.src+"\");\n";
					s += "addObject(etemp);\n";
				}
			}
			else s += "addObject(createObject(\""+obj[i].name+"\", "+obj[i].x+", "+obj[i].y+"));\n";
		}
	}
	return s;
}

function compile()
{
	eval(document.getElementById("compile").value);
	document.getElementById("compile").value = "";
}

function loop()
{
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.save();
	context.translate(-cx, -cy);
	for (var i = 0; i < terrain.length; i++) terrain[i].draw();
	for (var i = 0; i < obj.length; i++) 
	{
		obj[i].draw();
		if (mode == 0 || mode == 2)
		{
			if (obj[i].x <= mouseX+cx && mouseX+cx <= obj[i].x+obj[i].w &&
				obj[i].y <= mouseY+cy && mouseY+cy <= obj[i].y+obj[i].d) 
			{
				context.strokeStyle = "green";
			} else context.strokeStyle = "red";
			context.strokeRect(obj[i].x, obj[i].y, obj[i].w, obj[i].d);
		}
	}
	if (key[81]) 
	{
		addTerrain(new Terrain(loadImage("sand.png"), 50, 50, 0, 0, 50, 50, "#f3bd00"));
		terrainEdit  = terrain.length-1;
		refreshEdit2();
		key[81] = false;
	}
	if (key[87]) 
	{
		mode++;
		if (mode > 3) mode = 0;
		key[87] = false;
	}
	if (key[65]) 
	{
		selection--;
		terrainEdit --;
		if (selection < 0) selection = dbName.length-1;
		if (terrainEdit < 0) terrainEdit = terrain.length-1;
		refreshEdit2();
		mouseObject = dbFunc[selection](0, 0);
		key[65] = false;
	}
	if (key[68]) 
	{
		selection++;
		terrainEdit ++;
		if (selection >= dbName.length) selection = 0;
		if (terrainEdit >= terrain.length) terrainEdit = 0;
		refreshEdit2();
		mouseObject = dbFunc[selection](0, 0);
		key[68] = false;
	}
	if (key[83]) 
	{
		sourceWin.innerHTML = "<pre>"+generateSource()+"</pre>";
		if (sourceWin.style.display == "none") sourceWin.style.display = "inline";
		else sourceWin.style.display = "none";
		key[83] = false;
	}
	if (key[66]) 
	{
		if (document.getElementById("add").style.display == "none") document.getElementById("add").style.display = "inline";
		else document.getElementById("add").style.display = "none";
		key[66] = false;
	}
	if (mode == 3 && terrainEdit >= 0) terrainWin.style.display = "inline";
	else terrainWin.style.display = "none";
	context.strokeStyle = "red";
	context.strokeRect(-1, -1, 3, 3);
	mouseObject.x = mouseX+cx+dragX;
	mouseObject.y = mouseY+cy+dragY;
	if (mode == 1) mouseObject.draw();
	if (key[37]) cx -= 25;
	if (key[38]) cy -= 25;
	if (key[39]) cx += 25;
	if (key[40]) cy += 25;
	context.restore();
}

function refreshEdit()
{
	document.getElementById("w").value = editObj.w;
	document.getElementById("h").value = editObj.h;
	document.getElementById("d").value = editObj.d;
	document.getElementById("src").value = editObj.img.src;
}

function refreshEdit2()
{
	if (terrainEdit >= 0)
	{
		document.getElementById("tw").value = terrain[terrainEdit].w;
		document.getElementById("th").value = terrain[terrainEdit].h;
		document.getElementById("tsw").value = terrain[terrainEdit].sw;
		document.getElementById("tsh").value = terrain[terrainEdit].sh;
		document.getElementById("tx").value = terrain[terrainEdit].x;
		document.getElementById("ty").value = terrain[terrainEdit].y;
		document.getElementById("tsrc").value = terrain[terrainEdit].img.src;
		document.getElementById("tcolor").value = terrain[terrainEdit].color;
	}
}

function changeEdit()
{
	editObj.w = parseInt(document.getElementById("w").value);
	editObj.h = parseInt(document.getElementById("h").value);
	editObj.d = parseInt(document.getElementById("d").value);
	editObj.img.src = document.getElementById("src").value;
}

function changeEdit2()
{
	terrain[terrainEdit].w = parseInt(document.getElementById("tw").value);
	terrain[terrainEdit].h = parseInt(document.getElementById("th").value);
	terrain[terrainEdit].sw = parseInt(document.getElementById("tsw").value);
	terrain[terrainEdit].sh = parseInt(document.getElementById("tsh").value);
	terrain[terrainEdit].x = parseInt(document.getElementById("tx").value);
	terrain[terrainEdit].y = parseInt(document.getElementById("ty").value);
	terrain[terrainEdit].img.src = document.getElementById("tsrc").value;
	terrain[terrainEdit].color = document.getElementById("tcolor").value;
}

function mouseMove(e)
{
	mouseX = e.clientX;
	mouseY = e.clientY;
}

function mouseClick(e)
{
	for (var j = 0; j < obj.length; j++) 
	{
		if (obj[j].x <= mouseX+cx && mouseX+cx <= obj[j].x+obj[j].w &&
			obj[j].y <= mouseY+cy && mouseY+cy <= obj[j].y+obj[j].d) 
		{
			if (mode == 0)
			{
				dragX = obj[j].x-mouseX;
				dragY = obj[j].y-mouseY;
				mouseObject = obj[j];
			}
			if (mode == 2)
			{
				editObj = obj[j];
				editWin.style.display = "inline";
				editWin.style.left = mouseX+"px";
				editWin.style.top = mouseY+"px";
				refreshEdit();
			}
		}
	}
	if (mode == 1) addObject(mouseObject);
}

function mouseRelease(e)
{
	mouseObject = dbFunc[selection](0, 0);
	dragX = 0;
	dragY = 0;
}
