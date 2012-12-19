(function() {
	// utils {{{
	// escape regexp string; http://d.hatena.ne.jp/amachang/20080530/1212128303
	function _r(str) {
		return (str + '').replace(/([\/()[\]{}|*+-.,^$?\\])/g, "\\$1");
	}

	function generateClassXpath(nodename, classname) {
		return nodename + '[contains(concat(" ", normalize-space(@class), " "), " ' + classname + ' ")]';
	}
	// }}}

	const domain = "www.jazzradio.com";
	const uriPattern = '^http://' + _r(domain) + '/';

	const playerHinttags = [
		'id("ctl-play")',       // play button
		'id("btn-volume")',     // volume button
		'id("btn-settings")',   // settings button
		'id("btn-channel")',    // channnel button
		'id("list")//' + generateClassXpath('*', 'item-wrapper-inner'), // channel list items
	].join("|");

	// Add mapping for the channel list of the player page.
	function addMap4PlayersChannelList(key, scrollQuantity, description) {
		let origMap = mappings.get(modes.NORMAL, key) || mappings.getDefault(modes.NORMAL, key);

		mappings.add([modes.NORMAL], [key],
			description,
			function() {
				const doc = content.document;

				function openedChannelMenu() {
					var channelmenu = doc.getElementById('channel-menu');
					if(!channelmenu) return false;
					return channelmenu.style.display == 'block' ? true : false;
				};

				var knob, ev;

				// closed channel-menu or non-player page.
				if(!openedChannelMenu()) {
					origMap && origMap.action(1);
					return;
				}

				list = doc.getElementById('channel-menu');
				// [FIXME] Why can not create WheelEvent? Fx17 says "Operation is not supported", but https://developer.mozilla.org/en-US/docs/DOM/WheelEvent says WheelEvent is supported by Fx17.
				// ev = doc.createEvent('WheelEvent');
				// ev.initWheelEvent("wheel", true, true, doc.defaultView, 0, 0, 0, 0, 0, 0, document.body, null, 0, (deltaYArg), 0, 0);
				ev = doc.createEvent('UIEvent');
				ev.initUIEvent('mousewheel', true, true, doc.defaultView, scrollQuantity);
				list.dispatchEvent(ev);
			},
			{ matchingUrls: uriPattern, }
		);
	};

	// Force change 'hinttags' scope to allow local.
	if (!(options.get('hinttags').scope & Option.SCOPE_LOCAL)) {
		options.get('hinttags').scope |= Option.SCOPE_LOCAL;
		autocommands.add('LocationChange', '.*', 'javascript delete tabs.options.hinttags');
	}

	// Not player pages exclude difficult, because player's URLs (jazzradio.com/(channel name) ) are same rule of non-pleyer page.
	autocommands.add('LocationChange', uriPattern, 'setlocal hinttags+=|' + playerHinttags);

	addMap4PlayersChannelList('j',  5, 'Scroll down Channel list.');
	addMap4PlayersChannelList('k', -5, 'Scroll up Channel list.');
})();
