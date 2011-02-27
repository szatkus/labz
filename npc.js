var answers = new Array();
var answer = null;
var answerTarget = null;

function showDialog(s)
{
	dialogWin = document.getElementById("dialog");
	s2 = "<p>"+s+"<br>";
	for (id = 0; id < answers.length; id++)
	{
		s2 += (id+1)+". "+answers[id]+"<br>";
	}
	if (answers.length == 0) s2 += "[press Q]";
	s2 += "</p>"
	dialogWin.innerHTML = s2;
	dialogWin.style.top = (gameHeight-200)/2+"px";
	dialogWin.style.left = (gameWidth-200)/2+"px";
	dialogWin.style.display = "inline";
	freezeGame = true;
}

function hideDialog()
{
	document.getElementById("dialog").style.display = "none";
	freezeGame = false;
}

function clearAnswers()
{
	answers.length = 0;
}

function addAnswer(s)
{
	answers[answers.length] = s;
}

nteract = function(a)
	{
		clearAnswers();
		addAnswer("Fuck you too!");
		addAnswer("Love you!");
		showDialog("Fuck you off!");
		answerTarget = this;
		answer = function(s)
		{
			if (s == "Fuck you too!")
			{
				clearAnswers();
				answerTarget.HP = 0;
				showDialog("Hate myself...");
			}
			if (s == "Love you!")
			{
				clearAnswers();
				showDialog("Really?");
			}
		}
	}


