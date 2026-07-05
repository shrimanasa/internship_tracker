# Matching Engine Examples

## Example 1: Strong Match
- Student: Python(Advanced), SQL(Intermediate)
- Required: Python(Intermediate, High), SQL(Beginner, Medium)
- Result: 100% match, eligible

## Example 2: Partial Match
- Student: Python(Advanced)
- Required: Python(Beginner, Medium), React(Intermediate, High)
- Result: ~40% match, React missing

## Example 3: CGPA Ineligible
- Student CGPA: 6.5, Required: 7.0
- Skills match fine but eligible=False
