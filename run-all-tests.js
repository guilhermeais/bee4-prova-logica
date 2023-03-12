import { exec } from 'child_process'
import { readFile } from 'fs/promises'
import { glob } from 'glob'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export class TestRunner {
  constructor() {
    this.run = this.run.bind(this)
  }

  async run() {
    const path = './**/*.spec.js'
    console.log(
        '🚀 ~ Running all testes ~',
    )

    console.log(
        '🚀 ~ path ~',
        path
    )
    
    const testFiles = await glob(path, { cwd: __dirname, platform: process.platform, absolute: true  })
    console.log(
        '🚀 ~ testFiles ~',
        testFiles
    )
    for (const testFile of testFiles) {
      exec(`node ${testFile}`, (error, stdout, stderr) => {
        console.log( stdout)
      })
    }
  }
}

new TestRunner().run()