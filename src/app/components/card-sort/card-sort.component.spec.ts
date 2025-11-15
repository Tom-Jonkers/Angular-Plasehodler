import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSortComponent } from './card-sort.component';

describe('CardSortComponent', () => {
  let component: CardSortComponent;
  let fixture: ComponentFixture<CardSortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardSortComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
