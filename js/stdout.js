const textarea = document.querySelector('.logs textarea');

export const write = (...args) => {
	textarea.value += args.join('');
};

export const writeln = (...args) => {
	write(...args, '\n');
};

export const clear = () => {
	textarea.value = '';
};
