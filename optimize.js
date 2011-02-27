var showTerrain = true;
var log = "";
var debug = false;
var ct = 0;
var fps = 0;
var dfps = 0;
var tooSlow = 0;
var testRange = false;

function countFPS()
{
	fps = dfps;
	dfps = 0;
	if (fps < 15) tooSlow++;
	else tooSlow = 0;
	if (tooSlow > 5 && showTerrain) 
	{
		addLog("game works too slowly, disabling ground");
		showNotification("Game works too slowly. I'm disabling ground.");
		showTerrain = false;
	}
}

function addLog(s)
{
	log = log+s+"\n";
}

function showLog()
{
	
	document.getElementById("logout").value = log;
}
