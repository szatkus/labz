function findTarget(a, require)
{
	limit = 0;
	do
	{
		ia = Math.round(Math.random()*(obj3.length-1));
		limit++;
	}
	while (a.checkTeam(obj3[ia]) >= require && limit < 100);
	if (a.checkTeam(obj3[ia]) < require)
	{
		a.target = obj3[ia];
		setTeam(a.team, obj3[ia].team, -1);
	}
	if (a.target != null) addLog(a.name+" choose "+a.target.name);
}

function updateWaypoint(a, x, y)
{
	if (a.waypointX.length == 0 || getDL(a.waypointX[0], a.waypointY[0], x, y) > a.w)
	{
		a.waypointX.length = 0;
		a.waypointY.length = 0;
		a.waypointD.length = 0;
		a.waypointX[0] = x;
		a.waypointY[0] = y;
		a.waypointD[0] = Math.round(Math.random()*3);
	}
}

function useSomething(a)
{
	limit = 0;
				do
				{
					ia = Math.round(Math.random()*(a.blocks.length-1));
					limit++;
				}
				while (!a.blocks[ia].canUse(a, a.target) && limit < 100);
				if (a.blocks[ia].canUse(a, a.target))
				{
					a.blocks[ia].use2(a, a.target);
					turn = null;
					return true;
				} else return false;
}

var dumbAIAggressive = function()
{
		if (!battle)
		{
			if ((this.vx)*(this.vx)+(this.vy)*(this.vy) < (this.speed)*(this.speed))
			{
				this.move(Math.PI*2*Math.random());
			}
			if (this.nearest("hero") < 600) 
			{
				for (var i = 0; i < obj3.length; i++)
				{
					if (this.checkTeam(obj3[i]) < 1) setTeam(this.team, obj3[i].team, -1);
				}
				startBattle();
				this.waypointX[0] = 0;
				this.waypointY[0] = 0;
				addLog(this.name+" attacks");
				findTarget(this, 1);
			}
		}
	else
	{
		if (turn == this) 
		{
			if (this.target != null && this.getDL(this.target) < 1200)
			{
				if (this.target.x != this.waypointX[0] || this.target.y != this.waypointY[0]) this.findRoute(this.x, this.y, this.target.x, this.target.y);
				if (!useSomething(this)) this.go();
			}
			else 
			{
				findTarget(this, 1);
				if (this.target == null) turn = null;
			}
		}
	}
	
};

function stroll(a, ex)
{
	if ((a.vx)*(a.vx)+(a.vy)*(a.vy) < ex) a.moveEx(Math.PI*2*Math.random(), ex);
}

var dumbAIPeace = function()
{
	if (!battle) 
	{
		if (this.nearest("ActiveObject") > 100) stroll(this, 3);
		else this.stop();
	}
	else
	{
		if (turn == this) 
		{
			this.ap--;
			if (this.target != null && this.getDL(this.target) < 1200)
			{
				updateWaypoint(this, this.target.x, this.target.y);
				//if (!useSomething(this));
			}
			else 
			{
				findTarget(this, 1);
				if (this.target == null) turn = null;
			}
		} 
	}
};

ActiveObject.prototype.go = function()
{
	
	dl = getDL(this.x, this.y, this.waypointX[this.waypointX.length-1], this.waypointY[this.waypointY.length-1]);
	while (dl < 10 || (this.x == this.waypointX[this.waypointX.length-1] && this.y == this.waypointY[this.waypointY.length-1]))
	{
		this.waypointX.length--;
		this.waypointY.length = this.waypointX.length;
		this.waypointD.length = this.waypointX.length;
		dl = getDL(this.x, this.y, this.waypointX[this.waypointX.length-1], this.waypointY[this.waypointY.length-1]);
	}
	this.vx = ((this.waypointX[this.waypointX.length-1]-this.x)/dl)*this.speed;
	this.vy = ((this.waypointY[this.waypointY.length-1]-this.y)/dl)*this.speed;
};

