# DiscordInjector

## Notice
* Custom clients are prohibited by the Discord ToS. Use at your own risk.
* While using DiscordInjector, do not contact Discord for any kind of support regarding the client. Each non-official line running in the app is yet another factor to take into consideration in case something goes wrong, and the Discord dev team should not need to take it into account.
* Also, don't write any kind of spamming tool using DiscordInjector. This projects aims to enhance your Discord experience, not harm other's.

## The what
DiscordInjector is a patch for the desktop Discord client which lets you inject any node code (_extensions_) in the application. You can do anything with it from modifying the CSS to hooking the message send action to modify your messages, opening a new window (practically creating a new application inside Discord), or read/write local files.

Once DiscordInjector is installed, an icon of a syringe will appear at the top right corner of the window. Click it, and you'll se a list of loaded extensions. The extensions are `.js` files stored at `APPDATA/discord-injector`, where `APPDATA` is `%APPDATA%` on Windows and `XDG_CONFIG_HOME` or `~/.config` on GNU/Linux.

The environment variable `DISCORD_DIR` can be set to `discordptb` to patch the public test build.

## The why
I guess it's fun? Extending the capabilities of an application is always nice.

## Automated patch (recommended)
A python script is offered to automatically patch your Discord installation and makes it easy to update. Run it with `python3 patch.py`.

## Manual patch
* Close Discord.
* Go to `APPDATA/discord/VERSION/modules/discord_desktop_core`, where `APPDATA` is the same as explained above, and `VERSION` is currently `0.0.10`, but may change in the future.
* Make a backup of `core.asar`.
* Unpack the ASAR file: `asar extract core.asar extracted`. You might need to install `asar` with `npm install -g asar`.
* Go to `extracted/app`.
* Append the contents of `DiscordInjector.js` at the end of the file `mainScreenPreload.js`.
* Repack the ASAR file: `asar pack extracted core.asar`.

## Hints for developers
You have the functions `DiscordInjector_getExtensionsDir` (which returns the extensions directory) and `DiscordInjector_getExtensions` (gives an array of the names, including `.js`) at your disposal in case you want to check if another extension is present (for dependency checking).

They are loaded asynchronously, so you cannot rely on another one being loaded before yours.

## Credits
The SVG of the syringe comes from [here](https://www.flaticon.com/free-icon/injection_1086932), resized with [this tool](https://www.iloveimg.com/resize-image/resize-svg) and compressed with [this other one](https://vecta.io/nano).
