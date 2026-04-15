const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read package.json to get version
const packageJson = require('../package.json');
const version = packageJson.version;

// Get current timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];

// Create versioned build folder name
const buildFolderName = `build-v${version}-${timestamp}`;
const buildPath = path.join(__dirname, '..', buildFolderName);

console.log(`Building version ${version}...`);
console.log(`Output folder: ${buildFolderName}`);

// Run the build
try {
  execSync('react-scripts build', { stdio: 'inherit' });
  
  // Rename build folder to versioned name
  const defaultBuildPath = path.join(__dirname, '..', 'build');
  
  if (fs.existsSync(defaultBuildPath)) {
    // Remove existing versioned folder if it exists
    if (fs.existsSync(buildPath)) {
      fs.rmSync(buildPath, { recursive: true, force: true });
    }
    
    // Rename build to versioned folder
    fs.renameSync(defaultBuildPath, buildPath);
    
    console.log(`\nBuild completed successfully!`);
    console.log(`Output: ${buildFolderName}`);
  }
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
