function saveCharacter(a)
{
	s = a.name+".";
	for (var i = 0; i < a.blocks.length; i++)
	{
		s += getBlockId(a.blocks[i].name)+"."+(a.blocks[i].exp*100+a.blocks[i].level)+",";
	}
	return s;
}

function wrongSave()
{
	alert("save.js: wrong save URL");
	location.href = location.pathname;
}

function loadCharacter(s)
{
	if (s.indexOf(".") < 0) wrongSave();
	a = new ActiveObject(s.substring(0, s.indexOf(".")));
	s = s.substring(s.indexOf(".")+1);
	q = s.split(",");
	for (var i = 0; i < q.length; i++)
	{
		q2 = q[i].split(".");
		if (q2.length == 2)
		{
			btemp = blocks[parseInt(q2[0])];
			btemp.exp = parseInt(Math.floor(q2[1]/100));
			btemp.level = parseInt(q2[1]%100);
			a.addBlock(btemp);
		}
	}
	a.recovery();
	collectBlocks();
	return a;
}
