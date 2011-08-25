//var randInv = Math.max( Math.round( Math.random() * (animations['invaders'].length-1)), 1);


    Arena = Klass(CanvasNode, {
      bgColor : 'rgb(0,0,0)',
      bgOpacity : 0.15,

      playerTeam : '#aa2222',
      enemyTeam : '#2266aa',

      initialize : function() {
        CanvasNode.initialize.call(this)
        this.ships = {}
        this.bg = new Rectangle(this.width, this.height)
        this.bg.fill = this.bgColor
        this.bg.fillOpacity = this.bgOpacity
        var selectionStart, startX, startY
        var th = this
        var playerShipsInside = function(rect) {
          return th.childNodes.filter(function(s) {
            var x1 = Math.min(rect.cx, rect.x2)
            var x2 = Math.max(rect.cx, rect.x2)
            var y1 = Math.min(rect.cy, rect.y2)
            var y2 = Math.max(rect.cy, rect.y2)
            return s.isShip && s.strategicAI == Player &&
                   (s.x >= x1 && s.x <= x2 && s.y >= y1 && s.y <= y2)
          })
        }
        this.selectRect = new Rectangle(0,0, {
          stroke : 1,
          strokeOpacity : 0.4,
          stroke : '#00ff00',
          fillOpacity : 0.1,
          fill : '#00ff00',
          visible : false,
          zIndex : 999
        })
        this.append(this.selectRect)
        this.bg.addEventListener('mousedown', function(ev) {
          ev.preventDefault()
          var point = CanvasSupport.tMatrixMultiplyPoint(
            CanvasSupport.tInvertMatrix(this.currentMatrix),
            this.root.mouseX, this.root.mouseY
          )
          startX = this.root.mouseX
          startY = this.root.mouseY
          selectionStart = point
          th.selectRect.x2 = th.selectRect.cx = point[0]
          th.selectRect.y2 = th.selectRect.cy = point[1]
        }, false)
        this.bg.addEventListener('drag', function(ev) {
          var point = CanvasSupport.tMatrixMultiplyPoint(
            CanvasSupport.tInvertMatrix(this.currentMatrix),
            this.root.mouseX, this.root.mouseY
          )
          if (selectionStart && !th.selectRect.visible) {
            var dx = startX - this.root.mouseX
            var dy = startY - this.root.mouseY
            var sqd = dx * dx + dy * dy
            th.selectRect.visible = sqd > 81
          }
          if (th.selectRect.visible) {
            th.selectRect.x2 = point[0]
            th.selectRect.y2 = point[1]
          }
        }, false)
        this.mouseupHandler = function(ev) {
          var point = CanvasSupport.tMatrixMultiplyPoint(
            CanvasSupport.tInvertMatrix(th.currentMatrix),
            th.root.mouseX, th.root.mouseY
          )
          if (selectionStart && th.selectRect.visible) {
            th.selectRect.visible = false
            selectionStart = null
            var selection = playerShipsInside(th.selectRect)
            if (ev.shiftKey) {
              selection.forEach(Player.select.bind(Player))
            } else if (ev.altKey) {
              selection.forEach(Player.deselect.bind(Player))
            } else {
              Player.clearSelection()
              selection.forEach(Player.select.bind(Player))
            }
          } else if (selectionStart && (ev.canvasTarget == th.selectRect || ev.canvasTarget == th.bg)) {
            Player.setWaypoint(point)
            th.selectRect.visible = false
            selectionStart = null
          }
        }
        this.addEventListener('rootChanged', function(ev) {
          if (ev.canvasTarget == this) {
            if (this.root)
              this.root.removeEventListener('mouseup', this.mouseupHandler, false)
            ev.relatedTarget.addEventListener('mouseup', this.mouseupHandler, false)
          }
        }, false)
        this.bg.zIndex = -100
        this.messageLayer = new CanvasNode({
          zIndex : 1000,
          scale : 1 / this.scale
        })
        this.append(this.bg, this.messageLayer)
        this.addFrameListener(function() {
          if (Player.selection.length > 0)
            this.cursor = MOVE_TO_CURSOR
          else
            this.cursor = DEFAULT_CURSOR
        })
        this.destroyedHandler = this.destroyed.bind(this)
        this.when('teamDestroyed', function(ev) {
          if (ev.detail == this.enemyTeam) this.enemyTeamDestroyed(ev.detail)
          else if (ev.detail == this.playerTeam) this.gameOver()
        })
        this.showDescription()
      },

      enemyTeamDestroyed : function(team) {
        this.levelCompleted()
      },

      showDescription : function() {
        var desc = E('div')
        desc.appendChild(E('h1', this.name))
        desc.appendChild(E('div', this.description))
        this.query(desc,
          'Start level', function(){
            this.root.dispatchEvent({type: 'started', canvasTarget : this })
          },
          'Back to main menu', function() { this.parentNode.gameOver() }
        )
      },

      query : function(header) {
        var div = E('div', {className : 'message'})
        var msg = new ElementNode(div,
          { x : 320, y : 30, align : 'center' })
        var msgDiv = E('div', header)
        div.appendChild(msgDiv)
        var options = E('div')
        var th = this
        for (var i=1; i<arguments.length; i+=2) {
          var name = arguments[i]
          var callback = arguments[i+1]
          options.appendChild(E('h2', name, {
            onclick : (function(callback){ return function() {
              if (!this.clicked) {
                callback.call(th)
                this.clicked = true
                msg.after(500, msg.removeSelf)
                msg.animateTo('opacity', 0, 500, 'sine')
              }
            }})(callback),
            style: { cursor : 'pointer' }
          }))
        }
        div.appendChild(options)
        msg.opacity = 0
        msg.animateTo('opacity', 1, 500, 'sine')
        this.messageLayer.append(msg)
      },

      notify : function(message, after, duration) {
        if (!after) after = 0
        this.after(after, function(){
          var msg = new ElementNode(E('h3', message),
            { x : 320, y : 30, align : 'center' })
          if (!duration) duration = 3500 + msg.element.textContent.length * 10
          msg.opacity = 0
          msg.animateTo('opacity', 1, 500, 'sine')
          msg.after(duration, function() {
            this.animateTo('opacity', 0, 500, 'sine')
          })
          msg.after(duration+500, msg.removeSelf)
          this.messageLayer.append(msg)
        })
      },


      gameOver : function() {
        if (this.completed) return
        this.failed = true
        this.after(1000, function() {
          this.query(E('h1', "Your fleet was destroyed"),
            "Try again", function() { this.parentNode.tryAgain() },
            "Back to main menu", function() { this.parentNode.gameOver() }
          )
        })
      },

      levelCompleted : function() {
        if (this.failed) return
        this.after(1000, function() {
          if (this.failed) return
          this.completed = true
          this.query(E('h1', "Level complete"),
            "Next level", function() { this.parentNode.nextLevel() },
            "Play again", function() { this.parentNode.tryAgain() },
            "Back to main menu", function() { this.parentNode.gameOver() }
          )
        })
      },

      createShip : function(team, techLevel, wpn, x, y, noWarp, health) {
        if (!this.ships[team]) this.ships[team] = 0
        var pd
        if (wpn.length) {
          if (wpn[1]) pd = wpn[1]
          wpn = wpn[0]
        }
        if (!pd) {
          switch(wpn) {
            case Missiles: pd = PointDefenseMissiles; break
            case Beam: pd = Beam; break
            case RapidFireRailgun: pd = RapidFireRailgun; break
            default: pd = PointDefenseGun
          }
        }
        var s = new Ship(team,
          new wpn(techLevel), new pd(techLevel),
          x, y, noWarp, health)
        if (team == this.playerTeam) s.strategicAI = Player
        s.when('destroyed', this.destroyedHandler)
        this.ships[team]++
        return s
      },

      createGroup : function(team, techLevel, x, y, weapons, noWarp, health) {
        var i = 0
        var th = this
        var seg = Math.PI*2/(weapons.length-1)
        return weapons.map(function(wpn) {
          if (i == 0) {
            var dx = 0, dy = 0
          } else {
            var angle = i * seg
            var r = Math.max(80, 100 / seg)
            var dx = Math.cos(angle) * r
            var dy = Math.sin(angle) * r
          }
          i++
          return th.createShip(team, techLevel, wpn, x+dx, y+dy, noWarp, health)
        })
      },

      ship : function() {
        this.append(this.createShip.apply(this, arguments))
      },

      invader : function(time, team, techLevel, weapon, x, y, noWarp, health) {
        if (!this.ships[team]) this.ships[team] = 0
        this.ships[team]++
        this.after(time, function() {
          this.ships[team]--
          this.ship(team, techLevel, weapon, x, y, noWarp, health)
        })
      },

      group : function(team, techLevel, x, y, weapons, noWarp, health) {
        this.append.apply(this, this.createGroup.apply(this, arguments))
      },

      groupAfter : function(time, team, techLevel, x, y, weapons, noWarp, health) {
        if (!this.ships[team]) this.ships[team] = 0
        this.ships[team] += weapons.length
        this.after(time, function() {
          this.ships[team] -= weapons.length
          this.group(team, techLevel, x, y, weapons, noWarp, health)
        })
      },

      destroyed : function(ev) {
        this.ships[ev.canvasTarget.team]--
        if (this.ships[ev.canvasTarget.team] < 1) {
          this.root.dispatchEvent({
            type : 'teamDestroyed',
            detail : ev.canvasTarget.team,
            canvasTarget : this
          })
        }
      }

    })


    Play = Klass(Arena, {
      width : 640,
      height : 480,
      scale : 1,

      name : "Last man standing",
      description : "This is where you prove your worth",

      initialize : function() {
        Arena.initialize.call(this)
        this.when('started', function() {
          this.invader(0, this.playerTeam, 0, Missiles, 100, 100)
        })
      }

    })

