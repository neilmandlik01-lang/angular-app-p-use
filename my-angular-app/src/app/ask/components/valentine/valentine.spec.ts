import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Valentine } from './valentine';

describe('Valentine', () => {
  let component: Valentine;
  let fixture: ComponentFixture<Valentine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Valentine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Valentine);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
