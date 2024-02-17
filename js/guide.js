import { commandList } from './commands/command-list.js';

let html = '';
commandList.forEach(command => {
	html += `<h3>${command.name}</h3>\n`;
	html += command.description
		.trim()
		.split(/\s*\n\s*/)
		.map(line => `<p>${line}</p>`)
		.join('');
});

document.querySelector('#commands').innerHTML = html;
