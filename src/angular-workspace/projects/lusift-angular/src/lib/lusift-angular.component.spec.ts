import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LusiftAngularComponent } from './lusift-angular.component';

describe('LusiftAngularComponent', () => {
  let component: LusiftAngularComponent;
  let fixture: ComponentFixture<LusiftAngularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LusiftAngularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LusiftAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
