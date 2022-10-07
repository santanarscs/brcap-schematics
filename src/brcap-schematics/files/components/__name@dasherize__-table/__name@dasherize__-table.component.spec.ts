import { ComponentFixture, TestBed } from '@angular/core/testing';

import { <%= classify(name) %>TableComponent } from './<%= dasherize(name) %>-table.component';

describe('<%= classify(name) %>TableComponent', () => {
  let component: <%= classify(name) %>TableComponent;
  let fixture: ComponentFixture<<%= classify(name) %>TableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ <%= classify(name) %>TableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(<%= classify(name) %>TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
