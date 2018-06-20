import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpuChartDetailComponent } from './cpu-chart-detail.component';

describe('CpuChartDetailComponent', () => {
  let component: CpuChartDetailComponent;
  let fixture: ComponentFixture<CpuChartDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpuChartDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpuChartDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
