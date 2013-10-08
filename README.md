Jslide
======

jQuery plugin: image slide show for desktop and mobile use.

JslideAnchor for List
---------------------

use json data

###HTML

```
<ul id="slide_list" class="slide_list">
	<li><div style="background-image:url(img/01.jpg)" data-source="json/json.php"></div></li>
	<li><div style="background-image:url(img/02.jpg)" data-source="json/json.php?f=img_1"></div></li>
	<li><div style="background-image:url(img/03.jpg)" data-source="json/json.php?f=img_2"></div></li>
	<li><div style="background-image:url(img/04.jpg)" data-source="json/json.php?f=img_3"></div></li>
	<li><div style="background-image:url(img/05.jpg)" data-source="json/json.php?f=img_4"></div></li>
</ul>
```

###JAVASCRIT

```
$('#slide_list > li > div').JslideAnchor({
	jslide_obj: '#slide',
	jslide_config: {
		show_broad: true,
		show_nav: true,
		pagination: true,
		hook_slidemove_before_click: function(k, datas) {
			var html = '<h1>' + datas[k].caption + '</h1>';
			html += '<p>' + datas[k].desc + '</p>';
			this.$broad.html(html);
		}
	}
});
```

###Demo

http://lab.a2.kiiiick.com/JS/jquery.jslide/demo-list.html


Jslide for Gallery
------------------

use inline HTML

###HTML

```
<div id="slide" class="Jslide-container">
	<ul class="Jslide-carousel">
		<li><img src="img/01.jpg" height="100%" data-caption="Image 01" data-desc="Description 01" /></li>
		<li><img src="img/02.jpg" height="100%" data-caption="Image 02" data-desc="Description 02" /></li>
		<li><img src="img/03.jpg" height="100%" data-caption="Image 03" data-desc="Description 03" /></li>
		<li><img src="img/04.jpg" height="100%" data-caption="Image 04" data-desc="Description 04" /></li>
		<li><img src="img/05.jpg" height="100%" data-caption="Image 05" data-desc="Description 05" /></li>
	</ul>
	<div class="Jslide-nav">
		<div class="Jslide-prev">&lsaquo;</div>
		<div class="Jslide-next">&rsaquo;</div>
	</div>
	<div class="Jslide-page-wrap">
		<div class="Jslide-page-container">
			<div class="Jslide-page"></div>
			<div class="Jslide-page"></div>
			<div class="Jslide-page"></div>
			<div class="Jslide-page"></div>
			<div class="Jslide-page"></div>
		</div>
	</div>
	<div class="Jslide-broad">
		<h1>Title</h1>
		<p>Description</p>
	</div>
	<div class="Jslide-close">
		x
	</div>
</div>
```

###JAVASCRIPT

- use html tag

```
$('#slide').Jslide({
	show_broad: true,
	show_nav: true,
	pagination: true,
	hook_slidemove_before_click: function(k, datas) {
		var html = '<h1>' + datas[k].caption + '</h1>';
		html += '<p>' + datas[k].desc + '</p>';
		this.$broad.html(html);
	}
});
```

- use json for api

```
$('#slide').Jslide({
	show_broad: true,
	show_nav: true,
	pagination: true,
	hook_slidemove_before_click: function(k, datas) {
		var html = '<h1>' + datas[k].caption + '</h1>';
		html += '<p>' + datas[k].desc + '</p>';
		this.$broad.html(html);
	},
	source: 'json/json.php'
});
```

- use json obj

```
$('#slide').Jslide({
	show_broad: true,
	show_nav: true,
	pagination: true,
	hook_slidemove_before_click: function(k, datas) {
		var html = '<h1>' + datas[k].caption + '</h1>';
		html += '<p>' + datas[k].desc + '</p>';
		this.$broad.html(html);
	},
	source: {
		'url_1': 'img/01.jpg',
		'url_2': 'img/02.jpg',
		'url_3': 'img/03.jpg',
		'url_4': 'img/04.jpg',
		'url_5': 'img/05.jpg'
	}
});
```

- use array

```
$('#slide').Jslide({
	show_broad: true,
	show_nav: true,
	pagination: true,
	hook_slidemove_before_click: function(k, datas) {
		var html = '<h1>' + datas[k].caption + '</h1>';
		html += '<p>' + datas[k].desc + '</p>';
		this.$broad.html(html);
	},
	source: [
		'img/01.jpg',
		'img/02.jpg',
		'img/03.jpg',
		'img/04.jpg',
		'img/05.jpg'
	]
});
```

- use json in line

```
$('#slide').Jslide({
	show_broad: true,
	show_nav: true,
	pagination: true,
	hook_slidemove_before_click: function(k, datas) {
		var html = '<h1>' + datas[k].caption + '</h1>';
		html += '<p>' + datas[k].desc + '</p>';
		this.$broad.html(html);
	},
	source: [
		{'url': 'img/01.jpg', 'caption': 'Image 01', 'desc': 'Description 01'},
		{'url': 'img/02.jpg', 'caption': 'Image 02', 'desc': 'Description 02'},
		{'url': 'img/03.jpg', 'caption': 'Image 03', 'desc': 'Description 03'},
		{'url': 'img/04.jpg', 'caption': 'Image 04', 'desc': 'Description 04'},
		{'url': 'img/05.jpg', 'caption': 'Image 05', 'desc': 'Description 05'}
	]
});
```

###Demo

http://lab.a2.kiiiick.com/JS/jquery.jslide/demo-gallery.html