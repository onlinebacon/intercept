import { ExecutionContext } from '../script/execution-context.js';

export class Command {
	constructor({
		name = '',
		regex = /./,
		run = async (ctx = new ExecutionContext(), line = '', lineIndex = 0) => {},
	}) {
		this.name = name;
		this.regex = regex;
		this.run = run;
	}
}
