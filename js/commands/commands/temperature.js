import { ScriptError } from '../../errors/script-error.js';
import { ExecutionContext } from '../../execution-context.js';
import { parseToCelsius } from '../../parse-temperature.js';
import { Command } from '../model.js';

const regex = /^\s*temperature:/i;

const temperatureCommand = new Command({
	name: 'Temperature',
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
