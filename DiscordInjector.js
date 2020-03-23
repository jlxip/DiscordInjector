const _electron = require('electron');
const _path = require('path');
const _fs = require('fs');

function DiscordInjector_getExtensionsDir() {
	return _path.join(
		_electron.remote.app.getPath('appData'),
		'discord-injector'
	);
}


let extensions_cache = null
function DiscordInjector_getExtensions() {
	if(extensions_cache === null) {
		const extensionsdir = DiscordInjector_getExtensionsDir();
		if(!_fs.existsSync(extensionsdir)) {
			_fs.mkdirSync(extensionsdir);
		}

		extensions_cache = _fs.readdirSync(extensionsdir);
	}

	return extensions_cache;
}

/*
	Here are some things that might change in the future,
	in which case I should look for them dynamically.
	Until that, I consider them to be constants.
*/
const classToolbar = 'toolbar-1t6TWx'
const classIconWrapper = 'iconWrapper-2OrFZ1'
const classClickable = 'clickable-3rdHwn'

function showDIwindow() {
	// Show the DiscordInjector menu when the button is clicked.
	let appmount = document.getElementById('app-mount');

	let diwin_modal = document.createElement('DIV');
	diwin_modal.id = 'diwin_modal';
	diwin_modal.style = `
		position: fixed;
		z-index: 1000;
		padding-top: 100px;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgb(0, 0, 0, 0.4);
		diwin_modal.style.overflow: auto;
	`;

	// The contents.
	let diwin_contents = document.createElement('DIV')
	diwin_contents.style = `
		margin: auto;
		padding: 20px;
		border: 1px solid #262930;
		border-radius: 10px;
		width: 480px;
		background-color: #363940;
		color: #feffff;
	`;
	
	// Make it so clicking outside the modal window closes it.
	const old_window_onclick = window.onclick;
	window.onclick = (evt) => {
		if(evt.target == diwin_modal) {
			appmount.removeChild(diwin_modal);
			window.onclick = old_window_onclick;
		}
	}

	// Close button.
	let diwin_close = document.createElement('SPAN');
	diwin_close.id = 'diwin_close';
	diwin_close.innerHTML = '&times;';
	diwin_close.style = `
		color: #bbb;
		float: right;
		font-size: 28px;
		font-weight: bold;
	`;
	diwin_close.onclick = () => {
		appmount.removeChild(diwin_modal);
		window.onclick = old_window_onclick;
	}
	let diwin_close_css = `
		span#diwin_close:hover, span#diwin_close:focus {
			color: #fff;
			text-decoration: none;
			cursor: pointer;
		}
	`;
	let diwin_close_style = document.createElement('style');
	diwin_close_style.appendChild(document.createTextNode(diwin_close_css));

	let diwin_title = document.createElement('H1');
	diwin_title.innerText = 'Discord Injector';
	diwin_title.style = `
		text-align: center;
		margin-top: 16px;
	`;

	let diwin_ul = document.createElement('UL');
	DiscordInjector_getExtensions().forEach((i) => {
		let x = document.createElement('LI');
		x.innerText = i;
		diwin_ul.appendChild(x);
	});

	document.getElementsByTagName('head')[0].appendChild(diwin_close_style);
	diwin_contents.appendChild(diwin_close);
	diwin_contents.appendChild(diwin_title);
	diwin_contents.appendChild(diwin_ul);
	diwin_modal.appendChild(diwin_contents);
	appmount.appendChild(diwin_modal);
}



console.log("[DiscordInjector] Waiting for the toolbar to show up...");
var checkExist = setInterval(function() {
	let e = document.getElementsByClassName(classToolbar)
	if(e.length) {
		// Already injected?
		if(document.getElementById('DiscordInjectorButton')) return;

		extensions_cache = null;

		console.log('[DiscordInjector] Injecting button');
		let button = document.createElement('DIV');
		button.tabindex = '0';
		button.id = 'DiscordInjectorButton'
		button.classList.add(classIconWrapper);
		button.classList.add(classClickable);
		button.classList.role = 'button';
		button.onclick = showDIwindow

		button.innerHTML = '<svg x="0" y="0" class="icon-22AiRD" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19.586.164a.55.55 0 0 0-.785 0 .55.55 0 0 0 0 .785l1.168 1.168-1.027.988 1.87 1.87 1.027-.988-.937-.934 2.102 2.102c.22.22.57.22.8 0a.56.56 0 0 0 0-.785zm2.854 7.184L16.6 1.512a.56.56 0 0 0-.785 0c-.22.22-.22.57 0 .8l.84.84-1.6 1.6 1.336 1.332c.13.133.13.348 0 .48a.34.34 0 0 1-.48 0L14.58 5.228l-1.23 1.234 1.332 1.332c.137.125.14.336.016.473s-.336.14-.47.016L12.875 6.93l-1.23 1.23 1.332 1.332a.33.33 0 0 1 .016.473c-.125.133-.336.14-.47.016-.008-.004-.012-.012-.016-.016L11.172 8.63 9.94 9.86l1.332 1.336a.34.34 0 0 1 .004.477c-.133.133-.344.133-.477 0L9.465 10.34l-1.23 1.234 1.332 1.332a.33.33 0 0 1 .016.473c-.125.133-.336.14-.47.016-.008-.004-.012-.012-.02-.016L7.76 12.043 6.53 13.27l1.336 1.336c.133.125.14.336.016.47s-.336.145-.473.02c-.004-.008-.008-.012-.016-.02l-1.332-1.332-1.6 1.6 1.14 1.14-1.375 1.375.7.695-4.78 4.8a.33.33 0 0 0-.02.469c.125.137.336.145.473.02.004-.008.012-.012.016-.02l4.785-4.78.7.7 1.375-1.375 1.14 1.14 12.2-12.2.828.84a.555.555 0 1 0 .785-.785zm0 0"/></svg>';

		e[0].appendChild(button);


		console.log('[DiscordInjector] Injecting extensions');
		const injections = DiscordInjector_getExtensionsDir();
		DiscordInjector_getExtensions().forEach((i) => {
			const x = _path.join(injections, i);
			_fs.readFile(x, 'utf8', (err, contents) => {
				eval(contents);
			});
		});
		console.log('[DiscordInjector] All extensions have been injected. They\'ll show up any moment now.');
	}
}, 1000);
