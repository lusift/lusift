const fs = require('fs');
const sitemap = require('nextjs-sitemap-generator');

// This is needed for the plugin to work
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BUILD_ID = fs.readFileSync('.next/BUILD_ID').toString();

sitemap({
  baseUrl: 'https://lusift.github.io/lusift',
  pagesDirectory: process.cwd() + '/.next/server/pages',
  targetDirectory: 'public/',
  ignoredExtensions: ['js', 'map'],
  ignoredPaths: ['/404',],
});
