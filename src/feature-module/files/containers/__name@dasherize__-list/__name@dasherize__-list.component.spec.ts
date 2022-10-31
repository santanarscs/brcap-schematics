import { ComponentFixture, TestBed } from '@angular/core/testing';

import { <%= classify(name) %>ListComponent } from './<%= dasherize(name) %>-list.component';

describe('<%= classify(name) %>ListComponent', () => {
  let component: <%= classify(name) %>ListComponent;
  let fixture: ComponentFixture<<%= classify(name) %>ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ <%= classify(name) %>ListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(<%= classify(name) %>ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
