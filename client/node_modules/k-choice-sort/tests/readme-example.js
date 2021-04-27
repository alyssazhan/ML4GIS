const Sorter = require("../")

// Sort the items with binary choice (k=2)
const sorter = new Sorter({
  items: ["A", "B", "C"],
  maxCandidates: 2
})

console.log("Initial: ", sorter.getRankings())
for (let i = 0; !sorter.isSorted(); i++) {
  const candidates = sorter.getCandidates()

  // Show candidates to user, have user choose winning candidate
  // For this example let's say alphabetical order wins
  candidates.sort()
  const winner = candidates[0]
  const losers = candidates.slice(1)

  sorter.recordAnswer(winner, losers)
  console.log(`Iteration ${i + 1}:`, sorter.getRankings())
}
