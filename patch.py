#!/usr/bin/env python3

import os, platform, re, subprocess, shutil

BASE = '/* --- %s(DiscordInjector) --- */'
BEGIN = BASE % 'begin'
END = BASE % 'end'

def getAppdata():
	x = platform.system()
	if x == 'Linux':
		return os.getenv('HOME')+'/.config'
	elif x == 'Windows':
		return os.getenv('APPDATA')
	else:
		print('Unhandled OS:', x)
		exit()

def getVersion(core_path):
	for i in os.listdir(core_path):
		if re.compile(r"((\d+)(\.)?)+").fullmatch(i):
			return i
	return None

if __name__ == '__main__':
	print('\tDiscordInjector patch')
	print('\nMake sure Discord is closed and hit return.')
	input()

	core_path = os.path.join(getAppdata(), 'discord')
	version = getVersion(core_path)

	if not version:
		print('ERROR: version directory not found.')
		exit()

	core_path = os.path.join(core_path, version, 'modules', 'discord_desktop_core', 'core.asar')

	if not os.path.isfile(core_path):
		print('ERROR: file "%s" should be there but it\'s not.' % core_path)
		exit()

	print('Found ASAR file. Unpacking...')

	exitvalue = os.system('asar extract "%s" _tmp_asar' % core_path)
	if not exitvalue == 0:
		print('ERROR: seems like the program "asar" is not installed.')
		print('Install it with: npm install -g asar')
		print('If you\'ve already installed it, restart the terminal.')
		exit()

	print('Unpacked. Injecting...')

	preload_path = '_tmp_asar/app/mainScreenPreload.js'
	if not os.path.isfile(preload_path):
		print('ERROR: file "%s" could not be found.' % preload_path)
		exit()

	with open(preload_path, 'r') as f:
		contents = f.read()

	if BEGIN in contents:
		# It's not the first time.
		contents = contents.split(BEGIN)[0] + os.linesep + contents.split(END)[1]
	else:
		# It is the first time! Proceed to do a backup.
		print('First time installing DiscordInjector, I see. Doing a backup...')
		shutil.copyfile(core_path, core_path+'.BAK')

	with open('DiscordInjector.js', 'r') as f:
		injection = f.read()

	contents += os.linesep
	contents += BEGIN + os.linesep
	contents += injection
	contents += END + os.linesep

	with open(preload_path, 'w') as f:
		f.write(contents)

	print('Injected. Repacking...')

	os.remove(core_path)
	os.system('asar pack _tmp_asar "%s"' % core_path)
	shutil.rmtree('_tmp_asar')

	print('\nPatched successfully! You can now open Discord.')
