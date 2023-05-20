import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanUsageComponent } from './plan-usage.component';

describe('PlanUsageComponent', () => {
  let component: PlanUsageComponent;
  let fixture: ComponentFixture<PlanUsageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanUsageComponent]
    });
    fixture = TestBed.createComponent(PlanUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
