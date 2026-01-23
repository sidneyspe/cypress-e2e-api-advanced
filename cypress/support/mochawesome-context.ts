// eslint-disable-next-line @typescript-eslint/no-require-imports
const addContext = require('mochawesome/addContext');

const titleToFileName = (title: string): string => title.replace(/[:/]/g, '');

Cypress.on('test:after:run', (test, runnable) => {
  if (test.state === 'failed') {
    let parent = runnable.parent;
    let filename = '';
    while (parent && parent.title) {
      filename = `${titleToFileName(parent.title)} -- ${filename}`;
      parent = parent.parent;
    }
    filename += `${titleToFileName(test.title)} (failed).png`;
    addContext({ test }, `./screenshots/${Cypress.spec.name}/${filename}`);
  }
  addContext({ test }, `./videos/${Cypress.spec.name}.mp4`);
});
