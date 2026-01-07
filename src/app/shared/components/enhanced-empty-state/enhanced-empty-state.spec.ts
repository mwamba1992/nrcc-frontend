import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnhancedEmptyState } from './enhanced-empty-state';

describe('EnhancedEmptyState', () => {
  let component: EnhancedEmptyState;
  let fixture: ComponentFixture<EnhancedEmptyState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnhancedEmptyState]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnhancedEmptyState);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
