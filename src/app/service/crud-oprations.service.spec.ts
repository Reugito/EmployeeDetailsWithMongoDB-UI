import { TestBed } from '@angular/core/testing';

import { CrudOprationsService } from './crud-oprations.service';

describe('CrudOprationsService', () => {
  let service: CrudOprationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudOprationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
