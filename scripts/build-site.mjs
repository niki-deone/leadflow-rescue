// scripts/build-site.mjs
// Assembles the deployable site folder for Vercel:
//   site/index.html   <- case.html (the portfolio one-pager)
//   site/case-assets/ <- before/after screenshots
//   site/demo/        <- built app (vite output from dist/)
import { cpSync, mkdirSync, copyFileSync, rmSync } from 'node:fs'

rmSync('site', { recursive: true, force: true })
mkdirSync('site/demo', { recursive: true })
cpSync('dist', 'site/demo', { recursive: true })
copyFileSync('case.html', 'site/index.html')
cpSync('case-assets', 'site/case-assets', { recursive: true })
// The broken "before" build is committed as-is (an exhibit, not a artifact to rebuild:
// its source lives in the first commit and needs the old bloated deps)
cpSync('dist-before', 'site/demo-before', { recursive: true })
console.log('site/ assembled: index.html + case-assets + demo')
