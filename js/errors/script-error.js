export class ScriptError extends Error {
	constructor(message, lineIndex) {
		super(message);
		this.lineIndex = lineIndex;
	}
}
