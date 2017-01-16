'use strict';

var collect = new Audio(chrome.extension.getURL('collect.ogg'));
var collectSpecial = new Audio(chrome.extension.getURL('collect_special.ogg'));

var rarities = {
	epic: 'epic',
	legendary: 'legendary'
};

function save(key, value) {
	localStorage.setItem(key, JSON.stringify(value));
}

function load(key) {
	var value = localStorage.getItem(key);
	return value && JSON.parse(value) || [];
}

function getKey(rarity) {
	return 'github-loot-' + rarity;
}
function getStore(rarity) {
	return load(getKey(rarity));
}

if (localStorage) {
	$('.sha, .commit-tease-sha, a.commit-id').each(function (i, v) {
		var a = $(v);
		if (a.text().match(/[a-f]{7}/)) {
			attach('legendary', a);
		} else if (a.text().match(/\d{7}/)) {
			attach('epic', a);
		}
	});
}

function play(sound) {
	sound.pause();
	sound.currentTime = 0;
	sound.play();
}

function attach(rarity, a) {
	var sha = a.text();
	var store = getStore(rarity);
	console.log(rarity, a.text());
	if (store.indexOf(sha) === -1) {
		a.addClass(rarity);
		a.on('click', function (e) {
			var store = getStore(rarity);
			e.preventDefault();
			store.push(sha);
			var message = 'New ' + rarity;
			switch (rarity) {
				case rarities.legendary:
					play(collectSpecial);
					toastr.success('Total: ' + store.length, message);
					break;
				case rarities.epic:
					play(collect);
					toastr.info('Total: ' + store.length, message);
					break;
			}

			save(getKey(rarity), store);

			a.unbind('click');
			a.removeClass(rarity);
		});
	}
}

function addCss(sheet) {
	var style = document.createElement('link');
	style.rel = 'stylesheet';
	style.type = 'text/css';
	style.href = chrome.extension.getURL(sheet);
	(document.head || document.documentElement).appendChild(style);
}

addCss('bower_components/toastr/toastr.min.css');
addCss('style.css');
//# sourceMappingURL=contentscript.js.map
