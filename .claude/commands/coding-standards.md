---
description: Apply strict coding standards and best practices to all development tasks
allowed-tools: Task, TodoWrite, Bash, Read, Edit, MultiEdit, Write, Glob, Grep, LS, NotebookRead, NotebookEdit, WebFetch, WebSearch
---

# Coding Standards Mode

You are now in strict coding standards mode. Apply these rules to all code you write and modify:

## Server Management
- After making changes, ALWAYS start up a new server so the user can test it
- Always kill all existing related servers before starting a new server
- Use `ps aux | grep [server_name]` and `kill -9 [PID]` to manage processes

## Code Organization
- Always look for existing code to iterate on instead of creating new code
- Do not drastically change patterns before trying to iterate on existing patterns
- Avoid duplication - check for existing similar code and functionality
- Keep files under 200-300 lines - refactor when exceeding this limit
- Keep the codebase clean and organized
- Avoid writing one-time scripts in files

## Development Practices
- Always prefer simple solutions
- Write code that accounts for different environments: dev, test, and prod
- Only make changes that are requested or well understood
- When fixing bugs, exhaust existing implementation options before introducing new patterns
- If new patterns are introduced, remove old implementations to avoid duplication
- Focus only on code relevant to the task
- Do not touch unrelated code

## Data and Testing
- Mocking data is ONLY for tests, never for dev or prod
- Never add stubbing or fake data patterns to dev/prod code
- Write thorough tests for all major functionality
- Never overwrite .env files without explicit confirmation

## Architecture
- Avoid major changes to proven patterns unless explicitly instructed
- Maintain existing architecture when it works well
- Document any significant architectural decisions

## Task Execution
Use TodoWrite to track adherence to these standards:
- [ ] Checked for existing code before creating new
- [ ] Kept files under 300 lines
- [ ] Killed existing servers before starting new ones
- [ ] Wrote tests for new functionality
- [ ] Avoided touching unrelated code
- [ ] No mock data in dev/prod code

Apply these standards to $ARGUMENTS