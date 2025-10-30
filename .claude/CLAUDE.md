# Project Guidelines for HAL

## Version Management

**CRITICAL**: When making ANY changes to this repository, you MUST:

1. **Update package.json version** following [Semantic Versioning](https://semver.org/):
   - MAJOR version for incompatible API changes
   - MINOR version for backwards-compatible functionality additions
   - PATCH version for backwards-compatible bug fixes

2. **Update CHANGELOG.md** with:
   - New version section at the top
   - Date in format: `## [X.Y.Z] - YYYY-MM-DD`
   - Changes grouped by type:
     - `### Added` for new features
     - `### Changed` for changes in existing functionality
     - `### Deprecated` for soon-to-be removed features
     - `### Removed` for removed features
     - `### Fixed` for bug fixes
     - `### Security` for vulnerability fixes

## Commit Workflow

Before creating commits or PRs:
1. Make your code changes
2. Update package.json version
3. Update CHANGELOG.md with details
4. Commit everything together
5. Create PR

## Example Changelog Entry

```markdown
## [1.0.2] - 2025-10-30

### Fixed
- Fixed bash parsing error in `check-env-keys` skill
- Added shell environment variable checking

### Added
- Support for checking variables in shell environment
```

## Plugin Structure

- `/commands/` - Slash commands (*.md files)
- `/skills/` - Skills (directories with SKILL.md)
- `/examples/` - Usage examples
- `.claude-plugin/` - Plugin metadata
- `package.json` - Version and dependencies
- `CHANGELOG.md` - Version history

## Never Forget

**DO NOT CREATE A PR WITHOUT UPDATING VERSION AND CHANGELOG!**
