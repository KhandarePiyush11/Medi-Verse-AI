import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Find monorepo directory (supports both root or subfolder Medi-Verse-AI-main)
const baseDir = fs.existsSync(path.join(rootDir, 'apps'))
  ? rootDir
  : path.join(rootDir, 'Medi-Verse-AI-main');

const appsDir = path.join(baseDir, 'apps');
const outputDist = path.join(rootDir, 'dist');

console.log('🏥 [MediVerse AI Deployment Builder]');
console.log(`📂 Root Directory: ${rootDir}`);
console.log(`📂 Base Directory: ${baseDir}`);
console.log(`🎯 Output Directory: ${outputDist}`);

function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  fs.readdirSync(from).forEach((element) => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    if (fs.lstatSync(fromPath).isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  });
}

function buildApp(appName, destSubDir) {
  const appPath = path.join(appsDir, appName);
  if (!fs.existsSync(appPath)) {
    console.warn(`⚠️ Warning: App ${appName} not found at ${appPath}`);
    return;
  }
  console.log(`\n🚀 Building ${appName}...`);
  
  // Install dependencies in app if node_modules doesn't exist
  if (!fs.existsSync(path.join(appPath, 'node_modules')) && !fs.existsSync(path.join(baseDir, 'node_modules'))) {
    console.log(`📦 Installing dependencies for ${appName}...`);
    execSync('npm install', { cwd: appPath, stdio: 'inherit' });
  }

  // Build app
  execSync('npm run build', { cwd: appPath, stdio: 'inherit' });

  const appDist = path.join(appPath, 'dist');
  if (fs.existsSync(appDist)) {
    const targetDest = destSubDir ? path.join(outputDist, destSubDir) : outputDist;
    console.log(`📋 Copying ${appName} dist to ${targetDest}...`);
    copyFolderSync(appDist, targetDest);
  } else {
    console.error(`❌ Error: dist folder not found for ${appName}`);
  }
}

// Ensure clean dist directory
if (fs.existsSync(outputDist)) {
  fs.rmSync(outputDist, { recursive: true, force: true });
}
fs.mkdirSync(outputDist, { recursive: true });

// 1. Build Main Home Portal (Root /)
buildApp('web-home', '');

// 2. Build Hospital Clinical Platform (/hospital)
buildApp('web-hospital', 'hospital');

// 3. Build Manager AI Operations OS (/manager)
buildApp('manager-ai', 'manager');

// 4. Build Emergency SOS Platform (/emergency)
buildApp('emergency-os', 'emergency');

console.log('\n✨ [MediVerse AI Deployment Complete]');
console.log(`✅ All portals built successfully into: ${outputDist}`);
