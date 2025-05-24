const fs = require('fs');
const filePath = 'node_modules/@nestjs/typeorm/dist/common/typeorm.utils.js';
const content = fs.readFileSync(filePath, 'utf8');
const updatedContent = content.replace(
  'const generateString = () => crypto.randomUUID();',
  'const generateString = () => require(\'crypto\').randomUUID();'
);
fs.writeFileSync(filePath, updatedContent);