var dbName = new Array();
var dbFunc = new Array();
function initDatabase()
{
	dbName[dbName.length] = "dog";
	dbFunc[dbFunc.length] = function(x, y)
	{
		dtemp = newCreature("dog");
		dtemp.setSize(x, y, 0, 64, 32, 12);
		dtemp.img = loadImage("dog.png");
		dtemp.speed = 13;
		dtemp.HP = dtemp.MaxHP = 7;
		dtemp.addBlock(newBite());
		dtemp.addBlock(newDog());
		dtemp.ai = dumbAIAggressive;
		dtemp.team = TEAM_DOGS;
		return dtemp;
	}
	dbName[dbName.length] = "traveler";
	dbFunc[dbFunc.length] = function(x, y)
	{
		dtemp = newCreature("traveler");
		dtemp.setSize(x, y, 0, 64, 128, 32);
		dtemp.img = loadImage("traveler.png");
		dtemp.speed = 8;
		dtemp.HP = dtemp.MaxHP = 13;
		dtemp.addBlock(newKick());
		dtemp.ai = dumbAIPeace;
		dtemp.team = TEAM_PEOPLE;
		return dtemp;
	}
	dbName[dbName.length] = "rock";
	dbFunc[dbFunc.length] = function(x, y)
	{
		var dtemp =  new GameObject("rock");
		dtemp.setSize(x, y, 0, 64, 64, 32);
		dtemp.img = loadImage("rock.png");
		return(dtemp);
	}
	dbName[dbName.length] = "pond";
	dbFunc[dbFunc.length] = function(x, y)
	{
		var dtemp =  new GameObject("pond");
		dtemp.setSize(x, y, 0, 128, 128, 128);
		dtemp.img = loadImage("pond.png");
		return(dtemp);
	}
	dbName[dbName.length] = "wallh";
	dbFunc[dbFunc.length] = function(x, y)
	{
		var dtemp =  new GameObject("wallh");
		dtemp.setSize(x, y, 0, 77, 128, 32);
		dtemp.img = loadImage("wall2.png");
		return(dtemp);
	}
	dbName[dbName.length] = "wallv";
	dbFunc[dbFunc.length] = function(x, y)
	{
		var dtemp =  new GameObject("wallv");
		dtemp.setSize(x, y, 0, 16, 173, 77);
		dtemp.img = loadImage("wall.png");
		return(dtemp);
	}
	dbName[dbName.length] = "palm";
	dbFunc[dbFunc.length] = function(x, y)
	{
		var dtemp =  new GameObject("palm");
		dtemp.setSize(x, y, 0, 64, 128, 48);
		dtemp.img = loadImage("palm.png");
		return(dtemp);
	}
}

function createObject(name, x, y)
{
	for (idb = 0; idb < dbName.length; idb++)
	{
		if (dbName[idb] == name) return dbFunc[idb](x,y);
	}
	return null;
}
