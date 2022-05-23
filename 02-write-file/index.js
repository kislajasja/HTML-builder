const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output });
const ws = fs.createWriteStream(path.join(__dirname, 'text.txt'), {
  flags: 'a'
});

// const onError = (err) => {
//   console.log(`Sorry, ${err?.message}`);
//   rl.close();
// };

rl.write('Hello. What do you want to save in text file?\n');

rl.on('line', (text) => {
  if (text.toLowerCase() === 'exit') {
    rl.close();
  } else {
    ws.write(`${text}\n`);
  }
});

// ws.on('error', onError);
rl.on('close', () => {
  console.log('Thank you. Bye');
  ws.end();
});
