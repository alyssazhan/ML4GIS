const test = require("tap").test
const evaluate = require("./")

const defaultContext = {
  haveKids: "yes",
  "have-kids": "yes",
  kidCount: 2,
  person: { name: "betsy" },
  items: ["shirt", "pants", "chapstick"],
  favoriteItem: "chapstick",
  phone: "123-456-7890"
}

const tests = [
  { expr: `{haveKids}='yes'`, expect: true },
  { expr: `{var('have-kids')}='yes'`, expect: true },
  { expr: `{var('have-kids').length} = 3`, expect: true },
  { expr: `{haveKids}='yes' and {kidCount} >= 1`, expect: true },
  { expr: `{kidCount} < 2`, expect: false },
  { expr: `{person.name}='betsy'`, expect: true },
  { expr: `{items} notempty`, expect: true },
  { expr: `{items} contains {favoriteItem}`, expect: true },
  { expr: `{items.length} > 1`, expect: true },
  {
    expr: `{email} notempty or {phone} notempty or {skype} notempty`,
    expect: true
  },
  {
    expr: `countCarApparel({items}, ['shirt', 'pants']) >= 2`,
    expect: true,
    functions: {
      countCarApparel: (items, clothes) =>
        items.filter(item => clothes.includes(item)).length
    }
  }
]

for (const { expr, expect, context, functions } of tests) {
  test(expr, t => {
    t.plan(1)
    t.equal(evaluate(expr, context || defaultContext, functions), expect)
  })
}
