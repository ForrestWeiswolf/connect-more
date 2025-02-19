import { Component } from '@angular/core';

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
  board = create2dArray(6, 7, false)
}