/*
	var start = new ElementNode(E('h2', 'START'), 
		{
			fontFamily: 'Arial, Sans-serif', 
			noScaling: true, 
			color: 'black',
			x: CAKECanvas.width / 2, 
			y: CAKECanvas.height / 2,
			align: 'center',
			valign: 'center'
		}
	);
	
					
	CAKECanvas.append(start);
	*/
	

    Explosion = Klass(CanvasNode, {
      catchMouse : false,
      cursor : 'default',

      circleGradient : new Gradient({
        type : 'radial',
        endRadius : 15,
        colorStops : [
          [ 0.0, "rgba(190,105,90,1)" ],
          [ 0.25, "rgba(5,30,80,0.4)" ],
          [ 1, "rgba(10,0,40,0)" ]
        ]
      }),

      initialize : function(size) {
        CanvasNode.initialize.call(this)
        var main = new Circle(15)
        main.fill = this.circleGradient
        main.compositeOperation = 'lighter'
        this.zIndex = 10
        this.main = main
        this.append(main)
        this.size = size
        this.addFrameListener(this.blowup)
        this.after(500, this.removeSelf)
      },

      blowup : function(t, dt) {
        if (this.startTime == null)
          this.startTime = t
        var elapsed = Math.min(500, t - this.startTime)
        var fac = 0.48 * 0.004 * Math.PI
        this.main.scale = 1 + this.size *
                          (Explosion.fastExplosions ? 1 :
                                                      Math.tan(elapsed * fac))
        if (isNaN(this.main.scale)) this.main.scale = 60000
      }
    });