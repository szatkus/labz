nullUse = function(a, b) {return false;};


function checkRangeC(x1, y1, x2, y2, range)
{
	if (Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)) > range) return false;
	for (var i = 0; i < obj2.length; i++)
	{
		if (!obj2[i].ghost && obj2[i].h-obj2[i].d > 8 && obj2[i].testLineCollision(x1, y1, x2, y2)) return false;
	}
	return true;
}

function checkRangeO(a, b, range)
{
	a.ghost = true;
	b.ghost = true;
	cbtemp = checkRangeC(a.x+a.w/2, a.y+a.d/2, b.x+b.w/2, b.y+b.d/2, range+a.w/2+b.w/2);
	a.ghost = false;
	b.ghost = false;
	return cbtemp;
}

function Block(name)
{
	this.name = name;
	this.level = 1;
	this.bonusLevel = 0;
	this.maxLevel = 1;
	this.exp = 0;
	this.user = null;
	this.a = 1;
	this.ap = 0;
	this.b = 0;
	this.range = 0;
	this.depends = new Array();
	this.raise = function(x)
	{
		this.turnOff(this.user);
		this.bonusLevel += x;
		this.turnOn(this.user);
	};
	this.getReqExp = function()
	{
		return((this.a*this.level+this.b));
	};
	this.getLevel = function()
	{
		return(this.level+this.bonusLevel);
	};
	this.addExp = function (x)
	{
		this.exp += x;
		if (this.level == this.maxLevel) this.exp = 0;
		while (this.exp >= this.getReqExp() && this.level < this.maxLevel)
		{
			this.turnOff(this.user);
			this.exp = 0;
			this.level++;
			this.turnOn(this.user);
		}
		for (var i = 0; i < this.depends.length; i++) this.user.findBlock(this.depends[i]).addExp(x);
	};
	this.turnOn = function(a) {this.user = a;this.turnOn2();return(true);};
	this.turnOn2 = function() {};
	this.use = nullUse;
	this.use2 = function(a, b)
	{
		if (this.canUse(a,b))
		{
			a.ap -= 6;
			this.addExp(1);
			return(this.use(a, b));
		}
		else return(false);
	};
	this.canUse = function(a, b)
	{
		return(this.canUse2(a,b) && (a.ap >= this.ap || !battle) && checkRangeO(a, b, this.range));
	};
	this.canUse2 = function(a, b) {return(true);};
	this.loop = function(a) {};
	this.turnOff = function(a) {this.turnOff2();return(true);};
	this.turnOff2 = function() {};
}

nullBlock = new Block("null");
nullBlock.level = 0;
nullBlock.maxLevel = 0;

function newStamina()
{
	stamina = new Block("Stamina");
	stamina.maxLevel = 10;
	stamina.a = 2;
	stamina.b = 1;
	stamina.lastState = 0;
	stamina.turnOn2 = function()
	{
		this.user.MaxHP += this.getLevel();
		return true;
	};
	stamina.loop = function()
	{
		if (this.user.HP < this.lastState)
		{
			this.addExp(this.lastState-this.user.HP);
		}
		this.lastState = this.user.HP;
		return true;
	};
	stamina.turnOff2 = function()
	{
		this.user.MaxHP -= this.getLevel();
		return true;
	};
	return stamina;
}

function newReflex()
{
	temp = new Block("Reflex");
	temp.maxLevel = 20;
	temp.a = 10;
	temp.b = 1;
	temp.loop = function(a)
	{
		if (battle && turn == null)
		{
			a.ready += this.getLevel();
			this.addExp(1);
		}
	};
	return temp;
}

function newAction()
{
	temp = new Block("Action");
	temp.maxLevel = 12;
	temp.a = 3;
	temp.b = 1;
	temp.loop = function(a)
	{
		if (turn == a && a.ap == 0) 
		{
			
			a.ap += this.getLevel();
			this.addExp(1);
		}
	};
	return temp;
}

function damageBound(d, b)
{
	return d+Math.round(b*Math.random());
}

function newBite()
{
	temp = new Block("Bite");
	temp.maxLevel = 10;
	temp.a = 5;
	temp.b = 1;
	temp.ap = 5;
	temp.range = 10;
	temp.use = function(a, b)
	{
		b.damage(a, damageBound(this.level, 2));
		return(true);
	};
	return temp;
}

function newPunch()
{
	temp = new Block("Punch");
	temp.maxLevel = 5;
	temp.a = 5;
	temp.b = 1;
	temp.ap = 6;
	temp.range = 20;
	temp.use = function(a, b)
	{
		//playSound("pyk");
		b.damage(a, damageBound(this.level, this.level+1));
		return(true);
	};
	return temp;
}

function newKick()
{
	temp = new Block("Kick");
	temp.maxLevel = 4;
	temp.a = 9;
	temp.b = 3;
	temp.ap = 8;
	temp.range = 30;
	temp.use = function(a, b)
	{
		//playSound("pyk");
		b.damage(a, damageBound(this.level*2, this.level+3));
		return(true);
	};
	return temp;
}

function newGlock()
{
	temp = new Block("Glock");
	temp.maxLevel = 1;
	temp.ap = 10;
	temp.range = 440;
	temp.depends[0] = "Pistols";
	temp.use = function(a, b)
	{
		b.damage(a, damageBound(15+this.user.findBlock("Pistols").getLevel()*2, 
			this.user.findBlock("Pistols").getLevel()+8));
		return(true);
	};
	temp.canUse2 = function(a, b)
	{
		return(a.findBlock("Pistols") != nullBlock);
	};
	return temp;
}

function newPistols()
{
	temp = new Block("Pistols");
	temp.maxLevel = 5;
	temp.a = 5;
	temp.b = 1;
	return temp;
}

var blocks = new Array();

function getBlockId(name)
{
	for (var i = 0; i < blocks.length; i++)
	{
		if (blocks[i].name == name) return i;
	}
	return -1;
}

function getBlock(name)
{
	t = getBlockId(name);
	if (t > -1) return blocks[t];
	else return nullBlock;
}

function newHuman()
{
	stamina = new Block("Human");
	stamina.maxLevel = 1;
	stamina.turnOn2 = function()
	{
		this.user.findBlock("Stamina").raise(10);
		this.user.findBlock("Reflex").raise(20);
		this.user.findBlock("Action").raise(7);
		return true;
	};
	stamina.turnOff2 = function()
	{
		this.user.findBlock("Stamina").raise(-10);
		this.user.findBlock("Reflex").raise(-20);
		this.user.findBlock("Action").raise(-7);
		return true;
	};
	return stamina;
}

function newDog()
{
	stamina = new Block("Dog");
	stamina.maxLevel = 1;
	stamina.turnOn2 = function()
	{
		this.user.findBlock("Stamina").raise(5);
		this.user.findBlock("Reflex").raise(30);
		this.user.findBlock("Action").raise(9);
		return true;
	};
	stamina.turnOff2 = function()
	{
		a.findBlock("Stamina").raise(-5);
		a.findBlock("Reflex").raise(-30);
		a.findBlock("Action").raise(-9);
		return true;
	};
	return stamina;
}

function collectBlocks()
{
	blocks[blocks.length] = nullBlock;
	blocks[blocks.length] = newStamina();
	blocks[blocks.length] = newAction();
	blocks[blocks.length] = newReflex();
	blocks[blocks.length] = newBite();
	blocks[blocks.length] = newPunch();
	blocks[blocks.length] = newKick();
	blocks[blocks.length] = newPistols();
	blocks[blocks.length] = newGlock();
	blocks[blocks.length] = newHuman();
	blocks[blocks.length] = newDog();
}
