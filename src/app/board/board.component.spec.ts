import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('has six rows, plus the row of drop buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll<HTMLElement>('div.row').length).toBe(7);
  });

  it('has seven cells per row', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('div.row')[1]?.querySelectorAll('.cell')?.length).toBe(7);
  });

  it('fills the last unfilled cell in a clicked column', fakeAsync(() => {
    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelectorAll<HTMLElement>('.launch-button')[0]?.click()

    tick()
    fixture.detectChanges()

    expect(compiled.querySelectorAll('div.row')[6].querySelectorAll('.cell')[0]?.className).toContain('red');
    expect(compiled.querySelectorAll('div.row')[0].querySelectorAll('.cell')[0]?.className).not.toContain('red');

    compiled.querySelectorAll('div.row')[0].querySelectorAll<HTMLElement>('div.cell')[0]?.click()
  }));

  it('alternates colors', fakeAsync(() => {
    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelectorAll<HTMLElement>('.launch-button')[0]?.click()
    compiled.querySelectorAll<HTMLElement>('.launch-button')[0]?.click()

    tick()
    fixture.detectChanges()
    expect(compiled.querySelectorAll('div.row')[6].querySelectorAll('.cell')[0]?.className).toContain('red');
    expect(compiled.querySelectorAll('div.row')[5].querySelectorAll('.cell')[0]?.className).toContain('blue');
  }));

  it('ignores invalid moves', fakeAsync(() => {
    const compiled = fixture.nativeElement as HTMLElement;

    for (let i = 0; i < 6; i++) {
      compiled.querySelectorAll<HTMLElement>('.launch-button')[0]?.click()
    }

    // red attempts to play in full column
    compiled.querySelectorAll<HTMLElement>('.launch-button')[0]?.click()

    // it should still be red's turn
    compiled.querySelectorAll<HTMLElement>('.launch-button')[1]?.click()

    tick()
    fixture.detectChanges()

    expect(compiled.querySelectorAll('div.row')[6].querySelectorAll('.cell')[1]?.className).toContain('red');
  }))

  describe('victory conditions', () => {
    it('detects horizontal victory', fakeAsync(() => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('#red-score')?.textContent).toBe('0');

      for (let i = 0; i < 3; i++) {
        compiled.querySelectorAll<HTMLElement>('.launch-button')[i]?.click()
        compiled.querySelectorAll<HTMLElement>('.launch-button')[0]?.click()
      }

      compiled.querySelectorAll<HTMLElement>('.launch-button')[3]?.click()

      tick()
      fixture.detectChanges()

      expect(compiled.querySelector('#red-score')?.textContent).toBe('1');
    }));

    it('detects vertical victory', fakeAsync(() => {
      const compiled = fixture.nativeElement as HTMLElement;

      compiled.querySelectorAll<HTMLElement>('.launch-button')[3]?.click()
      compiled.querySelectorAll<HTMLElement>('.launch-button')[1]?.click()
      for (let i = 0; i < 3; i++) {
        compiled.querySelectorAll<HTMLElement>('.launch-button')[0]?.click()
        compiled.querySelectorAll<HTMLElement>('.launch-button')[1]?.click()
      }

      tick()
      fixture.detectChanges()

      expect(compiled.querySelector('#blue-score')?.textContent).toBe('1');
    }));

    it('detects left diagonal victory', fakeAsync(() => {
      const compiled = fixture.nativeElement as HTMLElement;

      compiled.querySelectorAll<HTMLElement>('.launch-button')[0]?.click()
      compiled.querySelectorAll<HTMLElement>('.launch-button')[0]?.click()
      compiled.querySelectorAll<HTMLElement>('.launch-button')[0]?.click()
      compiled.querySelectorAll<HTMLElement>('.launch-button')[1]?.click()
      compiled.querySelectorAll<HTMLElement>('.launch-button')[1]?.click()
      compiled.querySelectorAll<HTMLElement>('.launch-button')[2]?.click()

      for (let i = 0; i < 3; i++) {
        compiled.querySelectorAll<HTMLElement>('.launch-button')[i]?.click()
        compiled.querySelectorAll<HTMLElement>('.launch-button')[4]?.click()
      }

      compiled.querySelectorAll<HTMLElement>('.launch-button')[3]?.click()

      tick()
      fixture.detectChanges()

      expect(compiled.querySelector('#red-score')?.textContent).toBe('1');
    }));

    it('detects right diagonal victory', fakeAsync(() => {
      const compiled = fixture.nativeElement as HTMLElement;


      compiled.querySelectorAll<HTMLElement>('.launch-button')[1]?.click()
      compiled.querySelectorAll<HTMLElement>('.launch-button')[2]?.click()
      compiled.querySelectorAll<HTMLElement>('.launch-button')[2]?.click()
      compiled.querySelectorAll<HTMLElement>('.launch-button')[3]?.click()
      compiled.querySelectorAll<HTMLElement>('.launch-button')[3]?.click()
      compiled.querySelectorAll<HTMLElement>('.launch-button')[3]?.click()

      for (let i = 0; i < 3; i++) {
        compiled.querySelectorAll<HTMLElement>('.launch-button')[i]?.click()
        compiled.querySelectorAll<HTMLElement>('.launch-button')[4]?.click()
      }

      compiled.querySelectorAll<HTMLElement>('.launch-button')[3]?.click()

      tick()
      fixture.detectChanges()

      expect(compiled.querySelector('#red-score')?.textContent).toBe('1');
    }));

    it('counts multiple victories', fakeAsync(() => {
      const compiled = fixture.nativeElement as HTMLElement;

      compiled.querySelectorAll<HTMLElement>('.launch-button')[3]?.click()
      compiled.querySelectorAll<HTMLElement>('.launch-button')[1]?.click()
      for (let i = 0; i < 4; i++) {
        compiled.querySelectorAll<HTMLElement>('.launch-button')[0]?.click()
        compiled.querySelectorAll<HTMLElement>('.launch-button')[1]?.click()
      }

      tick()
      fixture.detectChanges()

      expect(compiled.querySelector('#blue-score')?.textContent).toBe('2');
      expect(compiled.querySelector('#red-score')?.textContent).toBe('1');
    }));
  })
});
