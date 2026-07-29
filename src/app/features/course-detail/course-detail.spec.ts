import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CourseDetail } from './course-detail';

describe('CourseDetail', () => {
  let component: CourseDetail;
  let fixture: ComponentFixture<CourseDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDetail],
      providers: [provideRouter([])],
    }).compileComponents();

    // fixture = TestBed.createComponent(CourseDetail);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
    fixture = TestBed.createComponent(CourseDetail);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('id', '1');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
