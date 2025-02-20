import { Component, computed, signal } from '@angular/core';

enum Color { red = 'red', blue = 'blue' }
type Cell = Color | null

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
      let color: Cell = null;
      let count = 0
      for (let j = 0; j < this.board()[0].length; j++) {
        const cell = this.board()[i][j]
        if (color === null) {
          color = cell
          count = 1
        } else if (color === cell) {
          count++
          if (count === 4) {
            return color
          }
        } else {
          color = null
          count = 0
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
