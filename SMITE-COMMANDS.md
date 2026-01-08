# SMITE Plugins - Quick Commands

## 🗑️ Uninstall All SMITE Plugins

Copy and paste these commands one by one in Claude Code:

```bash
/plugin uninstall smite-initializer
/plugin uninstall smite-analyst
/plugin uninstall smite-architect
/plugin uninstall smite-economist
/plugin uninstall smite-aura
/plugin uninstall smite-constructor
/plugin uninstall smite-gatekeeper
/plugin uninstall smite-handover
/plugin uninstall smite-surgeon
/plugin uninstall smite-orchestrator
```

## 🚀 Install All SMITE Plugins

### Step 1: Add Marketplace

```bash
/plugin marketplace add Pamacea/smite-marketplace
```

### Step 2: Install All Agents (in order)

```bash
/plugin install smite-initializer@smite-marketplace
/plugin install smite-analyst@smite-marketplace
/plugin install smite-architect@smite-marketplace
/plugin install smite-economist@smite-marketplace
/plugin install smite-aura@smite-marketplace
/plugin install smite-constructor@smite-marketplace
/plugin install smite-gatekeeper@smite-marketplace
/plugin install smite-handover@smite-marketplace
/plugin install smite-surgeon@smite-marketplace
/plugin install smite-orchestrator@smite-marketplace
```

## ✅ Verify Installation

```bash
/plugin list
```

## 🔄 Reinstall Single Plugin

If you need to reinstall a specific plugin:

```bash
/plugin uninstall smite-orchestrator
/plugin install smite-orchestrator@smite-marketplace
```

## 📖 Quick Start

After installation, start using SMITE:

```bash
/smite:init
```

The auto-orchestration will guide you through the workflow!

---

**Note**: These scripts are helpers. The actual `/plugin` commands must be run in Claude Code, not in a terminal.
