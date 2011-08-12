var select = 0;

function loop()
{
	context.clearRect(0, 0, canvas.width, canvas.height);
	//Correct the visibility
	for (var i = 0; i < obj.length; i++)
	{
		obj[i].visibility(obj[i].testCollisionC(cx, cy, canvas.width, canvas.height, obj[i].h+500));
	}
	
	//Find active objects
	obj3.length = 0;
	for (var i = 0; i < obj2.length; i++)
	{
		if (obj2[i].blocks) obj3[obj3.length] = obj2[i];
	}
	//Look for ready object
	if (battle && turn != null && turn.ap <= 0) turn = null;
	if (battle && turn == null)
	{
		
		for (var i = 0; i < obj3.length; i++)
		{
			if (obj3[i].ready >= 100)
			{
				turn = obj3[i];
				turn.ready -= 100;
				turn.ap = 0;
				i = obj3.length;
			}
		}
	}
	playerControl();
	//Active objects routines
	fightingObjects = 0;
	
	for (var i = 0; i < obj3.length; i++)
	{
		if (!freezeGame)
		{
			for (var j = 0; j < obj3[i].blocks.length; j++) obj3[i].blocks[j].loop(obj3[i]);
			obj3[i].ai();
			
			if (!battle || turn == obj3[i]) obj3[i].action();
			if (obj3[i] != hero && obj3[i].target != null) fightingObjects++;
		}
	}
	if (fightingObjects <= 0) battle = false;
	//Look for dead objects
	if (hero.HP <= 0) showNotification("Oh no! Hero has died. Because of you, you bastard!");
	for (var i = 0; i < obj3.length; i++)
	{
		if (obj3[i].HP > obj3[i].MaxHP) obj3[i].HP = obj3[i].MaxHP;
		if (obj3[i].HP <= 0) obj3[i].die();
	}
	//Bubble sort
	anything = true;
	while (anything)
	{
		anything = false;
		for (var j = 0; j < obj2.length-1; j++)
		{
			if (obj2[j].y > obj2[j+1].y)
			{
				h = obj2[j];
				obj2[j] = obj2[j+1];
				obj2[j+1] = h;
				anything = true;
			}
		}
	}
	//Drawing section
	cx = hero.x-canvas.width/2;
	cy = hero.y-canvas.height/2;
	context.save();
	context.translate(-cx, -cy);
	//Refresh neighboor sectors
	checkVicinity(getSectorX(cx), getSectorY(cy), 1);
	//Counter for drawImage operations
	ct = 0;
	var i;
	for (i = 0; i < terrain.length; i++)
	{
		if (terrain[i].position == 0) terrain[i].draw();
	}
	for (i = 0; i < terrain.length; i++)
	{
		if (terrain[i].position == 20) terrain[i].draw();
	}
	if (battle && select >= 0)
	{
		i = hero.blocks[select].range;
		context.fillStyle = "rgba(128, 255, 127, 0.5)";
		//context.fillRect(hero.x-i, hero.y-i, hero.w+2*i, hero.d+2*i);
	}
	for (i = 0; i < obj2.length; i++)
	{
		obj2[i].draw();
		if (battle && obj2[i].action)
		{
			context.fillStyle = "rgba(255, 127, 127, 0.5)";
			context.fillRect(obj2[i].x, obj2[i].y, obj2[i].w, obj2[i].d);
		}
	}
	if (hero.target != null && select >= 0)
	{
		if (hero.blocks[select].canUse(hero, hero.target)) context.strokeStyle = "green";
		else context.strokeStyle = "red";
		context.strokeRect(hero.target.x, hero.target.y+hero.target.d-hero.target.h, hero.target.w, hero.target.h);
	}
	context.restore();
	context.arc(555, 555, 50, 0, 1, false);
	drawInterface();
	//Debug mode information
	if (debug) 
	{
		document.title = obj3.length+"/"+obj2.length+"/"+obj.length+"+"+terrain.length+"   "+fps+"  "+ct+ "   "+getSectorX(cx)+"x"+getSectorY(cy);
		hero.speed = 100;
	} else hero.speed = 10;
	dfps++;
}
