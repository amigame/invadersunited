
Projectile = {
  zIndex : 2,
  catchMouse : false,

  initialize : function(target, weapon, x, y, rot) {
	this.targetingFunction = this.angleTo
	Object.extend(this, weapon)
	//Player.initialize.call(this)
	this.elapsed = 0
	this.owner = weapon
	this.target = target
	this.x = x
	this.y = y
	this.rotation = rot
	this.model = new Rectangle(this.movementSpeed / 16, this.height, {centered : true})
	this.append(this.model)
	this.fill = this.color
	if (this.projectileHealth)
	  this.health = this.projectileHealth
	this.maxHealth = this.health
	this.initAI()
  },

  selfDestruct : function() {
	if (!this.parent) return
	var ex = new Explosion(this.maxHealth * 0.01)
	ex.x = this.x
	ex.y = this.y
	this.parent.append(ex)
	this.removeSelf()
	return false
  },

  ai : function(t,dt) {
	if (!this.target) return
	var angle = this.targetingFunction(this.target)
	this.turnToward( angle )
	this.moveAt(1)
  },

  hitDetect : function(t, dt) {
	var targetAlive = this.target.health > 0
	this.elapsed += dt
	if (!this.target) return
	var distance = this.distanceTo(this.target)
	if (distance < this.hitRadius) this.hit()
	if (targetAlive && this.target.health <= 0)
	  this.owner.gainExp(this.target)
	if (this.health <= 0) return this.selfDestruct()
	return true
  },

  hit : function() {
	this.target.health -= this.damage
	this.health -= this.hitDamageToSelf
	var ex = new Explosion(this.damage * 0.01)
	ex.x = this.x
	ex.y = this.y
	this.parent.append(ex)
  }

};

Weapon = {
	catchMouse : false,
	movementSpeed : 100,
	turningSpeed : 1,
	health : 20,
	projectileHealth : 1,
	hitDamageToSelf : 1,
	range : 200,
	optimalRange : 100,
	reloadTime : 1000,
	salvos : 5,
	techLevel : 0,
	rotation : 0,
	height: 2,
	color: 'white',
	x : 0, y : 0, rotation : 0,
	projectile : Projectile,
	readyToFire : true,
	
	initialize : function(techLevel) {
	//ARENA.initialize.call(this)
	this.fireAt(this.parent);
	this.freeSalvos = this.salvos
	if (techLevel)
	  this.techLevel = techLevel
	},
	
	gainExp : function(target) {
	var targetTech = target.techLevel
	if (target.weapon)
	  targetTech = target.weapon.techLevel
	else if (target.damage)
	  targetTech *= 0.02 * Math.max(1, target.damage)
	//         this.techLevel += 0.5 * ((targetTech+1) / (this.techLevel+1))
	},
	
	fireAt : function(target) {
		console.log(this.freeSalvos);
	if (this.freeSalvos < 1) return false
	this.freeSalvos--
	this.rx = this.x + this.ship.x
	this.ry = this.y + this.ship.y
	this.rrot = this.rotation + this.ship.rotation
	var proj = this.createProjectile(target)
	this.ship.parent.append(proj)
	this.after(this.reloadTime, this.reload)
	this.readyToFire = (this.freeSalvos > 0)
	},
	
	reload : function() {
	this.freeSalvos++
	this.readyToFire = (this.freeSalvos > 0)
	},
	
	createProjectile : function(target) {
	return new this.projectile(target, this, this.rx, this.ry, this.rrot)
	}
};

Bullet = $.extend(Weapon, {
      isMissile : true,
      movementSpeed : 160,
      turningSpeed : 3,
      projectileHealth : 1,
      hitRadius : 10,
      damage : 20,
      range : 500,
      optimalRange : 250,
      reloadTime : 3000,
      salvos: 8,
      color: '#22ccff',
      height: 1.5,
      damageType : 'explosive',
 
      initAI : function() {
        this.model.width *= 2
        this.reloadTime *= Math.pow(0.8, this.techLevel)
        this.turningSpeed *= Math.pow(1.1, this.techLevel)
        this.movementSpeed *= Math.pow(1.1, this.techLevel)
        this.damage *= Math.pow(1.25, this.techLevel)
        if (this.techLevel >= 4) {
          this.salvos += 2
          this.targetingFunction = this.predictAngleTo
        }
        this.after(5000, this.removeSelf)
      },
 
      predictAngleTo : function(target) {
        return this.predictAngleToTarget(this.movementSpeed)
      },
 
      hitDetect : function(t,dt) {
        if (!this.target) return
        if (!Projectile.hitDetect.apply(this, arguments))
          return false
        this.movementSpeed += dt * 0.06
        var distance = this.distanceTo(this.target)
        if (distance < 75) { // last sprint with low-latency tracking
          if (this.techLevel >= 3) {
            var angle = this.targetingFunction(this.target)
            this.turnToward( angle )
          }
        } else if (distance < 150) { // try to dodge point defense
          if (this.techLevel >= 3) {
            this.targetAngle += (Math.random() - 0.5) * 0.4 * Math.max(1, distance)*0.01
          }
        }
      },
 
      hit : function() {
        Projectile.hit.apply(this, arguments)
        if (!Explosion.fastExplosions) {
          var streak = new Circle(Math.random()*4+this.damage*0.18,{
            rotation:this.rotation,
            x:this.x, y:this.y,
            strokeWidth: 1.5,
            scale: [0.5+Math.random()*0.5, 1],
            stroke: '#da88fa'
          })
          streak.animate('opacity', 0.8, 0, 400, 'sqrt')
          streak.animateToFactor('scale', 5, 400, 'sqrt')
          streak.after(400, streak.removeSelf)
          this.parent.append(streak)
        }
      }
    })