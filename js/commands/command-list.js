import gpCommand from './command-list/gp.js';
import radCommand from './command-list/rad.js';
import temperatureCommand from './command-list/temperature.js';
import pressureCommand from './command-list/pressure.js';
import zenCommand from './command-list/zen.js';
import hsCommand from './command-list/hs.js';
import azCommand from './command-list/az.js';
import formatCommand from './command-list/format.js';
import compareCommand from './command-list/compare.js';
import indexCommand from './command-list/index.js';
import unitCommand from './command-list/unit.js';
import dateCommand from './command-list/date.js';
import bodyCommand from './command-list/body.js';
import heightCommand from './command-list/height.js';
import methodCommand from './command-list/method.js';
import zoneCommand from './command-list/zone.js';

export const commandList = [
	dateCommand,
	zoneCommand,
	heightCommand,
	indexCommand,
	temperatureCommand,
	pressureCommand,
	gpCommand,
	bodyCommand,
	radCommand,
	zenCommand,
	hsCommand,
	azCommand,
	compareCommand,
	methodCommand,
	formatCommand,
	unitCommand,
];
