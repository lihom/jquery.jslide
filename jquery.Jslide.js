/*
 * jQuery.Jslide
 * 
 * @author		hom
 * @copyright	Copyright (C) KICKcreative Co., All Rights Reserved.
 * 
 */
 

;(function($) {
	$.fn.Jslide = function(_configs) {
		var _public = {},
			_privaty = {},
			_this = {};
			
		_public = {
			push: false,
			loop: true,
			touch_loop: true,
			touch: true,
			autoplay: false,
			pagination: false,
			show_broad: false,
			show_close: false,
			resize_mode: true,
			
			win: window,
			picContainer: 'ul',
			pics: 'ul > li',
			paginationCon: '.paginationCon',
			pageCon: '.pageCon',
			pages: '.pageCon > .page',
			nav: '.nav',
			prev: '.prev',
			next: '.next',
			broad: '.broad',
			closeBtn: '.close',
			
			pager: '',
			speed: 1000,
			time: 5000,
			stepCss: 'step',
			easing: 'easeOutQuart',
			visible: 1,
			align: 'left',

			source: false,
			
			hook_itemPos: false,
			hook_slidemove_before_click: false,
			hook_initStage_before: false,
			hook_itemTween_after: false
		};
		
		_privaty = {
			$win: {},
			$wrap: {},
			$self: {},
			$page: {},
			$pages: {},
			$pageCon: {},
			$paginationCon: {},
			$nav: {},
			$prev: {},
			$next: {},
			$broad: {},
			$closeBtn: {},
			$pic: {},
			$pics: {},
			$picContainer: {},
			picContainer_w: 0,
			picContainer_h: 0,
			picLen: 0,
			pics_w: 0,
			nowNum: 0,
			prevNum: 0,
			datas: [],
			safeLan: 5,
			pushLen: 2,
			interval: {},
			init: true,
			loading_init: true,
			play: true,
			playing: false,
			
			isMobile: function(){
				var agent = (navigator.userAgent||navigator.vendor||window.opera).toLowerCase();
				var isMobile = /android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|ad|od)|iris|kindle|lge |maemo|meego.+mobile|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(agent)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(agent.substr(0,4));
				var result = isMobile ? true : false;
				return result;
			},

			rebuild: function() {
				var datas = [];

				if (_this.source) {
					var type = (typeof _this.source).toLowerCase();
					switch (type) {
						case 'string':
							$.getJSON(_this.source, function(datas) {
								datas = phase_data(datas);
								create_list(datas);
							});
							break;
						case 'array':
						case 'object':
							datas = phase_data(_this.source);
							create_list(datas);
							break;
					}
				} else {
					var cnt = 0,
						callback = callback || false,
						$imgs = $(_this.pics, _this.$self).find('img');

					if ($imgs.length <= 0) {
						_this.install();
						return;
					}

					$imgs.each(function(k) {
						var obj = {},
							$this = $(this),
							data = $this.data();
						obj['url'] = this.src;
						datas[k] = $.extend(obj, data);
					});

					create_list(datas);
				}

				function phase_data(datas) {
					var _datas = [];
					var i = 0;
					for (var k in datas) {
						var type = (typeof datas[k]).toLowerCase();
						if (type == 'object') {
							var obj = {};
							for (var _k in datas[k]) {
								obj[_k] = datas[k][_k];
							}
							_datas[i] = obj;
						} else {
							var obj = {};
							obj['img'] = datas[k];
							_datas[i] = obj;
						}
						i++;
					}
					return _datas;
				}

				function clone_data(datas, lan) {
					var _datas = [];
					for (var i = 0; i <= lan; i++) {
						for (var k in datas) {
							_datas.push(datas[k]);
						}
					}
					return _datas;
				}

				function create_list(datas) {
					if (datas.length <= _this.safeLan) {
						datas = clone_data(datas, Math.floor(_this.safeLan / datas.length));
					}

					var $item = $(_this.pics, _this.$self).eq(0).clone();
					$item.wrap('<div>');
					_this.$picContainer.html('');

					for (var k in datas) {
						$item.find('img').attr('src', datas[k].url)
						var html = $item.parent().html();
						_this.$picContainer.append(html);
					}
					$item.remove();

					if (_this.pagination) {
						var $item = $(_this.pages, _this.$self).eq(0).clone();
						$item.wrap('<div>');
						_this.$pageCon.html('');
						for (var k in datas) {
							$item.find('img').attr('src', datas[k].url)
							var html = $item.parent().html();
							_this.$pageCon.append(html);
						}
						$item.remove();
					}

					_this.datas = datas;

					_this.install();
				}
			},

			__construct: function(self) {
				_this.$win = $(_this.win);
				_this.$self = $(self);
				_this.$self.css('opacity', 0);
				_this.$picContainer = $(_this.picContainer, _this.$self).eq(0);

				_this.$paginationCon = $(_this.paginationCon, _this.$self);
				_this.$pageCon = $(_this.pageCon, _this.$self);

				_this.$broad = $(_this.broad, _this.$self);

				_this.$closeBtn = $(_this.closeBtn, _this.$self);

				_this.loading();

				_this.rebuild();
			},

			install: function() {
				_this.$nav = $(_this.nav, _this.$self).eq(0);
				_this.$prev = $(_this.prev, _this.$self).eq(0);
				_this.$next = $(_this.next, _this.$self).eq(0);
				_this.$pics = $(_this.pics, _this.$self);
				
				_this.$nav.css('z-index', 2);
				_this.$picContainer.css('z-index', 1);
				
				_this.picContainer_w = _this.$self.width();
				_this.picContainer_h = _this.$self.height();
				_this.picLen = _this.$pics.length;
				
				if (_this.picLen <= _this.safeLan) _this.push = false;
				if (_this.picLen <= _this.visible) _this.$nav.css('display', 'none');
				
				if (_this.pagination) {
					_this.initPagination();
				} else {
					_this.$paginationCon.remove();
				}

				if (_this.show_broad) {
					
				} else {
					_this.$broad.remove();
				}

				if (_this.show_close) {

				} else {
					_this.$closeBtn.remove();
				}
				
				if (_this.resize_mode) {
					_this.$win.bind('resize', _this.delay_initStage);
				}
				
				//_this.initStage();
				_this.preload(function() {
					setTimeout(_this.initStage, 10);
				});
				
				_this.$prev.bind('click', function() {
					_this.doSlidePrev();
				});
				_this.$next.bind('click', function() {
					_this.doSlideNext();
				});
				
				if (_this.autoplay) {
					_this.$self.bind('mousemove', function() {
						_this.play = false;
					});
					_this.$self.bind('mouseenter', function() {
						_this.disableAutoPlay();
					});
					_this.$self.bind('mouseleave', function() {
						_this.enableAutoPlay();
					});
					_this.$win.bind('blur', function() {
						_this.disableAutoPlay();
					});
					_this.$win.bind('focus', function() {
						_this.enableAutoPlay();
					});
					_this.timeout();
				}
			},

			loading: function(precent) {
				precent = precent || 0;
				if (_this.loading_init) {
					$loading = $('<div class="loading"></div>');
					$loading.css({
						'position': 'absolute',
						'left': 0,
						'top': 0,
						'width': '100%',
						'height': 3,
						'z-index': 3,
						'background-color': '#000',
						'opacity': .8
					});
					_this.$self.wrap('<div class="slide_container_wrap working">');
					_this.$wrap = _this.$self.parent();
					_this.$wrap.prepend($loading);
					_this.loading_init = false;
				}
				$loading.width(precent + '%');
				if (precent >= 100) {
					$loading.fadeOut(1000);
				}
			},

			preload: function(callback) {
				var cnt = 0,
					callback = callback || false,
					$imgs = _this.$pics.find('img');

				if ($imgs.length <= 0 && callback) callback();

				$imgs.each(function() {
					var img = new Image;
					img.onload = function() {
						delete img;
						cnt++;
						_this.loading((cnt / _this.picLen) * 100);
						if (cnt >= _this.picLen && callback) callback();
					};
					img.src = this.src;
				});
			},
			
			initPagination: function() {
				_this.$pageConParent = _this.$pageCon.parent();
				_this.$pages = $(_this.pages, _this.$self);

				_this.resetPagination();

				if (_this.picLen <= _this.visible) {
					_this.$paginationCon.css('display', 'none');
				} else {
					_this.$pages.each(function(i) {
						var $this = $(this);
						$.data($this[0], 'index', i);
					});
					_this.$pages.bind('click', function() {
						var index = $(this).data('index');
						_this.doSlideMove(index);
					});
				}
			},

			resetPagination: function() {
				_this.$pageConParent.css('height', _this.$pageCon.height());
				_this.$pages.width(Math.floor(_this.$pageConParent.width() / _this.picLen));

				var w = 0;
				_this.$pages.each(function() {
					w += $(this).width();
				});
				
				_this.$pageCon.css({
					'position': 'absolute',
					'left': '50%',
					'margin-left': - Math.ceil(w / 2),
					'overflow': 'visible',
					'width': w
				});
			},

			delay_initStage: function() {
				setTimeout(_this.initStage, 10);
			},

			initStage: function() {
				if (_this.hook_initStage_before) _this.hook_initStage_before(); 

				_this.$pic = _this.$pics.eq(_this.nowNum);
				_this.picContainer_w = _this.$self.width();
				_this.picContainer_h = _this.$self.height();
				_this.$pics.find('img').attr('height', _this.picContainer_h);
				_this.$pics.each(function() {
					var $this = $(this);
					_this.pics_w += $this.width();
				});

				if (_this.pagination) {
					_this.resetPagination();
				}
				
				if (_this.isMobile() && _this.picContainer_w < _this.pics_w && _this.touch && _this.init) {
					_this.doTouchEvent();
				}
				
				_this.itemPos(_this.nowNum, 'css');

				if (_this.init) {
					_this.$wrap.removeClass('working');
					_this.$self.animate({'opacity': 1}, 800);
				}

				_this.init = false;
			},
			
			enableAutoPlay: function() {
				_this.play = true;
				clearInterval(_this.interval);
				_this.timeout();
			},
			
			disableAutoPlay: function() {
				_this.play = false;
				clearInterval(_this.interval);
			},
			
			doTouchEvent: function() {
				var touch = {
						x: 0,
						y: 0
					},
					delta = 0,
					winScroll = false,
					timeout = {};
					
				var getEventPosX = function(e) {
					if (e.touches) {
						var touch = e.touches[0],
							x = touch.pageX;
					} else {
						var x = e.offsetX;
					}
					return x;
				};
				
				var getEventPosY = function(e) {
					if (e.touches) {
						var touch = e.touches[0],
							y = touch.pageY;
					} else {
						var y = e.offsetY;
					}
					return y;
				};

				var touchstart_hit = function(e) {
					clearTimeout(timeout);
					disableScroll();
					_this.play = false;
					_this.disableAutoPlay();
					touch.x = getEventPosX(e);
					touch.y = getEventPosY(e);
				};

				var touchmove_hit = function(e) {
					_this.play = false;
					var x = getEventPosX(e),
						y = getEventPosY(e);
					if (Math.abs(y - touch.y) > Math.abs(x - touch.x)) {
						delta = 0;
						return;
					}
					delta = x >= touch.x ? 1 : -1;
					_this.$picContainer.css({left:x - touch.x});
					if (Math.abs(x - touch.x) < Math.floor(_this.picContainer_w * .4)) {
						delta = 0;
						return;
					}
				};

				var touchend_hit = function(e) {
					_this.play = false;
					_this.$picContainer.animate({left: 0}, _this.speed / 2);
					timeout = setTimeout(enableScroll, _this.speed / 2);
					if (delta == 0) return;
					if (delta > 0) {
						_this.doSlidePrev('touch');
					} else {
						_this.doSlideNext('touch');
					}
				};
				
				var disablePreventDefault = function(e) {
					e.preventDefault();
				};
				
				var disableScroll = function() {
					_this.$win[0].addEventListener('touchmove', disablePreventDefault, true);
					$hit[0].addEventListener('touchmove', touchmove_hit, true);
				};
				
				var enableScroll = function() {
					_this.$win[0].removeEventListener('touchmove', disablePreventDefault, true);
					$hit[0].removeEventListener('touchmove', touchmove_hit, true);
				};
				
				var $picCon = _this.$picContainer.parent(),
					$picAnchor = $picCon.find('a'),
					$hit = {};

				if ($picAnchor.length == 0) {
					var w = _this.picContainer_w - (_this.$prev.width() + _this.$next.width());
					$hit = $('<div class="hitarea" />');
					$hit.css({
						'position': 'absolute',
						'width': w,
						'height': _this.$picContainer.height(),
						'left': '50%',
						'top': '50%',
						'margin-left': - w / 2,
						'margin-top': - _this.$picContainer.height() / 2,
						'z-index': 3
					});
					$picCon.prepend($hit);
				} else {
					$hit = _this.$picContainer;
				}

				_this.$picContainer.wrap(function() {
					var $this = $(this);
					return '<div style="width:' + _this.picContainer_w + 'px; height:' + _this.picContainer_h + 'px; overflow: hidden;" />';
				});

				_this.$picContainer.css({
					'position': _this.$picContainer.css('position') == 'absolute' ? 'absolute' : 'relative',
					'overflow': 'visible'
				});

				$hit[0].addEventListener('touchstart', touchstart_hit, true);

				$hit[0].addEventListener('touchmove', touchmove_hit, true);

				$hit[0].addEventListener('touchend', touchend_hit, true);
			},
			
			doSlidePrev: function(type) {
				_this.playing = true;
				_this.prevNum = _this.nowNum;
				if (_this.nowNum <= 0) {
					if (_this.loop && (_this.touch_loop || type != 'touch')) _this.nowNum = _this.picLen - _this.visible;
				} else {
					_this.nowNum--;
				}
				_this.itemPos(_this.nowNum, 'animate');
			},
			
			doSlideNext: function(type) {
				_this.playing = true;
				_this.prevNum = _this.nowNum;
				if (_this.nowNum >= _this.picLen - _this.visible) {
					if (_this.loop && (_this.touch_loop || type != 'touch')) _this.nowNum = 0;
				} else {
					_this.nowNum++;
				}
				_this.itemPos(_this.nowNum, 'animate');
			},
			
			doSlideMove: function(num) {
				_this.playing = true;
				_this.play = false;
				_this.itemPos(num, 'animate');
			},
			
			checkAnimateRule: function(x) {
				return (x <= -(_this.picContainer_w * 2) || x >= _this.picContainer_w * 2);
			},
			
			visibleSwitch: function(i, x, y) {
				var cssObj = {},
					$pic = _this.$pics.eq(i),
					w = $pic.width();
				
				if (_this.checkAnimateRule(x)) {
					cssObj = {
						'visibility': 'hidden',
						'z-index': 1,
						'y': 0
					};
				} else {
					cssObj = {
						'visibility': 'visible',
						'z-index': 2,
						'y': 0
					};
				}
				
				$pic.css(cssObj);
			},
			
			itemTween: function(i, x, y, type) {
				var $pic = _this.$pics.eq(i),
					w = w = $pic.width(),
					x = Math.ceil(x),
					y = Math.ceil(y);
				_this.visibleSwitch(i, x, y);
				if (_this.checkAnimateRule(x)) type = 'css';
				$pic.clearQueue();
				switch (type) {
					case 'animate':
						$pic
						.css({'position': 'absolute', 'border': '0'})
						.animate({
							left: x
						}, _this.speed, _this.easing, function() {
							if (i >= _this.picLen - 1) {
								_this.playing = false;
								if (_this.hook_itemTween_after) _this.hook_itemTween_after(_this.nowNum, _this.datas);
							}
						});
						break;
					case 'css':
						$pic.css({
							'position': 'absolute',
							left: x
						});
						if (i >= _this.picLen - 1) {
							_this.playing = false;
							if (_this.hook_itemTween_after) _this.hook_itemTween_after(_this.nowNum, _this.datas);
						}
						break;
				}
			},
			
			itemPos: function(step_num, type) {
				if (_this.hook_slidemove_before_click) _this.hook_slidemove_before_click(step_num, _this.datas);
				
				_this.$pic = _this.$pics.eq(step_num);
				_this.$pic.siblings().removeClass(_this.stepCss);
				_this.$pic.addClass(_this.stepCss);
				if (_this.pagination) {
					_this.$page = _this.$pages.eq(step_num);
					_this.$page.siblings().removeClass(_this.stepCss);
					_this.$page.addClass(_this.stepCss);
				}
				
				var step_w = _this.$pic.outerWidth(),
					step_x = _this.align == 'center' ? _this.picContainer_w / 2 - step_w / 2 : 0,
					y = 0,
					len = _this.picLen - 1;
					
				for (var i = 0; i <= len; i++) {
					var switchRatio = (step_num > i) ? 0 : 1,
						x = 0;
					if (switchRatio == 0) {
						// 小於
						x = (function() {
							var tmp_w = 0;
							for (var k = i; k < step_num; k++) {
								tmp_w += _this.$pics.eq(k).outerWidth();
							}
							return step_x - tmp_w;
						})();
					} else {
						// 大於
						x = (function() {
							var tmp_w = 0;
							for (var k = step_num; k < i; k++) {
								tmp_w += _this.$pics.eq(k).outerWidth();
							}
							return step_x + _this.$pics.eq(step_num).outerWidth() + tmp_w - step_w;
						})();
					}
					$.data(_this.$pics.eq(i)[0], 'x', x);
				}
				
				var pushLast = function(num) {
					if (step_num <= num - 1) {
						for (var i = len; i >= len - num; i--) {
							var k = (i == len) ? 0 : i + 1,
								x = $.data(_this.$pics.eq(k)[0], 'x'),
								pos_x = x - _this.$pics.eq(i).width();

							$.data(_this.$pics.eq(i)[0], 'x', pos_x);
						}
					} else if (step_num >= len - num - 1) {
						for (var i = 0; i <= num; i++) {
							var k = (i == 0) ? len : i - 1,
								x = $.data(_this.$pics.eq(k)[0], 'x'),
								pos_x = x + _this.$pics.eq(k).width();
							
							$.data(_this.$pics.eq(i)[0], 'x', pos_x);
						}
					}
				};
				pushLast(_this.pushLen);
				
				for (var i = 0; i <= len; i++) {
					var x = $.data(_this.$pics.eq(i)[0], 'x');
					_this.itemTween(i, x, y, type);
				}
				
				_this.$picContainer.css({
					width: _this.picContainer_w,
					height: _this.picContainer_h
				});

				if (_this.hook_itemPos) _this.hook_itemPos(_this.nowNum);

				_this.nowNum = step_num;
			},
			
			timeout: function() {
				_this.interval = setInterval(function() {
					if (_this.play) {
						_this.doSlideNext();
					}
				}, _this.time);
			},

			close: function() {
				_this.$wrap.fadeOut(500, function() {
					_this.$wrap.remove();
					_this.$win.unbind('resize', _this.delay_initStage);
				});
			}
		};
		
		_this = $.extend(_public, _configs, _privaty);
		
		this.close = _this.close;

		return this.each(function() {
			_this.__construct(this);
		});
	};

	$.fn.JslideAnchor = function(_configs) {
		var _public = {},
			_privaty = {},
			_this = {};
			
		_public = {
			jslide_obj: '',
			jslide_config: {}
		};
		
		_privaty = {
			$body: $('body'),
			$self: {},
			$jslide_obj: {},

			__construct: function(self) {
				_this.$self = $(self);
				_this.add_anchor_event();
			},

			add_anchor_event: function() {
				_this.$self.bind('click', _this.do_jslide);
			},

			do_jslide: function() {
				var $this = $(this);

				$.getJSON('jquery.Jslide.json', function(datas) {
					_this.$jslide_obj = $(datas.html);
					_this.$body.append(_this.$jslide_obj);
					_this.$jslide_obj.fadeIn(500, _this.add_jslide_close_event);
					_this.$jslide_obj.Jslide($.extend(_this.jslide_config, {show_close: true}, $this.data()));
				});
			},

			add_jslide_close_event: function() {
				_this.$jslide_obj.find('.close').bind('click', _this.do_jslide_close);
			},

			do_jslide_close: function() {
				_this.$jslide_obj.close();
			}
		};

		_this = $.extend(_public, _configs, _privaty);

		return this.each(function() {
			_this.__construct(this);
		});
	};
})(jQuery);