var key = new Array(256);
for (var i = 0; i < 256; i++) key[i] = false;

// Change key state (true or false)
function changeKey(id, value)
{
	
	key[id] = value;
}
