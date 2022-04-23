import { TestBed } from '@angular/core/testing';

import { LusiftAngularService } from './lusift-angular.service';

describe('LusiftAngularService', () => {
  let service: LusiftAngularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LusiftAngularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
