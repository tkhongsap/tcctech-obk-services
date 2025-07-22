---
description: Execute tasks from a task list systematically with proper completion protocols
allowed-tools: Task, TodoWrite, Bash, Read, Edit, MultiEdit, Write, Glob, Grep, LS, NotebookRead, NotebookEdit, WebFetch, WebSearch
---

# Task Processing Mode

You are now in task processing mode. Follow these strict protocols to execute tasks from a task list.

## Execution Strategy

### Core Principles
- **One sub-task at a time**: Complete current sub-task before starting the next
- **Parallel execution**: Use Task tool with multiple agents when possible to speed up work
- **Immediate updates**: Mark tasks complete as soon as they're done
- **Stop and wait**: Pause after each sub-task for user approval

## Completion Protocol

### For Sub-Tasks:
1. Implement the sub-task completely
2. Mark it as completed by changing `[ ]` to `[x]`
3. Update the task list file immediately
4. Stop and wait for user go-ahead

### For Parent Tasks (when ALL sub-tasks are complete):
1. **Run full test suite** (pytest, npm test, bin/rails test, etc.)
2. **Only if tests pass**:
   - Stage changes: `git add .`
   - Remove temporary files/code
   - Commit with descriptive message:
   ```bash
   git commit -m "feat: [what was accomplished]" \
             -m "- [key change 1]" \
             -m "- [key change 2]" \
             -m "Related to [task number] in PRD"
   ```
3. Mark parent task as `[x]`
4. Update the task list file

## Task List Maintenance

### During Implementation:
1. **Update task status**: Mark `[x]` when complete
2. **Add emerging tasks**: Insert new tasks as discovered
3. **Track files**: Update "Relevant Files" section with:
   - Every created/modified file
   - One-line purpose description

### File Updates:
- Update task list file after EVERY significant work
- Keep "Relevant Files" section current
- Add newly discovered tasks immediately

## Workflow Steps

1. **Check current status**: Read task list to find next incomplete sub-task
2. **Implement sub-task**: Use appropriate tools, leverage parallel agents
3. **Test changes**: Ensure functionality works as expected
4. **Update task list**: Mark sub-task complete, update files
5. **Wait for approval**: Stop and await user go-ahead
6. **Repeat**: Continue with next sub-task

## Commit Message Format

Use conventional commits with multi-line descriptions:
- feat: new feature
- fix: bug fix
- refactor: code restructuring
- test: adding tests
- docs: documentation updates

## Important Notes
- Use TodoWrite tool to track your own progress within each sub-task
- Leverage Task tool for parallel operations when possible
- Always clean up temporary code before committing
- Maintain clear documentation of what was accomplished

Process tasks from: $ARGUMENTS