ActiveObject.prototype.findRoute = function(x1, y1, x2, y2)
{
	this.waypointX[0] = x2;
	this.waypointY[0] = y2;
	this.waypointD[0] = 0;
	this.waypointX[1] = x1;
	this.waypointY[1] = y1;
	this.waypointD[1] = 0;
	this.waypointX.length = 2;
	this.waypointY.length = 2;
	this.waypointD.length = 2;
	ia = 1;
	limit = 0;
	while (ia > 0 && limit < 100)
	{
		this.ghost = true;
		this.target.ghost = true;
		nullActive.x = this.waypointX[ia-1];
		nullActive.y = this.waypointY[ia-1];
		nullActive.w = this.w;
		nullActive.d = this.d;
		while (nullActive.isCollisionEx(1))
		{
			nullActive.x += Math.cos(this.waypointD[ia-1]);
			nullActive.y += Math.sin(this.waypointD[ia-1]);
		}
		this.waypointX[ia-1]= nullActive.x;
		this.waypointY[ia-1] = nullActive.y;
		nullActive.x = this.waypointX[ia];
		nullActive.y = this.waypointY[ia];
		nullActive.w = this.w;
		nullActive.d = this.d;
		while (nullActive.isCollisionEx(1))
		{
			nullActive.x += Math.cos(this.waypointD[ia]);
			nullActive.y += Math.sin(this.waypointD[ia]);
		}
		this.waypointX[ia]= nullActive.x;
		this.waypointY[ia] = nullActive.y;
		best = null;
		tx1 = this.waypointX[ia];
		ty1 = this.waypointY[ia];
		tx2 = this.waypointX[ia-1];
		ty2 = this.waypointY[ia-1];
		for (var i = 0; i < obj2.length; i++)
		{
			if (obj2[i].testLineCollision(this.waypointX[ia], this.waypointY[ia], this.waypointX[ia-1], this.waypointY[ia-1]))
			{
				if (obj2[i] != this && obj2[i] != this.target && (best == null || 
					obj2[i].getDLC(this.waypointX[ia], this.waypointY[ia]) < best.getDLC(this.waypointX[ia], this.waypointY[ia])))
					best = obj2[i];
			}
		}
		addLog(ia);
		if (best != null)
		{
			for (var i = this.waypointX.length-1; i >= ia; i--)
			{
				this.waypointX[i+2] = this.waypointX[i];
				this.waypointY[i+2] = this.waypointY[i];
				this.waypointD[i+2] = this.waypointD[i];
			}
			by = 0;
			bx = 0;
			if (ty1 > best.y+best.d)
			{
				by = ty1-best.y-best.d;
			}
			if (tx1 > best.x+best.w)
			{
				bx = tx1-best.x-best.w;
			}
			if (ty1 < best.y)
			{
				by = ty1-best.y;
			}
			if (tx1 < best.x)
			{
				bx = tx1-best.x;
			}
			addLog(bx+"x"+by);
			if (bx == 0 || Math.abs(by)>=Math.abs(bx))
			{
				if (by > 0)
				{
					this.waypointX[ia] = best.x+best.w+8;
					this.waypointY[ia] = best.y-this.d-8;
					this.waypointD[ia] = 0;
					this.waypointX[ia+1] = best.x+best.w+8;
					this.waypointY[ia+1] = best.y+best.d+8;
					this.waypointD[ia+1] = 0;
				}
				else
				{
					this.waypointX[ia] = best.x-this.w-8;
					this.waypointY[ia] = best.y+this.d+8;
					this.waypointD[ia] = Math.PI;
					this.waypointX[ia+1] = best.x-this.w-8;
					this.waypointY[ia+1] = best.y-8;
					this.waypointD[ia+1] = Math.PI;
				}
			}
			if (by == 0 || Math.abs(bx)>=Math.abs(by))
			{
				if (bx > 0)
				{
					addLog("a"+ia);
					this.waypointX[ia] = best.x-this.w-8;
					this.waypointY[ia] = best.y-this.d-8;
					this.waypointD[ia] = Math.PI/2;
					this.waypointX[ia+1] = best.x+best.w+8;
					this.waypointY[ia+1] = best.y-this.d-8;
					this.waypointD[ia+1] = Math.PI/2;
				}
				else
				{
					
					this.waypointX[ia] = best.x+best.w+8;
					this.waypointY[ia] = best.y+best.d+8;
					this.waypointD[ia] = 3*Math.PI/2;
					this.waypointX[ia+1] = best.x-this.w-8;
					this.waypointY[ia+1] = best.y+best.d+8;
					this.waypointD[ia+1] = 3*Math.PI/2;
				}
			}
			ia+=3;
		}
		ia--;
		limit++;
	}
	this.ghost = false;
		this.target.ghost = false;
};
