// @flow

// See the README for algorithm explanation

class Sorter {
  constructor({ items, maxCandidates, fromJSON }) {
    if (fromJSON) {
      this.items = fromJSON.items
      this.n = this.items.length
      this.maxCandidates = fromJSON.maxCandidates
      this.M = JSON.parse(JSON.stringify(fromJSON.M))
    } else {
      this.items = items
      this.n = this.items.length
      this.maxCandidates = maxCandidates
      this.initializeMatrix()
    }
  }

  initializeMatrix() {
    const { items, n } = this
    this.M = []
    for (let i = 0; i < n; i++) {
      const ar = []
      for (const item of items) ar.push(0)
      this.M.push(ar)
    }
    for (let i = 0; i < n; i++) {
      this.M[i][i] = 2
    }
  }

  getCandidates(maxCandidates = null) {
    const { n, M, items } = this
    maxCandidates = maxCandidates || this.maxCandidates || 2
    // Find column with the most unknowns, then choose those unknowns (and the
    // column's index) as candidates
    const columnUnknownCounts = {}
    let columnIndex = 0,
      columnUnknownCount = 0
    for (let col = 0; col < n; col++) {
      let totalUnknowns = 0
      for (let row = 0; row < n; row++) {
        if (M[row][col] == 0) totalUnknowns++
      }
      columnUnknownCounts[col] = totalUnknowns
      if (totalUnknowns > columnUnknownCount) {
        columnIndex = col
        columnUnknownCount = totalUnknowns
      }
    }

    let candidateIndices = []
    for (let row = 0; row < n; row++) {
      if (M[row][columnIndex] == 0) {
        candidateIndices.push(row)
      }
    }

    candidateIndices = candidateIndices.sort(
      (a, b) => columnUnknownCounts[b] - columnUnknownCounts[a]
    )

    return [columnIndex]
      .concat(candidateIndices)
      .slice(0, maxCandidates)
      .map(i => items[i])
  }

  isSorted() {
    const { M, n } = this
    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        if (M[row][col] === 0) return false
      }
    }
    return true
  }

  recordAnswer(winnerItem, loserItems) {
    const { M, items } = this
    const winner = items.indexOf(winnerItem)
    const losers = loserItems.map(loserItem => items.indexOf(loserItem))
    if (winner === -1 || losers.includes(-1)) {
      throw new Error('Invalid winner/losers to recordAnswer')
    }
    for (const loser of losers) {
      M[winner][loser] = 1
      M[loser][winner] = -1
    }
    this.solveForUnknowns()
  }

  solveForUnknowns() {
    // TODO this method could be much more efficient. For low values of
    // n this method works "fast enough"
    // NOTE: The procedure below is documented in the README
    const { M, n } = this
    let graphUpdated = false
    for (let b = 0; b < n; b++) {
      for (let a = 0; a < n; a++) {
        if (M[b][a] == 0) {
          for (let k = 0; k < n; k++) {
            if (M[k][a] == 1 && M[b][k] == 1) {
              M[b][a] = 1
              M[a][b] = -1
              graphUpdated = true
            }
          }
        }
      }
    }
    if (graphUpdated) this.solveForUnknowns()
  }

  getLargestRankingGroupSize() {
    const counts = {}
    const rankings = this.getRankings()
    for (const itemKey in rankings) {
      const ranking = rankings[itemKey]
      counts[ranking] = (counts[ranking] || 0) + 1
    }
    return Math.max(...Object.values(counts))
  }

  getRankingGroupCount() {
    return new Set(Object.values(this.getRankings())).size
  }

  getRankedOrder() {
    const { items } = this
    if (!this.isSorted())
      throw new Error(
        'A ranked order can only be returned if the sorter has been fully sorted'
      )
    const rankedOrder = []
    const rankings = this.getRankings()
    for (const item of items) {
      rankedOrder[rankings[item]] = item
    }
    return rankedOrder
  }

  getRankings() {
    const { n, M, items } = this
    const itemRankings = {}
    for (let row = 0; row < n; row++) {
      let rank = 0
      for (let col = 0; col < n; col++) {
        if (M[row][col] === 0) rank += 0.5
        else if (M[row][col] === 1) rank += 1
      }
      itemRankings[items[row]] = rank
    }
    return itemRankings
  }

  toJSON() {
    return {
      items: this.items,
      M: this.M,
      maxCandidates: this.maxCandidates
    }
  }
}

Sorter.fromJSON = json => {
  const sorter = new Sorter({ fromJSON: json })
  return sorter
}

module.exports = Sorter
