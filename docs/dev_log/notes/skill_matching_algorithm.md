# Skill Matching Algorithm

## Formula
```
match_% = (earned_weight / total_weight) * 100
```

## Weight Calculation
- importance: Low(1), Medium(2), High(3)
- mandatory: 2x multiplier
- weight = importance * (2 if mandatory else 1)

## Proficiency Scoring
- Student >= required: full weight
- Student < required: partial credit
- Missing skill: 0 weight

## Eligibility
- Separate check: student_cgpa >= min_required
- Independent of match percentage
