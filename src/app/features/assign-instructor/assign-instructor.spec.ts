import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignInstructor } from './assign-instructor';

describe('AssignInstructor', () => {
  let component: AssignInstructor;
  let fixture: ComponentFixture<AssignInstructor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignInstructor],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignInstructor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
