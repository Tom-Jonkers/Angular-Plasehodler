import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOpenPackComponent } from './dialog-open-pack.component';

describe('DialogOpenPackComponent', () => {
  let component: DialogOpenPackComponent;
  let fixture: ComponentFixture<DialogOpenPackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogOpenPackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogOpenPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
