import { ExecutionContext } from '../execution-context.js';

export class Command {
	constructor({
		name = '',
		description = '',
		regex = /./,
		run = async (ctx = new ExecutionContext(), line = '', lineIndex = 0) => {},
	}) {
		this.name = name;
		this.description = description;
		this.regex = regex;
		this.run = run;
	}
}
