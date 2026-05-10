const fs = require('fs');
const path = require('path');

const srcDir = './src';
const distDir = './dist';

function copyFile(src, dest) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${src} -> ${dest}`);
}

function createDistDir() {
    if (fs.existsSync(distDir)) {
        fs.rmSync(distDir, { recursive: true });
    }
    fs.mkdirSync(distDir, { recursive: true });
}

function build() {
    createDistDir();
    
    copyFile('./index.html', './dist/index.html');
    copyFile('./public/favicon.svg', './dist/favicon.svg');
    
    const srcFiles = fs.readdirSync(srcDir, { recursive: true });
    srcFiles.forEach(file => {
        const srcPath = path.join(srcDir, file);
        if (fs.statSync(srcPath).isFile()) {
            const destPath = path.join(distDir, file);
            copyFile(srcPath, destPath);
        }
    });
    
    console.log('Build completed successfully!');
}

build();
