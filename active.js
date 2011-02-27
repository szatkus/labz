//Active objects
var obj3 = new Array();

const TEAM_NONE = 0;
const TEAM_DOGS = 1;
const TEAM_PEOPLE = 2;
const TEAM_PLAYER = 3;

var lastTeam = 4;

var team = new Array();

function setTeam(x, y, v)
{
	if (!team[x]) team[x] = new Array();
	if (!team[y]) team[y] = new Array();
	team[y][x] = team[x][y] = v;
}

function checkTeam(x, y, v)
{
	if (!team[x]) team[x] = new Array();
	if (!team[y]) team[y] = new Array();
	
	if (!team[x][y]) team[x][y] = 0;
	if (x == y) team[x][x] = 1;
	return team[x][y];
}

function ActiveObject(name)
{
	this.name = name;
	this.vx = 0;
	this.vy = 0;
	this.speed = 0;
	this.HP = 1;
	this.MaxHP = 1;
	this.regen = 0;
	this.target = null;
	this.ready = 0;
	this.ap = 0;
	this.team = TEAM_NONE;
	this.blocks = new Array();
	//AI datas
	this.side = (Math.random() > 0.5);
	this.waypointX = new Array();
	this.waypointY = new Array();
	this.waypointD = new Array();
	this.ai = function() {}
	this.interact = function(a) {}
}

ActiveObject.prototype = new GameObject();

var nullActive = new ActiveObject();

ActiveObject.prototype.addBlock = function(a)
{
	if (this.findBlock(a.name) == nullBlock)
	{
		this.blocks[this.blocks.length] = a;
		a.turnOn(this);
	}
}

ActiveObject.prototype.damage = function(a, d)
{
	this.HP -= d;
	newFloatingInfo(d.toString(), this.x+this.w/2, this.y+this.d-this.h);
	if (a != null)
	{
		setTeam(a.team, this.team, -1);
		this.target = a;
		startBattle();
	}
	addLog(this.name+" lost "+d+" HP");
}

ActiveObject.prototype.findBlock = function(name)
{
	for (i15 = 0; i15 < this.blocks.length; i15++)
	{
		if (this.blocks[i15].name == name) return this.blocks[i15];
	}
	return nullBlock;
}

ActiveObject.prototype.addExp = function(x)
{
	for (jxp = 0; jxp < this.blocks.length; jxp++) 
	{
		this.blocks[jxp].user = this;
		this.blocks[jxp].addExp(x);
	}
}

ActiveObject.prototype.move = function(angle)
{
	this.vx = this.speed*Math.cos(angle);
	this.vy = this.speed*Math.sin(angle);
}

ActiveObject.prototype.moveEx = function(angle, ex)
{
	this.vx = ex*Math.cos(angle);
	this.vy = ex*Math.sin(angle);
}

ActiveObject.prototype.action = function()
{
	if (battle && (this.vx != 0 || this.vy != 0)) 
	{
		if (this.ap > 0) this.ap--;
		else this.stop();
	}
	if (this.vx != 0)
	{
		for (iv = 1; iv <= Math.abs(this.vx); iv++)
		{
			if (this.vx > 0) this.x++;
			else this.x--;
			if (this.isCollisionEx(1)) 
			{
				if (this.vx > 0) this.x--;
				else this.x++;
				this.vx = 0;
			}
		}
	}
	if (this.vy != 0)
	{
		for (iv = 1; iv <= Math.abs(this.vy); iv++)
		{
			if (this.vy > 0) this.y++;
			else this.y--;
			if (this.isCollisionEx(1)) 
			{
				if (this.vy > 0) this.y--;
				else this.y++;
				this.vy = 0;
			}
		}
	}
}

ActiveObject.prototype.stop = function()
{
	this.vx = 0;
	this.vy = 0;
}

ActiveObject.prototype.checkTeam = function(a)
{
	return checkTeam(this.team, a.team);
}

ActiveObject.prototype.recovery = function()
{
	this.HP = this.MaxHP;
}

ActiveObject.prototype.die = function()
{
	addTerrain(new Terrain(loadImage("dead.png"), this.w, this.d, this.x, this.y, this.w, this.d));
	removeObject(this);
}

function newCreature(name)
{
	atemp = new ActiveObject(name);
	atemp.addBlock(newStamina());
	atemp.addBlock(newReflex());
	atemp.addBlock(newAction());
	atemp.recovery();
	return atemp;
}

function newHumanCreature(name)
{
	atemp = newCreature(name);
	atemp.addBlock(newHuman());
	atemp.addBlock(newPunch());
	atemp.addBlock(newKick());
	atemp.recovery();
	return atemp;
}

function startBattle()
{
	battle = true;
	turn = null;
}

var battle = false;
var turn = null;
