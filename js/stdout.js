const textarea = document.querySelector('.logs textarea');

let lastLineBlank = true;

export const write = (...args) => {
	textarea.value += args.join('');
	lastLineBlank = false;
};

export const writeln = (...args) => {
	textarea.value += args.join('') + '\n';
	lastLineBlank = false;
};

export const clear = () => {
	textarea.value = '';
	lastLineBlank = true;
};

export const blankLine = () => {
	if (lastLineBlank === false) {
		textarea.value += '\n';
		lastLineBlank = true;
	}
};
