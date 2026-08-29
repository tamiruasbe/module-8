import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorCourseList } from './instructor-course-list';

describe('InstructorCourseList', () => {
  let component: InstructorCourseList;
  let fixture: ComponentFixture<InstructorCourseList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorCourseList],
    }).compileComponents();

    fixture = TestBed.createComponent(InstructorCourseList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
