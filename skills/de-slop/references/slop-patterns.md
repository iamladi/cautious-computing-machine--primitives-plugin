# Slop Pattern Catalog

## Pattern Categories

### A. Unnecessary Markdown Files

**Flag for deletion:**
- Filenames matching: `NOTES.md`, `PLAN.md`, `ARCHITECTURE.md`, `THOUGHTS.md`, `IDEAS.md`, `SCRATCH.md`, `TEMP.md`, `TODO.md`
- Case-insensitive match
- Only if they appear in changed files

**Never touch:**
- `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`
- Anything in `docs/**` directory
- Any markdown with specific project purpose

### B. Redundant Comments

Comments that just restate what the next line obviously does:

**Python example:**
```python
# Create user  ← Redundant
user = User()

# Save to database  ← Redundant
db.save(user)
```

**TypeScript example:**
```typescript
// Initialize the counter  ← Redundant
const counter = 0;

// Return the result  ← Redundant
return result;
```

**Detection:**
- Single-line comment immediately before code
- Comment essentially restates the code
- Adds no context, reasoning, or "why"

### C. AI TODO Comments

Pattern: `# TODO: (Add|Consider|Might|Should|Could|May|Probably)`

**Examples to flag:**
```python
# TODO: Add error handling
# TODO: Consider edge cases
# TODO: Might need optimization
# TODO: Should validate input
```

**Keep these (specific/actionable):**
```python
# TODO: Handle timezone conversion for EU users (ticket #123)
# TODO: Replace with new API endpoint after v2 launch
```

### D. Excessive Docstrings

Flag docstrings that are excessively long for trivial functions.

**Check for:**
- Function has ≤5 lines of actual code
- Docstring has >3 lines
- Docstring just restates what code obviously does

**Bad example:**
```python
def get_name(self) -> str:
    """Get the name property.

    This method returns the name property of the object.
    It retrieves the stored name value and returns it to the caller.
    The name is a string representing the object's name.

    Returns:
        str: The name of the object
    """
    return self.name
```

**Good docstring (keep):**
```python
def parse_date(s: str, tz: str = "UTC") -> datetime:
    """Parse date string with timezone handling.

    Supports ISO 8601 and common formats. Falls back to UTC
    if timezone parsing fails.
    """
```

### E. Mock-Heavy Tests

Flag tests with excessive mocking that test nothing real.

**Pattern:**
- Count `@patch` decorators per test function
- Flag if >3 patches
- Note: CLAUDE.md says "no mocking in tests"

**Example to flag:**
```python
@patch('module.thing1')
@patch('module.thing2')
@patch('module.thing3')
@patch('module.thing4')  # 4 patches = flag
def test_something(m1, m2, m3, m4):
    # Tests nothing real
    assert True
```

### F. Fake Data in Comments/Docs

Flag suspiciously specific claims without citation:

**Patterns:**
- "according to studies" (no link)
- "research indicates" (no source)
- "X% of users" (no citation)
- Specific performance metrics without benchmark
- Made-up case studies

**Examples:**
```python
# This improves performance by 47%  ← Flag (no source)
# According to research, users prefer this  ← Flag (no citation)
```

## Detection Details

### Redundant Comment Detection

A comment is redundant if:
1. It's a single-line comment immediately before code
2. It restates what the code obviously does
3. It adds no "why", no context, no reasoning

**Use Read tool** to scan files line by line, looking for:
```
{comment line}
{code line}
```

Compare comment text to code - if essentially the same meaning, flag it.

### Excessive Docstring Detection

Calculate ratio: `docstring_lines / function_code_lines`

Flag if:
- Ratio > 2.0
- Function is simple (getter, setter, obvious logic)
- Docstring restates obvious behavior

### AI TODO Detection

Use Grep tool with pattern:
```bash
grep -n "TODO:.*\(Add\|Consider\|Might\|Should\|Could\|May\|Probably\)" {files}
```

Only flag generic TODOs, keep specific ones with tickets/dates/details.

## Good vs Bad Examples

### Good Comments (Keep)
```python
# Use exponential backoff to avoid rate limiting
retry_with_backoff(api_call)

# HACK: API returns null for empty arrays, normalize to []
data = response.data or []
```

### Bad Comments (Remove)
```python
# Retry the API call
retry_with_backoff(api_call)

# Set data to response data
data = response.data
```

### Good Docstrings (Keep)
```typescript
/**
 * Debounce function calls to prevent excessive API requests.
 * Uses leading edge trigger for immediate first call.
 */
function debounce(fn: Function, ms: number) { ... }
```

### Bad Docstrings (Simplify)
```typescript
/**
 * Get the user's name.
 *
 * This function returns the name property from the user object.
 * It accesses the name field and returns its value to the caller.
 *
 * @returns The user's name as a string
 */
function getName(): string {
  return this.name;
}
```
→ Simplify to: `/** Return the user's name. */`

## Implementation Tips

1. **Use Grep for patterns**: Fast searching across files
2. **Use Read for context**: Get surrounding lines for code issues
3. **Use Edit for cleanup**: Precise removals preserving formatting
4. **Batch by file**: Group multiple issues in same file
5. **Track line numbers**: May shift after edits, re-scan if needed
6. **Test detection first**: Verify patterns work before showing user
