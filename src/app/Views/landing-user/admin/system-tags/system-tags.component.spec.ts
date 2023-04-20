import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemTagsComponent } from './system-tags.component';

describe('SystemTagsComponent', () => {
  let component: SystemTagsComponent;
  let fixture: ComponentFixture<SystemTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemTagsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
