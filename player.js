var cx = 0;
var cy = 0;
var select = 0;

function initHero(x, y)
{
	if (location.search != "") hero = loadCharacter(location.search.substr(1));
	else hero = newHumanCreature("hero");
	hero.team = TEAM_PLAYER;
	hero.setSize(x, y, 0, 64, 128, 32);
	hero.img = loadImage("hero.png");
	addObject(hero);
	select = hero.blocks.length;
}

function playerControl()
{
	//Control character
	hero.stop();
	if (key[37]) hero.move(Math.PI);
	if (key[38]) hero.move(3*Math.PI/2);
	if (key[39]) hero.move(0);
	if (key[40]) hero.move(Math.PI/2);
	if (key[37] && key[40]) hero.move(3*Math.PI/4);
	if (key[39] && key[40]) hero.move(Math.PI/4);
	if (key[37] && key[38]) hero.move(5*Math.PI/4);
	if (key[39] && key[38]) hero.move(7*Math.PI/4);
	//Debug mode toggle
	if (key[74] && key[75] && key[76]) debug = true;
	if (key[65]) debug = false;
	//Status window
	if (key[83])
	{
		if (currentStatus == null) currentStatus = hero;
		else currentStatus = null;
		key[83] = false;
	}
	//Status window
	if (key[70])
	{
		if (currentStatus == null) currentStatus = hero.target;
		else currentStatus = null;
		key[70] = false;
	}
	//Logger
	if (key[76] || debug)
	{
		document.getElementById("log").style.display="inline";
		showLog();
	} else document.getElementById("log").style.display="none";
	if (key[32]) 
	{
		for (var i = 0; ii < obj3.length; i++)
		{
			if (hero.testCollision(obj3[i], 50))
			{
				obj3[i].interact(hero);
				i = obj3.length;
			}
		}
		key[32] = false;
	}
	//Change selection
	if ((key[67] || select >= hero.blocks.length) && hero.blocks.length > 0)
	{
		var i = select;
		select++;
		if (select >= hero.blocks.length) select = 0;
		var limit = 0;
		while (hero.blocks[select].use == nullUse && i != select && limit < hero.blocks.length*2)
		{
			select++;
			if (select >= hero.blocks.length) select = 0;
			limit++;
		}
		if (limit >= hero.blocks.length*2) select = -1;
		if (select >= 0 && i == select)
		{
			if (hero.blocks[select].use == nullUse)
			{
				select = -1;
				addLog("nothing selected");
			} else addLog(hero.blocks[select].name+" selected");
		}
		key[67] = false;
	}
	//Change target
	if (key[88] || hero.target == null) 
	{
		for (var i = 0; i < obj3.length && obj3[i] != hero.target; i++);
		i++;
		if (i >= obj3.length) i = 0;
		if (obj3[i] == hero) i++;
		if (i >= obj3.length) i = 0;
		hero.target = obj3[i];
		key[88] = false;
	}
	if (hero.target == hero) hero.target = null;
	//Use
	if (key[90] && select >= 0 && hero.blocks[select].canUse(hero, hero.target)) 
	{
		
		hero.blocks[select].use2(hero, hero.target);
		key[90] = false;
	}
	//Save character
	if (key[87]) 
	{
		if (document.getElementById("save").style.display != "inline") 
		{
			document.getElementById("saveurl").value = document.location.pathname+"?"+saveCharacter(hero);
			document.getElementById("save").style.display = "inline";
		} else document.getElementById("save").style.display = "none";
		key[87] = false;
	}
	//Hide message
	if (key[81]) 
	{
		showMessage = false;
		if (answers.length == 0) hideDialog();
		key[81] = false;
		if (hero.HP <= 0) location.href = "gameover.html?"+saveCharacter(hero);
	}
	//Toggle testRange
	if (key[82]) 
	{
		testRange = !testRange;
		key[82] = false;
	}
	//Select answer
	for (var i = 1; i < 10; i++)
	{
		if (key[48+i]) 
		{
			answer(answers[i-1]);
		}
		key[48+i] = false;
	}
	//Skip turn
	if (key[71] && turn == hero) 
	{
		turn = null;
		key[71] = false;
	}
}
