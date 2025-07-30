(function ($) {

	/**
	 * Generate an indented list of links from a nav. Meant for use with panel().
	 * @return {jQuery} jQuery object.
	 */
	$.fn.navList = function () {

		var $this = $(this);
		$a = $this.find('a'),
			b = [];

		$a.each(function () {

			var $this = $(this),
				indent = Math.max(0, $this.parents('li').length - 1),
				href = $this.attr('href'),
				target = $this.attr('target');

			b.push(
				'<a ' +
				'class="link depth-' + indent + '"' +
				((typeof target !== 'undefined' && target != '') ? ' target="' + target + '"' : '') +
				((typeof href !== 'undefined' && href != '') ? ' href="' + href + '"' : '') +
				'>' +
				'<span class="indent-' + indent + '"></span>' +
				$this.text() +
				'</a>'
			);

		});

		return b.join('');

	};

	/**
	 * Panel-ify an element.
	 * @param {object} userConfig User config.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.panel = function (userConfig) {

		// No elements?
		if (this.length == 0)
			return $this;

		// Multiple elements?
		if (this.length > 1) {

			for (var i = 0; i < this.length; i++)
				$(this[i]).panel(userConfig);

			return $this;

		}

		// Vars.
		var $this = $(this),
			$body = $('body'),
			$window = $(window),
			id = $this.attr('id'),
			config;

		// Config.
		config = $.extend({

			// Delay.
			delay: 0,

			// Hide panel on link click.
			hideOnClick: false,

			// Hide panel on escape keypress.
			hideOnEscape: false,

			// Hide panel on swipe.
			hideOnSwipe: false,

			// Reset scroll position on hide.
			resetScroll: false,

			// Reset forms on hide.
			resetForms: false,

			// Side of viewport the panel will appear.
			side: null,

			// Target element for "class".
			target: $this,

			// Class to toggle.
			visibleClass: 'visible'

		}, userConfig);

		// Expand "target" if it's not a jQuery object already.
		if (typeof config.target != 'jQuery')
			config.target = $(config.target);

		// Panel.

		// Methods.
		$this._hide = function (event) {

			// Already hidden? Bail.
			if (!config.target.hasClass(config.visibleClass))
				return;

			// If an event was provided, cancel it.
			if (event) {

				event.preventDefault();
				event.stopPropagation();

			}

			// Hide.
			config.target.removeClass(config.visibleClass);

			// Post-hide stuff.
			window.setTimeout(function () {

				// Reset scroll position.
				if (config.resetScroll)
					$this.scrollTop(0);

				// Reset forms.
				if (config.resetForms)
					$this.find('form').each(function () {
						this.reset();
					});

			}, config.delay);

		};

		// Vendor fixes.
		$this
			.css('-ms-overflow-style', '-ms-autohiding-scrollbar')
			.css('-webkit-overflow-scrolling', 'touch');

		// Hide on click.
		if (config.hideOnClick) {

			$this.find('a')
				.css('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');

			$this
				.on('click', 'a', function (event) {

					var $a = $(this),
						href = $a.attr('href'),
						target = $a.attr('target');

					if (!href || href == '#' || href == '' || href == '#' + id)
						return;

					// Cancel original event.
					event.preventDefault();
					event.stopPropagation();

					// Hide panel.
					$this._hide();

					// Redirect to href.
					window.setTimeout(function () {

						if (target == '_blank')
							window.open(href);
						else
							window.location.href = href;

					}, config.delay + 10);

				});

		}

		// Event: Touch stuff.
		$this.on('touchstart', function (event) {

			$this.touchPosX = event.originalEvent.touches[0].pageX;
			$this.touchPosY = event.originalEvent.touches[0].pageY;

		})

		$this.on('touchmove', function (event) {

			if ($this.touchPosX === null
				|| $this.touchPosY === null)
				return;

			var diffX = $this.touchPosX - event.originalEvent.touches[0].pageX,
				diffY = $this.touchPosY - event.originalEvent.touches[0].pageY,
				th = $this.outerHeight(),
				ts = ($this.get(0).scrollHeight - $this.scrollTop());

			// Hide on swipe?
			if (config.hideOnSwipe) {

				var result = false,
					boundary = 20,
					delta = 50;

				switch (config.side) {

					case 'left':
						result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta);
						break;

					case 'right':
						result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta));
						break;

					case 'top':
						result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY > delta);
						break;

					case 'bottom':
						result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY < (-1 * delta));
						break;

					default:
						break;

				}

				if (result) {

					$this.touchPosX = null;
					$this.touchPosY = null;
					$this._hide();

					return false;

				}

			}

			// Prevent vertical scrolling past the top or bottom.
			if (($this.scrollTop() < 0 && diffY < 0)
				|| (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {

				event.preventDefault();
				event.stopPropagation();

			}

		});

		// Event: Prevent certain events inside the panel from bubbling.
		$this.on('click touchend touchstart touchmove', function (event) {
			event.stopPropagation();
		});

		// Event: Hide panel if a child anchor tag pointing to its ID is clicked.
		$this.on('click', 'a[href="#' + id + '"]', function (event) {

			event.preventDefault();
			event.stopPropagation();

			config.target.removeClass(config.visibleClass);

		});

		// Body.

		// Event: Hide panel on body click/tap.
		$body.on('click touchend', function (event) {
			$this._hide(event);
		});

		// Event: Toggle.
		$body.on('click', 'a[href="#' + id + '"]', function (event) {

			event.preventDefault();
			event.stopPropagation();

			config.target.toggleClass(config.visibleClass);

		});

		// Window.

		// Event: Hide on ESC.
		if (config.hideOnEscape)
			$window.on('keydown', function (event) {

				if (event.keyCode == 27)
					$this._hide(event);

			});

		return $this;

	};

	/**
	 * Apply "placeholder" attribute polyfill to one or more forms.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.placeholder = function () {

		// Browser natively supports placeholders? Bail.
		if (typeof (document.createElement('input')).placeholder != 'undefined')
			return $(this);

		// No elements?
		if (this.length == 0)
			return $this;

		// Multiple elements?
		if (this.length > 1) {

			for (var i = 0; i < this.length; i++)
				$(this[i]).placeholder();

			return $this;

		}

		// Vars.
		var $this = $(this);

		// Text, TextArea.
		$this.find('input[type=text],textarea')
			.each(function () {

				var i = $(this);

				if (i.val() == ''
					|| i.val() == i.attr('placeholder'))
					i
						.addClass('polyfill-placeholder')
						.val(i.attr('placeholder'));

			})
			.on('blur', function () {

				var i = $(this);

				if (i.attr('name').match(/-polyfill-field$/))
					return;

				if (i.val() == '')
					i
						.addClass('polyfill-placeholder')
						.val(i.attr('placeholder'));

			})
			.on('focus', function () {

				var i = $(this);

				if (i.attr('name').match(/-polyfill-field$/))
					return;

				if (i.val() == i.attr('placeholder'))
					i
						.removeClass('polyfill-placeholder')
						.val('');

			});

		// Password.
		$this.find('input[type=password]')
			.each(function () {

				var i = $(this);
				var x = $(
					$('<div>')
						.append(i.clone())
						.remove()
						.html()
						.replace(/type="password"/i, 'type="text"')
						.replace(/type=password/i, 'type=text')
				);

				if (i.attr('id') != '')
					x.attr('id', i.attr('id') + '-polyfill-field');

				if (i.attr('name') != '')
					x.attr('name', i.attr('name') + '-polyfill-field');

				x.addClass('polyfill-placeholder')
					.val(x.attr('placeholder')).insertAfter(i);

				if (i.val() == '')
					i.hide();
				else
					x.hide();

				i
					.on('blur', function (event) {

						event.preventDefault();

						var x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');

						if (i.val() == '') {

							i.hide();
							x.show();

						}

					});

				x
					.on('focus', function (event) {

						event.preventDefault();

						var i = x.parent().find('input[name=' + x.attr('name').replace('-polyfill-field', '') + ']');

						x.hide();

						i
							.show()
							.focus();

					})
					.on('keypress', function (event) {

						event.preventDefault();
						x.val('');

					});

			});

		// Events.
		$this
			.on('submit', function () {

				$this.find('input[type=text],input[type=password],textarea')
					.each(function (event) {

						var i = $(this);

						if (i.attr('name').match(/-polyfill-field$/))
							i.attr('name', '');

						if (i.val() == i.attr('placeholder')) {

							i.removeClass('polyfill-placeholder');
							i.val('');

						}

					});

			})
			.on('reset', function (event) {

				event.preventDefault();

				$this.find('select')
					.val($('option:first').val());

				$this.find('input,textarea')
					.each(function () {

						var i = $(this),
							x;

						i.removeClass('polyfill-placeholder');

						switch (this.type) {

							case 'submit':
							case 'reset':
								break;

							case 'password':
								i.val(i.attr('defaultValue'));

								x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');

								if (i.val() == '') {
									i.hide();
									x.show();
								}
								else {
									i.show();
									x.hide();
								}

								break;

							case 'checkbox':
							case 'radio':
								i.attr('checked', i.attr('defaultValue'));
								break;

							case 'text':
							case 'textarea':
								i.val(i.attr('defaultValue'));

								if (i.val() == '') {
									i.addClass('polyfill-placeholder');
									i.val(i.attr('placeholder'));
								}

								break;

							default:
								i.val(i.attr('defaultValue'));
								break;

						}
					});

			});

		return $this;

	};

	/**
	 * Moves elements to/from the first positions of their respective parents.
	 * @param {jQuery} $elements Elements (or selector) to move.
	 * @param {bool} condition If true, moves elements to the top. Otherwise, moves elements back to their original locations.
	 */
	$.prioritize = function ($elements, condition) {

		var key = '__prioritize';

		// Expand $elements if it's not already a jQuery object.
		if (typeof $elements != 'jQuery')
			$elements = $($elements);

		// Step through elements.
		$elements.each(function () {

			var $e = $(this), $p,
				$parent = $e.parent();

			// No parent? Bail.
			if ($parent.length == 0)
				return;

			// Not moved? Move it.
			if (!$e.data(key)) {

				// Condition is false? Bail.
				if (!condition)
					return;

				// Get placeholder (which will serve as our point of reference for when this element needs to move back).
				$p = $e.prev();

				// Couldn't find anything? Means this element's already at the top, so bail.
				if ($p.length == 0)
					return;

				// Move element to top of parent.
				$e.prependTo($parent);

				// Mark element as moved.
				$e.data(key, $p);

			}

			// Moved already?
			else {

				// Condition is true? Bail.
				if (condition)
					return;

				$p = $e.data(key);

				// Move element back to its original location (using our placeholder).
				$e.insertAfter($p);

				// Unmark element as moved.
				$e.removeData(key);

			}

		});

	};

	//funcion para monster
	window.requestAnimFrame = function () {
		return (
			window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function (callback) {
				window.setTimeout(callback);
			}
		);
	};

	function init(elemid) {
		let canvas = document.getElementById(elemid),
			c = canvas.getContext("2d"),
			w = (canvas.width = window.innerWidth),
			h = (canvas.height = window.innerHeight);
		c.fillStyle = "rgba(30,30,30,1)";
		c.fillRect(0, 0, w, h);
		return { c: c, canvas: canvas };
	}

	window.onload = function () {
		let c = init("canvas").c,
			canvas = init("canvas").canvas,
			w = (canvas.width = window.innerWidth),
			h = (canvas.height = window.innerHeight),
			mouse = { x: false, y: false },
			last_mouse = {};

		function dist(p1x, p1y, p2x, p2y) {
			return Math.sqrt(Math.pow(p2x - p1x, 2) + Math.pow(p2y - p1y, 2));
		}

		class segment {
			constructor(parent, l, a, first) {
				this.first = first;
				if (first) {
					this.pos = {
						x: parent.x,
						y: parent.y
					};
				} else {
					this.pos = {
						x: parent.nextPos.x,
						y: parent.nextPos.y
					};
				}
				this.l = l;
				this.ang = a;
				this.nextPos = {
					x: this.pos.x + this.l * Math.cos(this.ang),
					y: this.pos.y + this.l * Math.sin(this.ang)
				};
			}
			update(t) {
				this.ang = Math.atan2(t.y - this.pos.y, t.x - this.pos.x);
				this.pos.x = t.x + this.l * Math.cos(this.ang - Math.PI);
				this.pos.y = t.y + this.l * Math.sin(this.ang - Math.PI);
				this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang);
				this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang);
			}
			fallback(t) {
				this.pos.x = t.x;
				this.pos.y = t.y;
				this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang);
				this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang);
			}
			show() {
				c.lineTo(this.nextPos.x, this.nextPos.y);
			}
		}

		class tentacle {
			constructor(x, y, l, n, a) {
				this.x = x;
				this.y = y;
				this.l = l;
				this.n = n;
				this.t = {};
				this.rand = Math.random();
				this.segments = [new segment(this, this.l / this.n, 0, true)];
				for (let i = 1; i < this.n; i++) {
					this.segments.push(
						new segment(this.segments[i - 1], this.l / this.n, 0, false)
					);
				}
			}
			move(last_target, target) {
				this.angle = Math.atan2(target.y - this.y, target.x - this.x);
				this.dt = dist(last_target.x, last_target.y, target.x, target.y) + 5;
				this.t = {
					x: target.x - 0.8 * this.dt * Math.cos(this.angle),
					y: target.y - 0.8 * this.dt * Math.sin(this.angle)
				};
				if (this.t.x) {
					this.segments[this.n - 1].update(this.t);
				} else {
					this.segments[this.n - 1].update(target);
				}
				for (let i = this.n - 2; i >= 0; i--) {
					this.segments[i].update(this.segments[i + 1].pos);
				}
				if (
					dist(this.x, this.y, target.x, target.y) <=
					this.l + dist(last_target.x, last_target.y, target.x, target.y)
				) {
					this.segments[0].fallback({ x: this.x, y: this.y });
					for (let i = 1; i < this.n; i++) {
						this.segments[i].fallback(this.segments[i - 1].nextPos);
					}
				}
			}
			show(target) {
				if (dist(this.x, this.y, target.x, target.y) <= this.l) {
					c.globalCompositeOperation = "lighter";
					c.beginPath();
					c.lineTo(this.x, this.y);
					for (let i = 0; i < this.n; i++) {
						this.segments[i].show();
					}
					c.strokeStyle =
						"hsl(" +
						(this.rand * 60 + 180) +
						",100%," +
						(this.rand * 60 + 25) +
						"%)";
					c.lineWidth = this.rand * 2;
					c.lineCap = "round";
					c.lineJoin = "round";
					c.stroke();
					c.globalCompositeOperation = "source-over";
				}
			}
			show2(target) {
				c.beginPath();
				if (dist(this.x, this.y, target.x, target.y) <= this.l) {
					c.arc(this.x, this.y, 2 * this.rand + 1, 0, 2 * Math.PI);
					c.fillStyle = "white";
				} else {
					c.arc(this.x, this.y, this.rand * 2, 0, 2 * Math.PI);
					c.fillStyle = "darkcyan";
				}
				c.fill();
			}
		}

		let maxl = 300,
			minl = 50,
			n = 30,
			numt = 500,
			tent = [],
			clicked = false,
			target = { x: 0, y: 0 },
			last_target = {},
			t = 0,
			q = 10;

		for (let i = 0; i < numt; i++) {
			tent.push(
				new tentacle(
					Math.random() * w,
					Math.random() * h,
					Math.random() * (maxl - minl) + minl,
					n,
					Math.random() * 2 * Math.PI
				)
			);
		}
		function draw() {
			if (mouse.x) {
				target.errx = mouse.x - target.x;
				target.erry = mouse.y - target.y;
			} else {
				target.errx =
					w / 2 +
					((h / 2 - q) * Math.sqrt(2) * Math.cos(t)) /
					(Math.pow(Math.sin(t), 2) + 1) -
					target.x;
				target.erry =
					h / 2 +
					((h / 2 - q) * Math.sqrt(2) * Math.cos(t) * Math.sin(t)) /
					(Math.pow(Math.sin(t), 2) + 1) -
					target.y;
			}

			target.x += target.errx / 10;
			target.y += target.erry / 10;

			t += 0.01;

			c.beginPath();
			c.arc(
				target.x,
				target.y,
				dist(last_target.x, last_target.y, target.x, target.y) + 5,
				0,
				2 * Math.PI
			);
			c.fillStyle = "hsl(210,100%,80%)";
			c.fill();

			for (i = 0; i < numt; i++) {
				tent[i].move(last_target, target);
				tent[i].show2(target);
			}
			for (i = 0; i < numt; i++) {
				tent[i].show(target);
			}
			last_target.x = target.x;
			last_target.y = target.y;
		}

		canvas.addEventListener(
			"mousemove",
			function (e) {
				last_mouse.x = mouse.x;
				last_mouse.y = mouse.y;

				mouse.x = e.pageX - this.offsetLeft;
				mouse.y = e.pageY - this.offsetTop;
			},
			false
		);

		canvas.addEventListener("mouseleave", function (e) {
			mouse.x = false;
			mouse.y = false;
		});

		canvas.addEventListener(
			"mousedown",
			function (e) {
				clicked = true;
			},
			false
		);

		canvas.addEventListener(
			"mouseup",
			function (e) {
				clicked = false;
			},
			false
		);

		function loop() {
			window.requestAnimFrame(loop);
			c.clearRect(0, 0, w, h);
			draw();
		}

		window.addEventListener("resize", function () {
			(w = canvas.width = window.innerWidth),
				(h = canvas.height = window.innerHeight);
			loop();
		});

		loop();
		setInterval(loop, 1000 / 60);
	};


})(jQuery);