import { Component, signal } from '@angular/core';

enum Color { red = 'red', blue = 'blue' }

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
  board = signal(create2dArray<Color | null>(6, 7, null))
  player = signal(Color.red)

  play(column: number) {
    this.board.update(b => {
      const rowToUpdate = b.findIndex((row, idx) =>
        row[column] === null && (idx === b.length - 1 || b[idx + 1][column] !== null)
      );
      b[rowToUpdate][column] = this.player()
      console.log(b)
      return b
    })

    this.player.set(this.player() === Color.red ? Color.blue : Color.red)
  }
}
