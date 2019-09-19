/**
 * @param {character[][]} grid
 * @return {number}
 */
function numIslands(grid) {
  var islands = 0

  var exploreIsland = function(i, j) {
    if (i < 0 || j < 0 || i >= grid.length || j >= grid[0].length) return
    if (grid[i][j] === '1') {
      grid[i][j] = '2'
      exploreIsland(i - 1, j)
      exploreIsland(i + 1, j)
      exploreIsland(i, j - 1)
      exploreIsland(i, j + 1)
    }
    return
  }

  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === '1') {
        exploreIsland(i, j)
        islands++
      }
    }
  }
  return islands
}
// read input data
let height = parseInt(readline())
let width = parseInt(readline())
let grid = []
for (var i = 0; i < height; i++) {
  grid[i] = (readline() || '').split('')
}
// numIslands
print(numIslands(grid))
