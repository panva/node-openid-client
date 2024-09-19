for file in docs/**/*.md; do
    pandoc -i "$file" -t json | jq -a '.blocks[] | select(.t == "CodeBlock" and .c[0][1][0] == "ts") | .c[1]' | jq -s > "${file%.*}.tmp"
    node -e "
const fs = require('node:fs');
const filepath = '${file%.*}.tmp';
const lines = JSON.parse(fs.readFileSync(filepath, 'ascii'))

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  fs.writeFileSync(filepath.replace('.tmp', \`.\${i}.ts\`), \`import * as client from 'openid-client'\n\n\${line}\`)
}
"
    rm "${file%.*}.tmp"
done

npx tsc -p tsconfig.docs.json

rm docs/**/*.ts
