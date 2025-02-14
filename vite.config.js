import { exec } from 'child_process'
import path from 'path'

export function runCommandOnFileChangePlugin(command, filesToWatch = []) {
  const rootDir = process.cwd()
  const resolvedFilesToWatch = filesToWatch.map(file => path.resolve(rootDir, file))

  return {
    name: 'run-command-on-file-change',

    handleHotUpdate({ file }) {
      const resolvedFilePath = path.resolve(file)
      const shouldTriggerCommand = resolvedFilesToWatch.includes(resolvedFilePath)

      if (shouldTriggerCommand) {
        console.log(`File changed: ${file}. Running command: npm run ${command}`)

        exec(`npm run ${command}`, (err, stdout, stderr) => {
          if (err) {
            console.error(`Error executing command: ${err.message}`)
            return
          }

          if (stderr) {
            console.error(`Command stderr: ${stderr}`)
          }

          console.log(`Command stdout: ${stdout}`)
        })
      }
    },
  }
}

export default {
  plugins: [
    runCommandOnFileChangePlugin('buildDecrypt',[
      'src/templates/decryptTemplate.html',
      'src/decrypt.ts'
    ])
  ]
}