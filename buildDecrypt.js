import * as esbuild from 'esbuild'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const buildDecryptBundle = async () => {
  try {
    const decryptScriptPath = path.resolve(__dirname, 'src', 'decrypt.ts')
    await esbuild.build({
      entryPoints: [decryptScriptPath],
      bundle: true,
      outfile: path.resolve(__dirname, 'src/injectedScripts', 'decrypt-bundle.js'),
      platform: 'browser',
      format: 'iife',
      globalName: 'decryptScriptBundle',
      minify: true,
    })
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    console.log(`${currentTime}: Decrypt script bundled successfully to dist/decrypt-bundle.js`)
  } catch (error) {
    console.error('Error bundling decrypt script:', error)
    process.exit(1)
  }
}


buildDecryptBundle()