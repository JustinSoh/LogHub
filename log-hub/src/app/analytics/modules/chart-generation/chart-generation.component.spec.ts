import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartGenerationComponent } from './chart-generation.component';

describe('ChartGenerationComponent', () => {
  let component: ChartGenerationComponent;
  let fixture: ComponentFixture<ChartGenerationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartGenerationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
