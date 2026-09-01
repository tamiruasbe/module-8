import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CourseCard } from './course-card';

describe('CourseCard', () => {
  const mockCourse = {
    id: 1,
    code: 'CSE-101',
    title: 'Advanced Web Dev',
    maxCapacity: 30,
    enrollmentCount: 12,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CourseCard],
      providers: [provideRouter([])],
    });
  });

  it('should display the course title', () => {
    const fixture = TestBed.createComponent(CourseCard);

    fixture.componentRef.setInput('course', mockCourse);

    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;

    expect(el.textContent).toContain('Advanced Web Dev');
  });

  it('should emit enrollClicked event when button is clicked', () => {
    const fixture = TestBed.createComponent(CourseCard);

    const component = fixture.componentInstance;

    fixture.componentRef.setInput('course', mockCourse);

    fixture.detectChanges();

    let emittedCourse: any = null;

    component.enrollClicked.subscribe((course) => {
      emittedCourse = course;
    });

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    button.click();

    expect(emittedCourse).toBeTruthy();
    expect(emittedCourse.title).toBe('Advanced Web Dev');
  });
});
