Sprites = {

	root: null, 
	
	initialize : function(root){
		
		this.root = root; 
		
		defender = new Array(); 
		defender[0] = this.root.loadShape("/assets/svg/Defender.svg");
  		defender[1] = defender[0];
  		
		dorky = new Array(); 
		dorky[0] = this.root.loadShape("/assets/svg/Dorky1.svg");
  		dorky[1] = this.root.loadShape("/assets/svg/Dorky2.svg");
		
		evily = new Array(); 
		evily[0] = this.root.loadShape("/assets/svg/Evily1.svg");
  		evily[1] = this.root.loadShape("/assets/svg/Evily2.svg");
		
		scully = new Array(); 
		scully[0] = this.root.loadShape("/assets/svg/Scully1.svg");
  		scully[1] = this.root.loadShape("/assets/svg/Scully2.svg");
		
		// save as global variables for later use
		SPRITES['defender'] = defender;
  		SPRITES['dorky'] = dorky;
  		SPRITES['evily'] = evily;
  		SPRITES['scully'] = scully;
  		//dorky.disableStyle();
		
	},
	
	update : function(){
		
	}, 
	
	destroy : function(){
		
	}
	
}