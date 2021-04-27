# SurveyJS Expression Eval

This module allows you to evaluate expressions using the SurveyJS language.

```javascript
import evaluateExpression from "surveyjs-expression-eval"

evaluateExpression("{myvar} > {myothervar}", {
  myvar: 2,
  myothervar: 1
})
// true
```

See [format.md](blob/master/format.md) for more examples and a list of operators.
