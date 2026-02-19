---
name: analytics
description: Display agent performance analytics and insights. Use for understanding agent performance, costs, and optimization opportunities.
---

# Analytics Command

## Usage

```bash
/studio analytics [options]
```

## Options

- `--days <n>`: Specify number of days to analyze (default: 30)
- `--agent <name>`: Show stats for specific agent
- `--model`: Show model usage breakdown
- `--cost`: Show cost analysis
- `--report`: Generate full report
- `--recommendations`: Show optimization recommendations
- `--html`: Generate HTML dashboard

## Examples

### Quick Overview
```bash
/studio analytics
```

Shows:
- Top 5 agents by usage
- Total cost (last 30 days)
- Success rates
- Performance insights

### Specific Agent
```bash
/studio analytics --agent rust-agent
```

Shows detailed stats for rust-agent:
- Tasks completed
- Average duration
- Success rate
- Quality score
- Common patterns

### Cost Analysis
```bash
/studio analytics --cost --days 7
```

Shows cost breakdown for last 7 days:
- Total cost
- Daily average
- By model
- By agent
- Cost trend

### Full Report
```bash
/studio analytics --report --days 90
```

Generates comprehensive markdown report with:
- Cost analysis
- Performance metrics
- Model usage
- Agent rankings
- Recommendations

### HTML Dashboard
```bash
/studio analytics --html
```

Generates interactive HTML dashboard at:
`.claude/reports/dashboard-<date>.html`

## Output Format

### Terminal Output
```
📊 Agent Analytics (Last 30 Days)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 Top Agents
  1. rust-agent          127 tasks  94% success  8.3s avg  8.7/10 quality
  2. nextjs-agent         89 tasks  91% success  7.1s avg  8.3/10 quality
  3. prisma-agent         56 tasks  98% success  5.2s avg  9.1/10 quality

💰 Cost Analysis
  Total Cost:      $12.45
  Daily Average:  $0.42
  Trend:          📉 decreasing (9% vs last period)

  Model Usage:
    • haiku-4-5:    234 uses  $1.23  (45%)
    • sonnet-4-5:   189 uses  $8.67  (40%)
    • opus-4-6:      45 uses  $2.55  (15%)

⚡ Performance Insights
  Fastest:     prisma-agent (5.2s)
  Slowest:     rust-agent (8.3s)
  Best Quality: prisma-agent (9.1/10)
  Most Reliable: prisma-agent (98%)

💡 Recommendations
  ✓ Consider using Haiku for more discovery tasks
  ✓ nextjs-agent has low quality on forms (7.2/10)
  • Great cost efficiency! 23% decrease vs last month
```

### Markdown Report
```markdown
# 📊 Agent Analytics Report

**Period:** Last 30 days
**Generated:** 2026-02-19

[Full report content...]
```

### HTML Dashboard
Interactive dashboard with:
- Charts and graphs
- Filterable tables
- Trend visualization
- Export options

## Metrics Tracked

### Performance Metrics
- **Task completion time**: Average duration per agent
- **Success rate**: Percentage of successful tasks
- **Quality score**: 1-10 rating (when provided)
- **Error rate**: Frequency of failures

### Cost Metrics
- **Total cost**: USD spent across all agents
- **Per-model cost**: Breakdown by model used
- **Per-agent cost**: Cost per agent
- **Cost trend**: Increasing/decreasing/stable

### Usage Metrics
- **Tasks completed**: Total tasks per agent
- **Model usage**: How often each model is used
- **Token consumption**: Input/output/total tokens
- **Common patterns**: Frequent task types

## Recommendations Engine

The analytics system automatically generates recommendations based on:

### Cost Optimization
- Use Haiku more for discovery tasks
- Identify expensive agents with low success rates
- Suggest model routing changes

### Performance Optimization
- Flag slow agents
- Identify quality issues
- Suggest pattern improvements

### Reliability Optimization
- Highlight low success rates
- Identify error patterns
- Suggest agent reconfiguration

## Alerting

Configure alerts in `.claude/telemetry-config.json`:

```json
{
  "alerts": {
    "enabled": true,
    "cost_threshold": 10.0,
    "success_rate_threshold": 0.85,
    "quality_score_threshold": 7.0
  }
}
```

Alerts trigger when:
- Cost exceeds threshold (per period)
- Success rate below threshold
- Quality score below threshold

## Data Storage

Events stored in: `.claude/telemetry/events-YYYY-MM-DD.json`

Retention: 30 days (configurable)

Cleanup: Automatic, runs daily

## Privacy

No data is sent externally. All analytics are local.

Option to anonymize data:
```json
{
  "anonymize_data": true
}
```

## Integration

Works with:
- **Model Routing**: Analytics inform routing decisions
- **Agent Teams**: Track team performance
- **Progressive Build**: Track phase-by-phase metrics
- **Multi-Review**: Track reviewer performance

## Export Options

### JSON Format
```bash
/studio analytics --report --format=json > analytics.json
```

### CSV Format
```bash
/studio analytics --report --format=csv > analytics.csv
```

### Integration with BI Tools
Export to CSV for import into:
- Excel/Google Sheets
- Tableau
- Power BI
- Custom dashboards

## Best Practices

1. **Review Weekly**: Check analytics every week
2. **Set Alerts**: Configure thresholds for your budget
3. **Track Trends**: Look for patterns over time
4. **Act on Insights**: Implement recommendations
5. **Clean Data**: Regular cleanup maintains performance

## Troubleshooting

### No Data Available
- Run some agent tasks first
- Check telemetry is enabled
- Verify storage path permissions

### Incorrect Cost Calculations
- Ensure API key pricing is correct
- Check token counting is accurate
- Verify model pricing data

### Performance Issues
- Reduce retention period
- Clean up old events manually
- Disable less important metrics

---

*Version: 1.0.0 | Last updated: 2026-02-19*
