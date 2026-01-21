/**
 * Extract unique tags from Cypress test files
 * Scans all test files and extracts distinct tag values
 */

const fs = require('fs');
const path = require('path');

const TEST_DIRS = ['cypress/e2e'];

function extractTagsFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Match tags object in describe block
    const tagsMatch = content.match(/tags:\s*\{([^}]+)\}/s);
    if (!tagsMatch) return null;

    const tagsContent = tagsMatch[1];
    const tags = {};

    // Extract each tag value
    const tagPatterns = [
      { key: 'squad', regex: /squad:\s*['"]([^'"]+)['"]/ },
      { key: 'executionType', regex: /executionType:\s*['"]([^'"]+)['"]/ },
      { key: 'product', regex: /product:\s*['"]([^'"]+)['"]/ },
      { key: 'module', regex: /module:\s*['"]([^'"]+)['"]/ },
      { key: 'functionality', regex: /functionality:\s*['"]([^'"]+)['"]/ },
    ];

    tagPatterns.forEach(({ key, regex }) => {
      const match = tagsContent.match(regex);
      if (match) {
        tags[key] = match[1];
      }
    });

    return Object.keys(tags).length > 0 ? tags : null;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

function scanDirectory(dir, allTags) {
  if (!fs.existsSync(dir)) return;

  const items = fs.readdirSync(dir, { withFileTypes: true });

  items.forEach((item) => {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      scanDirectory(fullPath, allTags);
    } else if (item.name.endsWith('.cy.js')) {
      const tags = extractTagsFromFile(fullPath);
      if (tags) {
        allTags.push({
          file: fullPath.replace(/\\/g, '/'),
          tags,
        });
      }
    }
  });
}

function extractDistinctTags() {
  const allTags = [];

  TEST_DIRS.forEach((dir) => {
    scanDirectory(dir, allTags);
  });

  // Extract distinct values for each tag type
  const distinct = {
    squads: [...new Set(allTags.map((t) => t.tags.squad).filter(Boolean))].sort(),
    executionTypes: [...new Set(allTags.map((t) => t.tags.executionType).filter(Boolean))].sort(),
    products: [...new Set(allTags.map((t) => t.tags.product).filter(Boolean))].sort(),
    modules: [...new Set(allTags.map((t) => t.tags.module).filter(Boolean))].sort(),
    functionalities: [...new Set(allTags.map((t) => t.tags.functionality).filter(Boolean))].sort(),
  };

  return {
    distinct,
    testTags: allTags,
    summary: {
      totalFiles: allTags.length,
      squads: distinct.squads.length,
      executionTypes: distinct.executionTypes.length,
      products: distinct.products.length,
      modules: distinct.modules.length,
      functionalities: distinct.functionalities.length,
    },
  };
}

// Export for use in report generator
module.exports = { extractDistinctTags, extractTagsFromFile };

// Run standalone
if (require.main === module) {
  const result = extractDistinctTags();
  console.log('\n📊 Tags extraídas dos testes Cypress:\n');
  console.log('Squads:', result.distinct.squads);
  console.log('Tipos de Execução:', result.distinct.executionTypes);
  console.log('Produtos:', result.distinct.products);
  console.log('Módulos:', result.distinct.modules);
  console.log('Funcionalidades:', result.distinct.functionalities);
  console.log('\nResumo:', result.summary);
}
