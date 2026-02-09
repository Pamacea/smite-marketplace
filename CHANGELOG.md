# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Additional quality gate validations
- Enhanced team coordination features
- Performance analytics dashboard

## [1.5.1] - 2026-02-09

### Added
- Complete core implementation
- Git workflow integration
- Enhanced error handling

## [1.5.0] - 2026-02-08

### Breaking Changes
- **4-Flag System**: Unified 10+ implementation modes into 4 composable flags
  - `--quick` → `--speed` (alias supported)
  - `--epct` → `--scale` (alias supported)
  - `--predator` → `--quality` (alias supported)
  - `--ralph` → `--team` (alias supported)
  - `--builder` → `--scale --tech=*` (alias supported)
- All old commands still work with deprecation notices

### Added
- **Auto-Detection**: Zero-configuration implementation
  - Analyzes task and automatically selects appropriate flags
  - Smart default for beginners
- **4 Composable Flags**
  - `--speed`: Fast, surgical fixes
  - `--scale`: Comprehensive workflow (EPCT)
  - `--quality`: Quality gates enabled
  - `--team`: Parallel agent teams
- **Flag Combinations**: 15+ possible combinations (vs 5 modes before)
- **Claude Code Agent Teams**: Native integration (no longer Ralph-only)
- **Unified Architecture**:
  - `/studio build` - Single entry point for all implementations
  - `/studio refactor` - Unified refactoring
  - `/studio explore` - Semantic code search with grepai
- **Migration Guide**: Complete v3.5 to v4.0 documentation

### Changed
- Simplified from 10+ mutually exclusive modes to 4 composable flags
- Improved UX with clearer intent naming
- Better learning curve
- Enhanced flexibility with flag combinations

### Documentation
- Complete 4-flag system documentation
- Auto-detection examples
- Team integration guide
- Comparison table (v3.5 vs v4.0)

## [1.4.0] - 2025-12-15

### Added
- Ralph parallel orchestration
- Multi-agent coordination
- PRD-based workflow

### Changed
- Improved parallel execution performance (40-50% faster on medium projects)
- Enhanced task dependency graph

## [1.3.0] - 2025-11-20

### Added
- Specialized agents (Architect, Builder)
- Feature-specific workflows
- Tech stack detection

## [1.2.0] - 2025-10-25

### Added
- Basics plugin (Commit, Note, Explore)
- Debug skill
- Oneshot ultra-fast implementation

## [1.1.0] - 2025-09-30

### Added
- EPCT systematic workflow
- Core infrastructure
- Template system

## [1.0.0] - 2025-08-15

### Added
- Initial SMITE release
- Plugin marketplace integration
- Core infrastructure

## [0.9.0] - 2025-07-20

### Added
- Alpha release
- Basic orchestration
- First skills implementation

## [0.1.0] - 2025-01-10

### Added
- Initial project structure
- Proof of concept

[Unreleased]: https://github.com/Pamacea/smite/compare/v1.5.1...HEAD
[1.5.1]: https://github.com/Pamacea/smile/releases/tag/v1.5.1
[1.5.0]: https://github.com/Pamacea/smite/releases/tag/v1.5.0
[1.4.0]: https://github.com/Pamacea/smite/releases/tag/v1.4.0
[1.3.0]: https://github.com/Pamacea/smite/releases/tag/v1.3.0
[1.2.0]: https://github.com/Pamacea/smite/releases/tag/v1.2.0
[1.1.0]: https://github.com/Pamacea/smite/releases/tag/v1.1.0
[1.0.0]: https://github.com/Pamacea/smite/releases/tag/v1.0.0
[0.9.0]: https://github.com/Pamacea/smite/releases/tag/v0.9.0
[0.1.0]: https://github.com/Pamacea/smite/releases/tag/v0.1.0
