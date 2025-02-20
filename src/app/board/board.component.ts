import { Component, computed, signal } from '@angular/core';

enum Color { red = 'red', blue = 'blue' }
enum Direction { up = 'up', down = 'down' }
type Cell = Color | null
const GOAL = 4

function create2dArray<T>(x: number, y: number, fill: T): T[][] {
  const result: T[][] = []
  for (let i = 0; i < x; i++) {
    result[i] = []
    for (let j = 0; j < y; j++) {
      result[i][j] = fill
    }
  }

  return result
}

const isWinningSlice = (slice: Cell[]) => slice.length === GOAL && slice[0]
  && slice.every(cell => cell === slice[0])

@Component({
  selector: 'app-board',
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  direction = Direction
  board = signal(create2dArray<Cell>(6, 7, null), {
    equal: (a, b) => a.flat().join(',') === b.flat().join(',')
  })
  player = signal(Color.red)
  scores = computed<Record<Color, number>>(() => {
    const result = { [Color.red]: 0, [Color.blue]: 0 }

    for (let i = 0; i < this.board().length; i++) {
      for (let j = 0; j < this.board()[0].length; j++) {
        const row = this.board()[i]
        const col = this.board().map(r => r[j])
        const lDiag = this.board().map((r, idx) => r[j + idx - i])
        const rDiag = this.board().map((r, idx) => r[j - idx + i])
        const cell = this.board()[i][j]
        if (isWinningSlice(row.slice(j, j + GOAL)) || isWinningSlice(col.slice(i, i + GOAL))
          || isWinningSlice(lDiag.slice(i, i + GOAL)) || isWinningSlice(rDiag.slice(i, i + GOAL))) {
          if (cell !== null) {
            result[cell] = result[cell] + 1
          }
        }
      }
    }

    return result
  })

  play(column: number, direction: Direction) {
    const rowToUpdate = direction === Direction.down ?
      this.board().findIndex((row, idx) =>
        row[column] === null
        && (idx === this.board().length - 1 || this.board()[idx + 1][column] !== null)
      ) : this.board().findLastIndex((row, idx) =>
        row[column] === null
        && (idx === 0 || this.board()[idx - 1][column] !== null)
      )

    if (rowToUpdate >= 0) {
      this.board.update(b => {
        const newBoard = [...b].map(row => [...row])
        newBoard[rowToUpdate][column] = this.player()

        return newBoard
      })
      this.player.set(this.player() === Color.red ? Color.blue : Color.red)
    }
  }
}
