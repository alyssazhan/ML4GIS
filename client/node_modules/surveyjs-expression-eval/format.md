# SurveyJS Format

This is a specification based on what I can gather from the [SurveyJS documentation](https://surveyjs.io/Examples/Library/?id=condition-kids&platform=jQuery&theme=default).

## Examples

```javascript
{haveKids}='yes'

{haveKids}='yes' and {kids} >= 1

{var('have-kids')}='yes'

{matrix.name}='yes'

// "quality" is a matrix question, rowsWithValue is a custom function
rowsWithValue({quality}, 'disagree') >= 3

// "car" is a checkbox question
{car} notempty

{car} contains {item}

{car.length} > 1

{car} contains {item} and {item}!={bestcar}

{email} notempty or {phone} notempty or {skype} notempty
```

## Functions/Operators

| Usage                                        | Description                        |
| -------------------------------------------- | ---------------------------------- |
| `A + B`                                      | Addition                           |
| `A - B`                                      | Subtraction                        |
| `A / B`                                      | Division                           |
| `A * B`                                      | Multiplication                     |
| `A = B`, `A == B`, `A equals B`, `A equal B` | Equality                           |
| `A > B`                                      | Greater than                       |
| `A >= B`                                     | Greater than or equal              |
| `A <= B`                                     | Less than or equal                 |
| `A < B`                                      | Less than                          |
| `A ^ B`                                      | To the power of                    |
| `A % B`                                      | Modulus                            |
| `A != B`                                     | Not Equal                          |
| `A <> B`                                     | Not Equal                          |
| `A contain B`, `A *= B`, `A contains B`      | Check if A contains B              |
| `A notcontain B`, `A notcontains B`          | Check if A contains B              |
| `A notempty`                                 | Check if A has atleast one element |
| `A empty`                                    | Check if A has no elements         |
| `A or B`, `A \| B`, `A \|\| B`               | Check if A contains B              |
| `A and B`, `A & B`, `A && B`                 | Check if A contains B              |
