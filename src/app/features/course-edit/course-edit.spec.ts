import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { CourseEdit } from './course-edit';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';

describe('CourseEdit', () => {
  let component: CourseEdit;
  let fixture: ComponentFixture<CourseEdit>;

  beforeEach(async () => {
    const courseServiceMock = {
      getById: () =>
        of({
          id: 1,
          code: 'CSE-301',
          title: 'Advanced Web Development',
          maxCapacity: 30,
          enrollmentCount: 5,
        }),
      updateCourse: () => of({}),
    };

    const authServiceMock = {
      hasRole: () => false,
    };

    await TestBed.configureTestingModule({
      imports: [CourseEdit],
      providers: [
        provideRouter([]),
        {
          provide: CourseService,
          useValue: courseServiceMock,
        },
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseEdit);
    component = fixture.componentInstance;

    // CourseEdit requires this input.
    // The real application normally supplies it from the route.
    fixture.componentRef.setInput('id', '1');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
