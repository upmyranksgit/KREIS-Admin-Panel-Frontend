# Build Versioning

This project supports versioned build folders to help track different builds.

## Available Build Commands

### 1. `npm run build` (Default - with date)
Creates a build folder with version and date:
- Format: `build-v1.0.0-2024-01-13`
- Example: `build-v1.0.0-2024-01-13`

### 2. `npm run build:simple`
Creates a build folder with just the version:
- Format: `build-v1.0.0`
- Example: `build-v1.0.0`
- Note: This will overwrite previous builds with the same version

### 3. `npm run build:detailed`
Creates a build folder with version, timestamp, and build number:
- Format: `build-v1.0.0-2024-01-13_14-30-22-b20240113143022`
- Example: `build-v1.0.0-2024-01-13_14-30-22-b20240113143022`
- Also creates a `version.json` file inside the build with metadata

### 4. `npm run build:default`
Creates the standard `build` folder (no versioning)

## Version Management

The version is read from `package.json`. To update the version:

```bash
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

Then run your preferred build command.

## Examples

```bash
# Update version and build
npm version patch
npm run build

# Build with simple versioning
npm run build:simple

# Build with detailed versioning
npm run build:detailed
```

## Build Output

All versioned builds will be created in the project root directory alongside the standard `build` folder.

Example directory structure:
```
project-root/
├── build-v1.0.0-2024-01-13/
├── build-v1.0.1-2024-01-14/
├── build-v1.1.0-2024-01-15/
├── src/
├── public/
└── package.json
```
