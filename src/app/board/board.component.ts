import { Component, signal } from '@angular/core';

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
  board = signal(create2dArray(6, 7, false))
  fill(column: number) {
    this.board.update(b => {
      const rowToUpdate = b.findIndex((row, idx) =>
        row[column] === false && (idx === b.length - 1 || b[idx + 1][column] === true)
      );
      b[rowToUpdate][column] = true
      return b
    })
  }
}
