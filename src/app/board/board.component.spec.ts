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

  it('has six rows', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('div.row').length).toBe(6);
  });

  it('has seven cells per row', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('div.row')?.querySelectorAll('span')?.length).toBe(7);
  });

  it('fills the last unfilled cell in a clicked column', fakeAsync(() => {
    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelectorAll('div.row')[0].querySelectorAll('span')[0]?.click()

    tick()
    fixture.detectChanges()
    expect(compiled.querySelectorAll('div.row')[5].querySelectorAll('span')[0]?.textContent).toBe('•');
    expect(compiled.querySelectorAll('div.row')[0].querySelectorAll('span')[0]?.textContent).toBe('.');

    compiled.querySelectorAll('div.row')[0].querySelectorAll('span')[0]?.click()

    tick()
    fixture.detectChanges()
    expect(compiled.querySelectorAll('div.row')[4].querySelectorAll('span')[0]?.textContent).toBe('•');
  }));
});
