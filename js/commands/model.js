import { ExecutionContext } from '../script/execution-context.js';

export class Command {
	constructor({
		name = '',
		regex = /./,
		description = '',
		run = async (ctx = new ExecutionContext(), line = '', lineIndex = 0) => {},
	}) {
		this.name = name;
		this.regex = regex;
		this.description = description;
		this.run = run;
	}
}
