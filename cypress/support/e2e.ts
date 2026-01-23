import 'cypress-localstorage-commands';
import './commands';
import './mochawesome-context';

// Cypress Grep - filtro por tags
// eslint-disable-next-line @typescript-eslint/no-require-imports
const registerCypressGrep = require('@cypress/grep/src/support');
registerCypressGrep();

// Data config
export const testData = {
  initialTerm: 'React',
  newTerm: 'Cypress',
};
