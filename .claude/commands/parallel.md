---
description: Process tasks using parallel sub-agents for optimal performance
allowed-tools: Task, TodoWrite, Bash, Read, Edit, MultiEdit, Write, Glob, Grep, LS
---

# Parallel Task Processing Mode

You are now in parallel processing mode. For the current task:

1. **Analyze for Parallelization**: Break down the task into independent components that can be executed concurrently
2. **Use Multiple Agents**: Launch multiple Task tool invocations simultaneously to handle different parts of the work
3. **Coordinate Results**: Collect and integrate results from all parallel agents
4. **Optimize Performance**: Prioritize speed and efficiency through concurrent execution

## Key Instructions:
- Use the Task tool to spawn multiple agents working on different aspects simultaneously
- When possible, batch multiple tool calls in a single response for maximum parallelism
- Follow existing task optimization preferences from CLAUDE.md
- Use TodoWrite to track parallel workstreams and overall progress
- Coordinate agent outputs to provide a unified result

Execute $ARGUMENTS using this parallel approach.