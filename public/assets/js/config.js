CONFIG = {
	"geek-o-vision": false, 
	"draft": 5, 
	 
	"screen": { 
		grid : { x: 16, y: 12 },  
		framerate : 24, 
		width 		: window.innerWidth, 
		height 		: window.innerHeight, 
		background 	: "#FFFFFF" 
		
	}, 
	
	"sprite": {
		styles		: {
			player: {
				color:  0xFF00CC00, 
				stroke: 255
			}, 
			opponent: {
				color:  0x00FFFFFF, 
				stroke: 100
			}, 
			defender: {
				color:  0xFF0000CC, 
				stroke: 0
			}, 
			invader: {
				color:  0xFFCC0000, 
				stroke: 255
			}
			
		}
	}, 
	
	"preload" : [ "/assets/svg/Defender.svg",
				"/assets/svg/Dorky1.svg",
				"/assets/svg/Dorky2.svg",
				"/assets/svg/Evily1.svg",
				"/assets/svg/Evily2.svg",
				"/assets/svg/Scully1.svg",
				"/assets/svg/Scully2.svg" ]


}
