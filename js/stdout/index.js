const textarea = document.querySelector('.logs textarea');

export const writeln = (...args) => {
	textarea.value += args.join('') + '\n';
};

export const write = (...args) => {
	textarea.value += args.join('');
};

export const clear = () => {
	textarea.value = '';
};
