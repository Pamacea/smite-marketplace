# SMITE Skill Marketplace

Discover, install, and manage community-contributed skills for SMITE.

## What is the Marketplace?

The marketplace is a centralized hub for:
- **Community skills**: Patterns and workflows shared by other developers
- **Official skills**: Curated skills from the SMITE team
- **Easy installation**: One-command installation
- **Version management**: Keep skills up to date
- **Dependency resolution**: Automatically install dependencies

## Usage

### Search for Skills

```bash
# Search by keyword
/studio marketplace search "rust"

# Search by category
/studio marketplace search --category "testing"

# Search by tags
/studio marketplace search --tags "async", "performance"

# Limit results
/studio marketplace search "database" --limit 10
```

### Install a Skill

```bash
# Install latest version
/studio marketplace install official rust-async-patterns

# Install specific version
/studio marketplace install community nextjs-forms --version 2.1.0

# Install with dependencies
/studio marketplace install official fullstack-auth
```

### List Installed Skills

```bash
# List all installed skills
/studio marketplace list

# Get skill details
/studio marketplace info rust-async-patterns
```

### Update Skills

```bash
# Update a specific skill
/studio marketplace update rust-async-patterns

# Update all installed skills
/studio marketplace update-all
```

### Uninstall a Skill

```bash
/studio marketplace uninstall rust-async-patterns
```

### Manage Sources

```bash
# Add a new source
/studio marketplace add-source \
  --name "my-company" \
  --url "https://github.com/my-company/smite-skills"

# Remove a source
/studio marketplace remove-source "my-company"

# List sources
/studio marketplace list-sources
```

## Skill Sources

### Official Source
- **Name**: `official`
- **URL**: https://github.com/yanis-smite/smite-skills
- **Content**: Curated skills from SMITE team
- **Quality**: High (tested and documented)

### Community Source
- **Name**: `community`
- **URL**: https://github.com/smite-community/skills
- **Content**: Community-contributed skills
- **Quality**: Variable (community-rated)

## Creating Your Own Skill

### 1. Create Skill Structure

```
my-skill/
├── SKILL.md          # Main skill file
├── scripts/          # Optional scripts
│   └── setup.sh
└── MANIFEST.json     # Skill metadata
```

### 2. Define Manifest

```json
{
  "name": "my-skill",
  "version": "1.0.0",
  "description": "My awesome skill",
  "author": "Your Name",
  "repository": "https://github.com/username/smite-skills",
  "tags": ["productivity", "automation"],
  "category": "workflow",
  "dependencies": [],
  "smite_version": ">=1.6.0",
  "skills": [
    {
      "name": "my-skill",
      "file": "SKILL.md",
      "description": "Main skill file"
    }
  ]
}
```

### 3. Write Skill Content

Follow the skill template:
- Clear description
- Usage instructions
- Examples
- Quality checklist

### 4. Publish to Marketplace

```bash
# Fork https://github.com/smite-community/skills
# Add your skill
# Submit pull request
```

## Best Practices

### For Skill Authors

- **Test thoroughly**: Ensure skill works as advertised
- **Document clearly**: Usage instructions, examples
- **Version properly**: Use semantic versioning
- **Specify dependencies**: List required skills/tools
- **Tag appropriately**: Help users discover your skill

### For Skill Users

- **Check compatibility**: Verify SMITE version
- **Read documentation**: Understand what skill does
- **Test in safe environment**: Don't use on production first
- **Provide feedback**: Report issues to authors
- **Contribute back**: Share improvements

## Marketplace Quality

### Skill Ratings

Skills are rated on:
- ⭐ **Documentation**: Clear instructions
- ⭐ **Functionality**: Works as advertised
- ⭐ **Code Quality**: Clean, maintainable
- ⭐ **Testing**: Includes tests/examples
- ⭐ **Support**: Author responds to issues

### Verified Skills

Official skills are marked with ✅ and:
- Tested by SMITE team
- Meet quality standards
- Maintained and updated
- Have comprehensive documentation

## Security

### Safety Measures

- **Code review**: Official skills are reviewed
- **Sandboxing**: Skills run in restricted environment
- **Checksums**: Verify skill integrity
- **Permissions**: Skills declare required permissions

### Best Practices

- Only install from trusted sources
- Review skill code before installation
- Keep skills updated
- Report suspicious skills

## Troubleshooting

### Installation Fails

```bash
# Check SMITE version
/studio --version

# Verify dependencies
/studio marketplace info skill-name

# Reinstall
/studio marketplace uninstall skill-name
/studio marketplace install source skill-name
```

### Skill Not Working

```bash
# Check logs
tail -f ~/.claude/logs/marketplace.log

# Verify installation
/studio marketplace list

# Reinstall latest
/studio marketplace update skill-name
```

## Contributing

We welcome contributions!

- **Submit skills**: Add your skills to community repo
- **Report issues**: Found a bug? Let us know
- **Suggest features**: Have ideas? Share them
- **Improve docs**: Documentation can always be better

## Resources

- **Documentation**: https://smite.dev/docs/marketplace
- **GitHub**: https://github.com/smite-community/skills
- **Discord**: https://discord.gg/smite
- **Twitter**: @smite_dev

---

*Version: 1.0.0 | Last updated: 2026-02-19*
