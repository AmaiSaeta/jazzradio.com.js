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

	// Force change 'hinttags' scope to allow local.
	if (!(options.get('hinttags').scope & Option.SCOPE_LOCAL)) {
		options.get('hinttags').scope |= Option.SCOPE_LOCAL;
		autocommands.add('LocationChange', '.*', 'javascript delete tabs.options.hinttags');
	}

	// Not player pages exclude difficult, because player's URLs (jazzradio.com/(channel name) ) are same rule of non-pleyer page.
	autocommands.add('LocationChange', uriPattern, 'setlocal hinttags+=|' + playerHinttags);
})();
