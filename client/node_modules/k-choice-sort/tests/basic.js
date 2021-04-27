// @flow

var test = require('tape')
const seamless = require('seamless-immutable')
const Sorter = require('../')
const leftpad = require('left-pad')

var A = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
var B = [9, 8, 1, 2, 3, 5, 6, 7, 0, 4]

test('basic process iteration', t => {
  var sorter = new Sorter({ items: [0, 1, 2], maxCandidates: 2 })

  t.deepEqual(
    sorter.M,
    [
      // prettier-ignore
      [2, 0, 0],
      [0, 2, 0],
      [0, 0, 2]
    ],
    'initial matrix should have correct diagonal'
  )
  t.equal(sorter.isSorted(), false, 'sorter should start not sorted')

  const candidates = sorter.getCandidates()
  t.deepEqual(
    candidates,
    [0, 1],
    'initial candidates should be first two items'
  )

  t.equal(
    sorter.getRankingGroupCount(),
    1,
    'Number of ranking groups should be 1 after before any answers'
  )

  sorter.recordAnswer(1, [0])

  t.deepEqual(
    sorter.M,
    [
      // prettier-ignore
      [2, -1, 0],
      [1, 2, 0],
      [0, 0, 2]
    ],
    'answers should be properly recorded'
  )

  t.equal(
    sorter.getRankingGroupCount(),
    3,
    'Number of ranking groups should be 3 after first answer'
  )

  t.equal(sorter.getRankings()['0'], 0.5, 'Ranking for 0 should be correct')
  t.equal(sorter.getRankings()['1'], 1.5, 'Ranking for 1 should be correct')
  t.equal(sorter.getRankings()['2'], 1, 'Ranking for 2 should be correct')

  sorter.recordAnswer(2, [1])
  t.deepEqual(
    sorter.M,
    [
      // prettier-ignore
      [2, -1, -1],
      [1, 2, -1],
      [1, 1, 2]
    ],
    'matrix should be filled after second entry'
  )
  t.equal(sorter.isSorted(), true, 'sorter should report it is sorted')
  t.deepEqual(
    sorter.getRankings(),
    {
      '0': 0,
      '1': 1,
      '2': 2
    },
    'items should be correctly ranked'
  )
  t.end()
})

test('should be able to completely sort a set (1)', t => {
  var sorter = new Sorter({ items: A, maxCandidates: 4 })
  let iters = 0
  while (!sorter.isSorted()) {
    iters++
    const candidates = sorter.getCandidates()
    const winner = Math.max(...candidates)
    const losers = candidates.filter(candidate => candidate != winner)
    sorter.recordAnswer(winner, losers)
    if (iters > 50) {
      t.fail('Exceeded 50 iterations')
      break
    }
  }
  t.comment(`Took ${iters} iterations`)
  t.deepEqual(sorter.getRankedOrder(), A, 'Should sort properly')
  t.end()
})

test('should be able to completely sort a set (2)', t => {
  var sorter = new Sorter({ items: B, maxCandidates: 4 })
  let iters = 0
  while (!sorter.isSorted()) {
    iters++
    const candidates = sorter.getCandidates()
    const winner = Math.max(...candidates)
    const losers = candidates.filter(candidate => candidate != winner)
    sorter.recordAnswer(winner, losers)
    if (iters > 50) {
      t.fail('Exceeded 50 iterations')
      break
    }
  }
  t.comment(`Took ${iters} iterations`)
  t.deepEqual(sorter.getRankedOrder(), [...B].sort(), 'Should sort properly')
  t.end()
})

test('should be able to completely sort a set (2) with serializations', t => {
  let sorter = new Sorter({ items: B, maxCandidates: 4 })
  let iters = 0
  while (!sorter.isSorted()) {
    iters++
    const candidates = sorter.getCandidates()
    const winner = Math.max(...candidates)
    const losers = candidates.filter(candidate => candidate != winner)
    sorter.recordAnswer(winner, losers)
    sorter = new Sorter({ fromJSON: sorter.toJSON() })
    if (iters > 50) {
      t.fail('Exceeded 50 iterations')
      break
    }
  }
  t.comment(`Took ${iters} iterations`)
  t.deepEqual(sorter.getRankedOrder(), [...B].sort(), 'Should sort properly')
  t.end()
})

test('should be able to completely sort a set (2) with serializations via seamless-immutable', t => {
  let sorter = new Sorter({ items: B, maxCandidates: 4 })
  let iters = 0
  while (!sorter.isSorted()) {
    iters++
    const candidates = sorter.getCandidates()
    const winner = Math.max(...candidates)
    const losers = candidates.filter(candidate => candidate != winner)
    sorter.recordAnswer(winner, losers)
    sorter = new Sorter({ fromJSON: seamless.from(sorter.toJSON()) })
    if (iters > 50) {
      t.fail('Exceeded 50 iterations')
      break
    }
  }
  t.comment(`Took ${iters} iterations`)
  t.deepEqual(sorter.getRankedOrder(), [...B].sort(), 'Should sort properly')
  t.end()
})
