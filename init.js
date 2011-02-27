var sukin;

function init()
{
	canvas = document.getElementById("screen")
	if (canvas.getContext)
	{
		context = canvas.getContext("2d");
		canvas.width = gameWidth;
		canvas.height = gameHeight;
		collectBlocks();
		initDatabase();
		return true;
	}
	else
	{
		alert("init.js: cannot initialize canvas");
		return false;
	}
}

function initGame()
{
	if (init())
	{
		addLog("size: "+gameWidth+"x"+gameHeight);
		initHero(1000, 1000);
		//addObject(createDog(1300, 1000));
		checkSector(0, 0);
		var loopTimer = setInterval("loop()", 50);
		setInterval("countFPS()", 1000);
	}
}
