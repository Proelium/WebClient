Proelium.map = function (data) {
	this.scape = [];
	this.width = data.width;
	
	this.rendered = {};
	
	var cur = [];
	var base = 0;
	for (var i = 0; i < data.bytes.length; i++) {
		if (base > this.width) {
			this.scape.push(cur);
			base = 0;
			cur = [];
		}
		
		if (data.bytes.charCodeAt(i) == 32)
			cur.push(null);
		else
			cur.push(new Proelium.biome.fromId(data.bytes.charCodeAt(i)));
		
		base++;
	}
};

Proelium.map.prototype.destroy = function () {
	for (var i in this.scape)
		delete this.scape[i];
}

Proelium.map.cache = false;

function isEven(n) {
	return n === 0 || !!(n && !(n%2));
}

function isOdd(n) {
	return isEven(n + 1);
}

Proelium.map.hexagonPosition = function (pos, size) {
	var rtn = {x: pos.x*(size.x/1.5), y: pos.y*size.y};
		
	if (isOdd(pos.x)) {
		rtn.y += size.y/2;
	}else{
		
	}
	
	return rtn;
};

Proelium.map.hexagon = function (pos, size, color) {
	color = color || 0xFF0000;
	var hex;
	if (this.cache === false) {
		hex = new PIXI.Graphics();
		hex.beginFill(color);
		
		hex.drawPolygon([
			pos.x, pos.y + size.y/2,
			pos.x + size.x/3, pos.y,
			pos.x + (size.x - size.x/3), pos.y,
			pos.x + size.x, pos.y + size.y/2,
			pos.x + (size.x - size.x/3), pos.y + size.y,
			pos.x + size.x/3, pos.y + size.y
		]);
		
		hex.endFill();
		hex.cacheAsBitmap = true;
	}
	
	return hex;
};

Proelium.map.prototype.render = function (container, x, y, scale, clear) {
	clear = clear || false;
	scale = scale || 1;
	
	var that = this;
	
	function remove() {
		for (var i in that.rendered)
			if (that.rendered[i] !== null)
				container.removeChild(that.rendered[i]);
	}
	
	var scal = 60;
	
	var hexWidth = scal*scale;
	var hexHeight = (Math.sqrt(3)/2 * scal)*scale;
	
	container.x = -(((x*(hexWidth/1.5)))-window.innerWidth/2);
	container.y = -(((y*(hexHeight/1.02)))-window.innerHeight/2);
	
	var xCount = Math.round(((window.innerWidth*2)/hexWidth)/2);
	var yCount = Math.round(((window.innerHeight*(1.4))/hexHeight)/2);
	
	var start = [x-xCount, y-yCount];
	var end = [x+xCount, y+yCount];
	
	var newRendered = {};
	
	if (clear) {
		remove();
		that.rendered = {};
	}
	
	for (var i = start[0]; i < end[0]-1; i++) {
		for (var j = start[1]; j < end[1]-1; j++) {
			if (i+"|"+j in this.rendered) {
				newRendered[i+"|"+j] = this.rendered[i+"|"+j];
				this.rendered[i+"|"+j] = null;
				continue;
			}
			
			if (!(i >= 0 && i < this.width-1 && j >= 0 && j < this.width-1))
				continue;
			
			var put = 0xFFBA03;
			if (that.scape[i][j] !== null)
				put = 0x0000FF;
			
			
			var size = {x: hexWidth, y: hexHeight};
			
			var pos = Proelium.map.hexagonPosition({x: i, y: j}, size);
			if (i > 0)
				pos.x -= 2*i;
			var hex = Proelium.map.hexagon(pos, size, put);
			
			
			
			hex.interactive = true;
			hex.mouseover = hover;
			hex.mouseout = hoverLeave;
			hex.click = hexSelect;
			hex.mapData = {x: i, y: j};
			
			newRendered[i+"|"+j] = hex;
			
			
			container.addChild(hex);
		}
	}
	
	remove();
	
	this.rendered = newRendered;
	
	var scape = [];
	
	function hexSelect() {
		var x = this.mapData.x, y = this.mapData.y;
		
		scape[x][y].alpha = 0;
		scape[x][y-1].alpha = 0; //Above
		scape[x][y+1].alpha = 0; //Below
		
		scape[x-1][y-1].alpha = 0; //Left top
		scape[x-1][y].alpha = 0; //Left bottom
		
		scape[x+1][y-1].alpha = 0; //Right top
		scape[x+1][y].alpha = 0; //Right bottom
	}
	
	function hover() {
		this.alpha = 0.5;
	}
	
	function hoverLeave() {
		this.alpha = 1;
	}
	
	
};