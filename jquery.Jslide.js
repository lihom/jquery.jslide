/*
 * Jslide - jQuery Plugin
 * 
 * @author		hom
 * @license		http://lab.a2.kiiiick.com/MIT-LICENSE.txt
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
			touch: true,
			autoplay: false,
			pic_switch: true,
			pagination: false,
			show_broad: false,
			show_close: false,
			show_nav: false,
			resize_mode: true,
			
			win: window,
			pic_wrap: '.Jslide-wrap',
			pic_loading: '.Jslide-loading',
			pic_bg: '.Jslide-bg',
			pic_container: '.Jslide-carousel',
			pics: '.Jslide-carousel > li',
			pagination_con: '.Jslide-page-wrap',
			page_con: '.Jslide-page-container',
			pages: '.Jslide-page',
			nav: '.Jslide-nav',
			prev: '.Jslide-prev',
			next: '.Jslide-next',
			broad: '.Jslide-broad',
			close_btn: '.Jslide-close',
			hitarea: '.Jslide-hitarea',
			
			pager: '',
			speed: 1000,
			time: 5000,
			step_css: 'step',
			easing: 'easeOutQuart',
			visible: 1,
			align: 'center',

			source: false,
			
			hook_item_pos: false,
			hook_slidemove_before_click: false,
			hook_init_stage_before: false,
			hook_item_tween_after: false,
			hook_install_after: false,
			hook_close_after: false,
			hook_reset_pagination: false
		};
		
		_privaty = {
			$win: {},
			$wrap: {},
			$self: {},
			$loading: {},
			$bg: {},
			$pic: {},
			$pics: {},
			$pic_container: {},
			$page: {},
			$pages: {},
			$page_con: {},
			$pagination_con: {},
			$nav: {},
			$prev: {},
			$next: {},
			$broad: {},
			$close_btn: {},
			pic_container_w: 0,
			pic_container_h: 0,
			pic_len: 0,
			pics_w: 0,
			pic_w: 0,
			pic_x: 0,
			now_num: 0,
			prev_num: 0,
			datas: [],
			safe_lan: 10,
			push_len: 2,
			interval: {},
			init: true,
			play: true,
			playing: false,
			click_evt: 'click',

			__construct: function(self) {
				_this.click_evt = (_this.is_mobile()) ? 'touchend' : 'click';

				_this.$win = $(_this.win);
				_this.$self = $(self);
				_this.$self.css('opacity', 0);
				_this.$pic_container = $(_this.pic_container, _this.$self).eq(0);

				_this.$pagination_con = $(_this.pagination_con, _this.$self);
				_this.$page_con = $(_this.page_con, _this.$self);

				_this.$broad = $(_this.broad, _this.$self);

				_this.$close_btn = $(_this.close_btn, _this.$self);

				_this.init_loading();

				_this.rebuild();
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
					if (datas.length <= _this.safe_lan) {
						datas = clone_data(datas, Math.floor(_this.safe_lan / datas.length));
					}

					var $item = $(_this.pics, _this.$self).eq(0).clone();
					$item.wrap('<div>');
					_this.$pic_container.html('');

					for (var k in datas) {
						$item.find('img').attr('src', datas[k].url)
						var html = $item.parent().html();
						_this.$pic_container.append(html);
					}
					$item.remove();

					if (_this.pagination) {
						var $item = $(_this.pages, _this.$self).eq(0).clone();
						$item.wrap('<div>');
						_this.$page_con.html('');
						for (var k in datas) {
							$item.find('img').attr('src', datas[k].url)
							var html = $item.parent().html();
							_this.$page_con.append(html);
						}
						$item.remove();
					}

					_this.datas = datas;

					_this.install();
				}
			},

			install: function() {
				_this.$nav = $(_this.nav, _this.$self).eq(0);
				_this.$prev = $(_this.prev, _this.$self).eq(0);
				_this.$next = $(_this.next, _this.$self).eq(0);
				_this.$pics = $(_this.pics, _this.$self);
				
				_this.pic_container_w = _this.$self.width();
				_this.pic_container_h = _this.$self.height();
				_this.pic_len = _this.$pics.length;
				
				if (_this.pic_len <= _this.safe_lan) _this.push = false;
				if (_this.pic_len <= _this.visible) _this.$nav.remove();
				
				if (_this.is_mobile() && _this.touch && _this.init) {
					_this.do_touch_event();
				} else {
					if (_this.pic_switch) {
						_this.init_pic_switch();
					}
				}

				if (_this.pagination) {
					_this.init_pagination();
				} else {
					_this.$pagination_con.remove();
				}

				if (_this.show_broad) {
					
				} else {
					_this.$broad.remove();
				}

				if (_this.show_close) {
					_this.init_closeBtn();
				} else {
					_this.$close_btn.remove();
				}

				if (_this.show_nav) {
					
				} else {
					_this.$nav.remove();
				}
				
				if (_this.resize_mode) {
					_this.$win.bind('resize', _this.delay_init_stage);
				}
				
				//_this.init_stage();
				_this.preload(function() {
					setTimeout(_this.init_stage, 10);
				});
				
				_this.$prev.bind(_this.click_evt, function() {
					_this.do_slide_prev();
				});
				_this.$next.bind(_this.click_evt, function() {
					_this.do_slide_next();
				});
				
				if (_this.autoplay) {
					_this.$self.bind('mousemove', function() {
						_this.play = false;
					});
					_this.$self.bind('mouseenter', function() {
						_this.disable_auto_play();
					});
					_this.$self.bind('mouseleave', function() {
						_this.enable_auto_play();
					});
					_this.$win.bind('blur', function() {
						_this.disable_auto_play();
					});
					_this.$win.bind('focus', function() {
						_this.enable_auto_play();
					});
					_this.timeout();
				}

				if (_this.hook_install_after) _this.hook_install_after();
			},

			init_loading: function() {
				_this.$loading = $('<div class="' + _this.pic_loading.replace('.', '') + '">');
				_this.$bg = $('<div class="' + _this.pic_bg.replace('.', '') + '">');
				_this.$self.wrap('<div class="' + _this.pic_wrap.replace('.', '') + ' working">');
				_this.$wrap = _this.$self.parent();
				_this.$wrap.append(_this.$loading);
				_this.$wrap.append(_this.$bg);
			},

			loading: function(precent) {
				precent = precent || 0;
				_this.$loading.width(precent + '%');
				if (precent >= 100) {
					_this.$loading.fadeOut(1000);
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
						_this.loading((cnt / _this.pic_len) * 100);
						if (cnt >= _this.pic_len && callback) callback();
					};
					img.src = this.src;
				});
			},

			close: function() {
				_this.$wrap.fadeOut(500, function() {
					_this.$wrap.remove();
					_this.$win.unbind('resize', _this.delay_init_stage);
					if (_this.hook_close_after) _this.hook_close_after();
				});
			},

			init_closeBtn: function() {
				_this.$close_btn.bind(_this.click_evt, function() {
					_this.close();
				});
			},

			init_pic_switch: function() {
				_this.$pics.bind(_this.click_evt, function() {
					var $this = $(this),
						num = $this.data('num');
					if ($this.hasClass(_this.step_css) == false) _this.item_pos(num, 'animate');
				});
			},
			
			init_pagination: function() {
				_this.$page_con_parent = _this.$page_con.parent();
				_this.$pages = $(_this.pages, _this.$self);

				_this.reset_pagination();

				if (_this.pic_len <= _this.visible) {
					_this.$pagination_con.css('display', 'none');
				} else {
					_this.$pages.each(function(i) {
						var $this = $(this);
						$.data($this[0], 'index', i);
					});
					_this.$pages.bind(_this.click_evt, function() {
						var index = $(this).data('index');
						_this.do_slide_move(index);
					});
				}
			},

			reset_pagination: function() {
				_this.$page_con_parent.css('height', _this.$page_con.height());
				_this.$pages.width(Math.floor(_this.$page_con_parent.width() / _this.pic_len));

				var w = 0;
				_this.$pages.each(function() {
					w += $(this).width();
				});
				
				_this.$page_con.css({
					'position': 'absolute',
					'left': '50%',
					'margin-left': - Math.ceil(w / 2),
					'overflow': 'visible',
					'width': w
				});

				if (_this.hook_reset_pagination) _this.hook_reset_pagination();
			},

			delay_init_stage: function() {
				setTimeout(_this.init_stage, 10);
			},

			init_stage: function() {
				if (_this.hook_init_stage_before) _this.hook_init_stage_before(); 

				_this.$pic = _this.$pics.eq(_this.now_num);
				_this.pic_container_w = _this.$self.width();
				_this.pic_container_h = _this.$self.height();
				_this.$pics.find('img').attr('height', _this.pic_container_h);
				_this.$pics.each(function(i) {
					var $this = $(this);
					_this.pics_w += $this.width();
					$this.data('num', i);
				});

				if (_this.pagination) {
					_this.reset_pagination();
				}
				
				_this.item_pos(_this.now_num, 'css');

				if (_this.init) {
					_this.$wrap.removeClass('working');
					_this.$self.animate({'opacity': 1}, 800);
				}

				_this.init = false;
			},
			
			enable_auto_play: function() {
				_this.play = true;
				clearInterval(_this.interval);
				_this.timeout();
			},
			
			disable_auto_play: function() {
				_this.play = false;
				clearInterval(_this.interval);
			},
			
			do_touch_event: function() {
				var touch = {
						x: 0,
						y: 0
					},
					touch_now = {
						x: 0,
						y: 0
					},
					delta = 0,
					winScroll = false,
					timeout = {};
					
				var get_event_pos_x = function(e) {
					if (e.touches) {
						var touch = e.touches[0],
							x = touch.pageX;
					} else {
						var x = e.offsetX;
					}
					return x;
				};
				
				var get_event_pos_y = function(e) {
					if (e.touches) {
						var touch = e.touches[0],
							y = touch.pageY;
					} else {
						var y = e.offsetY;
					}
					return y;
				};

				var touchstart_hit = function(e) {
					_this.$pic_container.stop();
					clearTimeout(timeout);
					disable_scroll();
					_this.play = false;
					_this.disable_auto_play();
					touch.x = get_event_pos_x(e);
					touch.y = get_event_pos_y(e);
					touch_now.x = touch.x;
					touch_now.y = touch_now.y;
				};

				var touchmove_hit = function(e) {
					_this.play = false;
					touch_now.x = get_event_pos_x(e);
					touch_now.y = get_event_pos_y(e);
					if (Math.abs(touch_now.y - touch.y) > Math.abs(touch_now.x - touch.x)) {
						delta = 0;
						return;
					}
					delta = touch_now.x >= touch.x ? 1 : -1;
					_this.$pic_container.css({left:touch_now.x - touch.x});
					if (Math.abs(touch_now.x - touch.x) < Math.floor(_this.pic_container_w * .5)) {
						delta = 0;
						return;
					}
				};

				var touchend_hit = function(e) {
					_this.play = false;
					_this.$pic_container.animate({left: 0}, (delta == 0) ? 800 : 1000, _this.easing);
					timeout = setTimeout(enableScroll, _this.speed / 2);
					if (touch_now.x == touch.x) {
						delta = touch.x <= $hit.width() / 2 ? 1 : -1;
					}
					if (delta == 0) return;
					if (delta > 0) {
						_this.do_slide_prev();
					} else {
						_this.do_slide_next();
					}
				};
				
				var disable_prevent_default = function(e) {
					e.preventDefault();
				};
				
				var disable_scroll = function() {
					_this.$win[0].addEventListener('touchmove', disable_prevent_default, true);
					$hit[0].addEventListener('touchmove', touchmove_hit, true);
				};
				
				var enableScroll = function() {
					_this.$win[0].removeEventListener('touchmove', disable_prevent_default, true);
					$hit[0].removeEventListener('touchmove', touchmove_hit, true);
				};
				
				var $pic_con = _this.$pic_container.parent(),
					$pic_anchor = $pic_con.find('a'),
					$hit = {};

				if ($pic_anchor.length == 0) {
					var w = _this.pic_container_w - (_this.$prev.width() + _this.$next.width());
					$hit = $('<div class="' + _this.hitarea.replace('.', '') + '">');
					$pic_con.prepend($hit);
				} else {
					$hit = _this.$pic_container;
				}

				_this.$pic_container.wrap(function() {
					var $this = $(this);
					return '<div style="width:' + _this.pic_container_w + 'px; height:' + _this.pic_container_h + 'px; overflow: hidden;" />';
				});

				_this.$pic_container.css({
					'position': _this.$pic_container.css('position') == 'absolute' ? 'absolute' : 'relative',
					'overflow': 'visible'
				});

				$hit[0].addEventListener('touchstart', touchstart_hit, true);

				$hit[0].addEventListener('touchmove', touchmove_hit, true);

				$hit[0].addEventListener('touchend', touchend_hit, true);
			},
			
			do_slide_prev: function(type) {
				type = type || 'animate';
				_this.playing = true;
				_this.prev_num = _this.now_num;
				if (_this.now_num <= 0) {
					if (_this.loop) _this.now_num = _this.pic_len - _this.visible;
				} else {
					_this.now_num--;
				}
				_this.item_pos(_this.now_num, type);
			},
			
			do_slide_next: function(type) {
				type = type || 'animate';
				_this.playing = true;
				_this.prev_num = _this.now_num;
				if (_this.now_num >= _this.pic_len - _this.visible) {
					if (_this.loop) _this.now_num = 0;
				} else {
					_this.now_num++;
				}
				_this.item_pos(_this.now_num, type);
			},
			
			do_slide_move: function(num) {
				_this.playing = true;
				_this.play = false;
				_this.item_pos(num, 'animate');
			},
			
			check_animate_rule: function(x, i) {
				return (
					(x <= -_this.pic_container_w || x >= _this.pic_container_w) &&
					(
						Math.abs(_this.now_num - i) >= _this.push_len && 
						Math.abs(_this.now_num - i) <= (_this.pic_len - _this.push_len)
					)
				);
			},
			
			visible_switch: function(i, x, y) {
				var cssObj = {},
					$pic = _this.$pics.eq(i);
				
				if (_this.check_animate_rule(x, i)) {
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
			
			item_tween: function(i, x, y, type) {
				var $pic = _this.$pics.eq(i),
					x = Math.ceil(x),
					y = Math.ceil(y);
				_this.visible_switch(i, x, y);
				if (_this.check_animate_rule(x, i)) type = 'css';
				$pic.stop();
				switch (type) {
					case 'animate':
						$pic
						.animate({
							left: x
						}, _this.speed, _this.easing, function() {
							if (i >= _this.pic_len - 1) {
								_this.playing = false;
								if (_this.hook_item_tween_after) _this.hook_item_tween_after(_this.now_num, _this.datas);
							}
						});
						break;
					case 'css':
						$pic.css({
							left: x
						});
						if (i >= _this.pic_len - 1) {
							_this.playing = false;
							if (_this.hook_item_tween_after) _this.hook_item_tween_after(_this.now_num, _this.datas);
						}
						break;
				}
			},
			
			item_pos: function(step_num, type) {
				if (_this.hook_slidemove_before_click) _this.hook_slidemove_before_click(step_num, _this.datas);
				
				_this.$pic = _this.$pics.eq(step_num);
				_this.$pic.siblings().removeClass(_this.step_css);
				_this.$pic.addClass(_this.step_css);

				_this.pic_w = _this.$pic.outerWidth();
				_this.pic_x = _this.align == 'center' ? _this.pic_container_w / 2 - _this.pic_w / 2 : 0;

				if (_this.pagination) {
					_this.$page = _this.$pages.eq(step_num);
					_this.$page.siblings().removeClass(_this.step_css);
					_this.$page.addClass(_this.step_css);
				}
				
				var y = 0,
					len = _this.pic_len - 1;
					
				for (var i = 0; i <= len; i++) {
					var switch_ratio = (step_num > i) ? 0 : 1,
						x = 0;
					if (switch_ratio == 0) {
						x = (function() {
							var tmp_w = 0;
							for (var k = i; k < step_num; k++) {
								tmp_w += _this.$pics.eq(k).outerWidth();
							}
							return _this.pic_x - tmp_w;
						})();
					} else {
						x = (function() {
							var tmp_w = 0;
							for (var k = step_num; k < i; k++) {
								tmp_w += _this.$pics.eq(k).outerWidth();
							}
							return _this.pic_x + _this.$pics.eq(step_num).outerWidth() + tmp_w - _this.pic_w;
						})();
					}
					_this.$pics.eq(i).data('x', x);
				}
				
				var push_last = function(num) {
					if (step_num <= num - 1) {
						for (var i = len; i >= len - num; i--) {
							var k = (i == len) ? 0 : i + 1,
								x = _this.$pics.eq(k).data('x'),
								pos_x = x - _this.$pics.eq(i).width();

							_this.$pics.eq(i).data('x', pos_x);

						}
					} else if (step_num >= len - num - 1) {
						for (var i = 0; i <= num; i++) {
							var k = (i == 0) ? len : i - 1,
								x = _this.$pics.eq(k).data('x'),
								pos_x = x + _this.$pics.eq(k).width();
							
							_this.$pics.eq(i).data('x', pos_x);
						}
					}
				};
				push_last(_this.push_len);
				
				for (var i = 0; i <= len; i++) {
					var x = _this.$pics.eq(i).data('x');
					_this.item_tween(i, x, y, type);
				}
				
				_this.$pic_container.css({
					width: _this.pic_container_w,
					height: _this.pic_container_h
				});

				if (_this.hook_item_pos) _this.hook_item_pos(_this.now_num);

				_this.now_num = step_num;
			},

			is_mobile: function(){
				var agent = (navigator.userAgent||navigator.vendor||window.opera).toLowerCase();
				var is_mobile = /android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|ad|od)|iris|kindle|lge |maemo|meego.+mobile|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(agent)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(agent.substr(0,4));
				var result = is_mobile ? true : false;
				return result;
			},
			
			timeout: function() {
				_this.interval = setInterval(function() {
					if (_this.play) {
						_this.do_slide_next();
					}
				}, _this.time);
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
			jslide_config: {},
			jslide_html: '<div class="Jslide-container"><ul class="Jslide-carousel"><li><img height="100%" /></li></ul><div class="Jslide-nav"><div class="Jslide-prev">&lsaquo;</div><div class="Jslide-next">&rsaquo;</div></div><div class="Jslide-page-wrap"><div class="Jslide-page-container"><div class="Jslide-page"></div></div></div><div class="Jslide-broad"><h1></h1><p></p></div><div class="Jslide-close">x</div></div>'
		};
		
		_privaty = {
			$body: $('body'),
			$self: {},
			$jslide_obj: {},
			click_evt: 'click',

			__construct: function(self) {
				_this.click_evt = (_this.is_mobile()) ? 'touchend' : 'click';
				_this.$self = $(self);
				_this.add_anchor_event();
			},

			add_anchor_event: function() {
				_this.$self.bind(_this.click_evt, _this.do_jslide);
			},

			do_jslide: function() {
				var $this = $(this);

				_this.$jslide_obj = $(_this.jslide_html);
				_this.$body.append(_this.$jslide_obj);
				_this.$jslide_obj.fadeIn(500);
				_this.$jslide_obj.Jslide($.extend(_this.jslide_config, {show_close: true}, $this.data()));
			},

			is_mobile: function(){
				var agent = (navigator.userAgent||navigator.vendor||window.opera).toLowerCase();
				var is_mobile = /android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|ad|od)|iris|kindle|lge |maemo|meego.+mobile|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(agent)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(agent.substr(0,4));
				var result = is_mobile ? true : false;
				return result;
			}
		};

		_this = $.extend(_public, _configs, _privaty);

		return this.each(function() {
			_this.__construct(this);
		});
	};
})(jQuery);