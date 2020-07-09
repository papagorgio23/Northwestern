import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfPlacesComponent } from './list-of-places.component';

describe('ListOfPlacesComponent', () => {
  let component: ListOfPlacesComponent;
  let fixture: ComponentFixture<ListOfPlacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfPlacesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfPlacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
