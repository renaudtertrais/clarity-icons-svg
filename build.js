const fs = require('fs');

function toDist(old) {
  return old.replace(/^\.\/src\//, './dist/');
}

function walk(dir, fn) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = `${dir}/${file}`;
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      fs.mkdirSync(toDist(filePath));
      walk(filePath, fn);
    } else {
      fn(filePath);
    }
  });
}

function build(file) {
  const data = fs.readFileSync(file, 'utf8').toString();
  const newData = data
    .replace(/(<svg .*width=")(36)(".+height=")(36)/gm, '$11em$31em')
    .replace(/(class="[^"]+")/g, 'fill="currentColor"');

  const newFile = toDist(file).replace('-line.svg', '-outline.svg');
  console.log(`${file} -> ${newFile}`);
  fs.writeFileSync(newFile, newData, 'utf8');
}

console.log('Building icons...');
walk('./src', build);
console.log('Building done.');
