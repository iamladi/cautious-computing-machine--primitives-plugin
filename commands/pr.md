---
description: Prepare Github PR
---

# Create Pull Request

Based on the `Instructions` below, take the `Variables` follow the `Run` section to create a pull request. Then follow the `Report` section to report the results of your work.

## Variables

issue: $1
plan_file: $2

## Instructions

- Generate a pull request title in the format: `<issue_type>: #<issue_number> - <issue_title>`
  - Extract issue number, type, and title from the issue JSON
    - Use `gh issue view <issue_number> --json number,title,body` to fetch issue details
  - Examples of PR titles:
    - `feat: #123 - Add user authentication`
    - `bug: #456 - Fix login validation error`
    - `chore: #789 - Update dependencies`
- The PR body should include:
  - A summary section with the issue context
  - Link to the implementation plan file
  - Reference to the issue (Closes #<issue_number>)
  - A checklist of what was done
  - A summary of key changes made

## Run

1. Run `git diff origin/main...HEAD --stat` to see a summary of changed files
2. Run `git log origin/main..HEAD --oneline` to see the commits that will be included
3. Run `git diff origin/main...HEAD --name-only` to get a list of changed files
4. Run `git push -u origin <branch_name>` to push the branch
5. Run `gh pr create --title "<pr_title>" --body "<pr_body>" --base main` to create the PR
6. Capture the PR URL from the output

## Report

Return ONLY the PR URL that was created (no other text)