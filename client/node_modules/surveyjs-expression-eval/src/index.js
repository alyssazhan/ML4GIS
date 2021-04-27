const jsep = require("jsep")

jsep.addBinaryOp("=", 14)
jsep.addBinaryOp("==", 14)

jsep.addBinaryOp("contains", 6)
jsep.addBinaryOp("contain", 6)
jsep.addBinaryOp("*=", 6)

jsep.addBinaryOp("notcontains", 6)
jsep.addBinaryOp("notcontain", 6)

jsep.addBinaryOp("!=", 7)
jsep.addBinaryOp("<>", 7)

jsep.addBinaryOp("or", 12)
jsep.addBinaryOp("|", 12)
jsep.addBinaryOp("||", 12)

jsep.addBinaryOp("and", 11)
jsep.addBinaryOp("&", 11)
jsep.addBinaryOp("&&", 11)

jsep.addBinaryOp("^", 9)
jsep.addBinaryOp("%", 3)

// These are right-side unary operators, we'll insert a fake right hand
// argument so that jsep can correctly read them
const rightSideUnaryOperators = ["notempty", "empty"]
jsep.addBinaryOp("notempty", 14)
jsep.addBinaryOp("empty", 14)

const setupReduceInsideBraces = (functions, context) => {
  const reduceInsideBraces = args => {
    if (args.length !== 1)
      throw new Error(
        `Invalid content in curly braces (1): "${JSON.stringify(args)}"`
      )
    switch (args[0].type) {
      case "Identifier":
        return context[args[0].name]
      case "MemberExpression": {
        const { property, object } = args[0]
        try {
          return reduceInsideBraces([object])[property.name]
        } catch (e) {
          throw new Error(
            `InnerBraceExpression (error accessing ${property.name})\n${
              e.stack
            }`
          )
        }
      }
      case "CallExpression": {
        if (args[0].callee.name === "var") {
          return context[args[0].arguments[0].value]
        }
      }
      default:
        throw new Error(
          `Invalid content in curly braces (3): "${JSON.stringify(args)}"`
        )
    }
  }
  return reduceInsideBraces
}

const setupReduce = (functions, context) => {
  const reduceInsideBraces = setupReduceInsideBraces(functions, context)
  const reduce = tree => {
    if (typeof tree !== "object") return tree
    switch (tree.type) {
      case "CallExpression": {
        if (tree.callee.name === "getVarFromContext") {
          return reduceInsideBraces(tree.arguments)
        }
        if (functions[tree.callee.name]) {
          return functions[tree.callee.name](
            ...tree.arguments.map(a => reduce(a))
          )
        }
        throw new Error(`Function "${tree.callee.name}" does not exist`)
      }
      case "BinaryExpression": {
        const [left, right] = [reduce(tree.left), reduce(tree.right)]
        switch (tree.operator) {
          case "=":
          case "==":
          case "equals":
          case "equal": {
            return left === right
          }
          case "+":
            return left + right
          case "-":
            return left - right
          case "/":
            return left / right
          case "*":
            return left * right
          case ">":
            return left > right
          case "<":
            return left < right
          case "<=":
            return left <= right
          case ">=":
            return left >= right
          case "^":
            return Math.pow(left, right)
          case "%":
            return left % right
          case "!=":
          case "<>":
            return left != right
          case "contain":
          case "contains":
          case "*=":
            return (left || []).includes(right)
          case "notcontain":
          case "notcontains":
            return !(left || []).includes(right)
          case "or":
          case "||":
          case "|":
            return left || right
          case "and":
          case "&&":
          case "&":
            return left && right
          case "empty":
            return !left || left.length === 0
          case "notempty":
            return left && left.length > 0
        }
      }
      case "UnaryExpression": {
        throw new Error("unsupported unary expression")
      }
      case "ArrayExpression": {
        return tree.elements.map(e => reduce(e))
      }
      case "Literal": {
        return tree.value
      }
      default: {
        throw new Error(`Unknown token type: ${tree.type}`)
      }
    }
  }
  return reduce
}

module.exports = (expr, context, functions) => {
  // jsep can't handle "{" and "}", so replace with a function
  expr = expr.replace(/{([^}]*)}/g, "getVarFromContext($1)")

  // jsep interprets unary expressions with the operator on the left, so
  // make right-side unary expressions binary expressions with a null second
  // arguments (this is a bit hacky)
  for (const op of rightSideUnaryOperators) {
    const re = new RegExp(`\\b(${op})\\b`, "g")
    expr = expr.replace(re, "$1 null ")
  }

  // To investigate regex modifications on expression, uncomment this line
  // console.log("modified expression:", expr)

  const parsedTree = jsep(expr)

  // To investigate the parsed tree, uncomment this line
  // console.dir(parsedTree, { depth: null })

  // Evaluate Tree
  return setupReduce(functions, context)(parsedTree)
}
