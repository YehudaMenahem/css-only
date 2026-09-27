import { copyFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const cssFiles = [
  { src: 'src/Modal/Modal.css', dest: 'dist/Modal.css' },
]

cssFiles.forEach(({ src, dest }) => {
  const srcPath = resolve(root, src)
  const destPath = resolve(root, dest)
  if (existsSync(srcPath)) {
    copyFileSync(srcPath, destPath)
    console.log(`✓ Copied ${src} → ${dest}`)
  }
})
