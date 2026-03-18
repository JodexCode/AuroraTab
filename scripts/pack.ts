// scripts/pack.ts
import process from 'node:process'
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { version } from '../package.json'

const outDir = './out'
if (!existsSync(outDir)) {
  mkdirSync(outDir)
}

const baseName = `aurora-tab-v${version}`

/* eslint-disable no-console */
console.log(`📦 Starting to pack ${baseName}...`)

try {
  // 1. Pack ZIP
  execSync(`jszip-cli add extension/* -o ${outDir}/${baseName}.zip`, {
    stdio: 'inherit',
  })

  // 2. Pack CRX
  execSync(`crx pack extension -o ${outDir}/${baseName}.crx`, {
    stdio: 'inherit',
  })

  // 3. Pack XPI (Firefox)
  execSync(
    `web-ext build --source-dir ./extension --artifacts-dir ${outDir} --filename ${baseName}.xpi --overwrite-dest`,
    { stdio: 'inherit' },
  )

  console.log('\n✅ All packages are ready in ./out/')
}
catch (err) {
  console.error('❌ Packing failed:', err)
  process.exit(1)
}
