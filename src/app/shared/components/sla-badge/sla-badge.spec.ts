import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaBadge } from './sla-badge';

describe('SlaBadge', () => {
  let component: SlaBadge;
  let fixture: ComponentFixture<SlaBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlaBadge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlaBadge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
