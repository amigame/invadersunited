
User = function() {
	
	return { 
		id : 0,
		name: false,
		pos: { x: -1, y: -1},
		active : false,
		color : "#0C0",
		speed : (SPRITE_WIDTH*SPRITE_SCALE)/2, 
		die : false,
		x: 0, 
		y: 0,
		icon : encodeURIComponent("http://invadersunited.com/apple-touch-icon-114x114-precomposed.png")
	};
}

