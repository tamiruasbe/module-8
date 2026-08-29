export interface Course {
  id: number;
  code: string;
  title: string;
  maxCapacity: number;
  enrollmentCount: number;
  instructorId?: string | null;
  status?: string;
}
export interface CourseEditModel {
  id: number;
  code: string;
  title: string;
  maxCapacity: number;
  enrollmentCount: number;
}
export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
export interface CourseLink {
  href: string;
  rel: string;
  method: string;
}
/** Detail payload — mirrors `CourseDetailDto` (list rows do not include `links`). */
export interface CourseDetail extends Course {
  links: readonly CourseLink[];
}
