import { ScriptError } from '../../errors/script-error.js';
import { ExecutionContext } from '../../script/execution-context.js';
import { parseToCelsius } from '../../parsers/parse-temperature.js';
import { Command } from '../model.js';

const regex = /^\s*temperature:/i;
const temperatureCommand = new Command({
	name: 'Temperature',
	description: `
		Sets the tempreature that will be considered for the refraction corrections. The default value is 10° C.
		It requires the suffix with the unit.
	`,
	regex,
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		const tempC = parseToCelsius(line.replace(regex, ''));
		if (isNaN(tempC)) {
			throw new ScriptError('Invalid temperature value', lineIndex);
		}
		ctx.tempCelsius = tempC;
	},
});

export default temperatureCommand;
