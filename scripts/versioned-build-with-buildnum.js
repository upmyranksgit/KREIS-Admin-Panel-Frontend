const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read package.json to get version
const packageJson = require('../package.json');
const version = packageJson.version;

// Get current timestamp
const now = new Date();
const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19).replace('T', '_');

// Generate build number from timestamp (YYYYMMDDHHMMSS format)
const buildNumber = now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);

// Create versioned build folder name
// Format: build-v1.0.0-20240113_143022-b20240113143022
const buildFolderName = `build-v${version}-${timestamp}-b${buildNumber}`;
const buildPath = path.join(__dirname, '..', buildFolderName);

console.log(`Building version ${version}...`);
console.log(`Build number: ${buildNumber}`);
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
    
    // Create a version.json file inside the build
    const versionInfo = {
      version: version,
      buildNumber: buildNumber,
      buildDate: now.toISOString(),
      buildFolder: buildFolderName
    };
    
    fs.writeFileSync(
      path.join(buildPath, 'version.json'),
      JSON.stringify(versionInfo, null, 2)
    );
    
    console.log(`\nBuild completed successfully!`);
    console.log(`Output: ${buildFolderName}`);
    console.log(`Version info saved to ${buildFolderName}/version.json`);
  }
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
