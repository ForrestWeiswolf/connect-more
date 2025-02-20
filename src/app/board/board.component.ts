import { Component, computed, signal } from '@angular/core';

enum Color { red = 'red', blue = 'blue' }
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

@Component({
  selector: 'app-board',
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  board = signal(create2dArray<Cell>(6, 7, null), {
    equal: (a, b) => a.flat().join(',') === b.flat().join(',')
  })
  player = signal(Color.red)
  winner = computed<Color | null>(() => {
    for (let i = 0; i < this.board().length; i++) {
      for (let j = 0; j < this.board()[0].length; j++) {
        const row = this.board()[i]
        let slice = row.slice(j, j + GOAL)
        if (slice.length === GOAL && slice[0] && slice.every(cell => cell === slice[0])) {
          return slice[0]
        }

        const col = this.board().map(r => r[j])
        slice = col.slice(i, i + GOAL)
        if (slice.length === GOAL && slice[0] && slice.every(cell => cell === slice[0])) {
          return slice[0]
        }
      }
    }

    return null
  })

  play(column: number) {
    this.board.update(b => {
      const rowToUpdate = b.findIndex((row, idx) =>
        row[column] === null && (idx === b.length - 1 || b[idx + 1][column] !== null)
      );
      const newBoard = [...b].map(row => [...row])
      newBoard[rowToUpdate][column] = this.player()
      return newBoard
    })
    this.player.set(this.player() === Color.red ? Color.blue : Color.red)
  }
}
