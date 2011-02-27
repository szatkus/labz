var currentStatus = null;
var message = "";
var notify = 0;
var showMessage = false;
var battleImg = loadImage("fight.png");
var turnImg = loadImage("turn.png");
var floatingInfo = new Array();
var maxAP = -1;

function showStatus()
{
	statusWin = document.getElementById("status");
	if (currentStatus != null)
	{
		statusWin.style.display = "inline";
		newText = "<p>HP: "+currentStatus.HP+"/"+currentStatus.MaxHP+"<br>";
		newText += "AP: "+currentStatus.ap+"<br>";
		for (i11 = 0; i11 < currentStatus.blocks.length; i11++)
		{
			temp = currentStatus.blocks[i11];
			newText += temp.name;
			if (temp.level < temp.maxLevel) newText += " "+temp.exp+"/"+temp.getReqExp();
			newText += " - lvl. "+temp.level+"+"+temp.bonusLevel+"<br>";
		}
		newText += "</p>";
		if (statusWin.innerHTML != newText) statusWin.innerHTML = newText;
	} else statusWin.style.display = "none";
}

function checkNotification()
{
	notWin = document.getElementById("notification");
	if (showMessage && notify < 200) notify += 10;
	if (!showMessage && notify > 0) notify -= 10;
	notWin.style.left = (gameWidth-200)+"px";
	notWin.style.top = (gameHeight-200)+"px";
	notWin.style.clip = "rect("+(200-notify)+"px,200px,200px, 0px)";
	notWin.innerHTML = "[press Q to hide]<br>"+message;
}

function showNotification(s)
{
	message = s;
	showMessage = true;
}

function newFloatingInfo(s, x, y)
{
	itemp = new Object();
	itemp.info = s;
	itemp.x = x;
	itemp.y = y;
	itemp.a = 1.0;
	floatingInfo[floatingInfo.length] = itemp;
}

function newFloatingInfo(s, x, y)
{
	itemp = new Object();
	itemp.info = s;
	itemp.x = x;
	itemp.y = y;
	itemp.a = 1.0;
	floatingInfo[floatingInfo.length] = itemp;
}

function drawProgress(a, b, x, y, w, h)
{
	if (a > 0) context.fillRect(x, y, w*(a/b), h);
}

function drawInterface()
{
	for (i = 0; i < floatingInfo.length; i++)
	{
		floatingInfo[i].y -= 2;
		floatingInfo[i].a -= 0.03;
		context.font = "bold 32px sans-serif";
		context.fillStyle = "rgba(0, 0, 0, "+floatingInfo[i].a+")";
		context.fillText(floatingInfo[i].info, floatingInfo[i].x-cx-1, floatingInfo[i].y-cy);
		context.font = "bold 30px sans-serif";
		context.fillStyle = "rgba(255, 255, 255, "+floatingInfo[i].a+")";
		context.fillText(floatingInfo[i].info, floatingInfo[i].x-cx, floatingInfo[i].y-cy);
		if (floatingInfo[i].a < 0.0) floatingInfo.length--;
	}
	if (battle)
	{
		if (turn == hero) 
		{
			drawImage(turnImg, 0, gameHeight-64, 64, 64, 0);
			if (maxAP == -1) maxAP = hero.ap;
			context.fillStyle = "green";
			drawProgress(hero.ap, maxAP, 0, gameHeight-96, 64, 32);
			context.fillStyle = "orange";
			if (select >= 0) drawProgress(hero.ap-hero.blocks[select].ap, maxAP, 0, gameHeight-96, 64, 32);
		}
		else 
		{
			drawImage(battleImg, 0, gameHeight-64, 64, 64, 0);
			maxAP = -1;
		}
	}
	showStatus();
	checkNotification();
}
