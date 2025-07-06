import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstanciaPage } from './estancia.page';

describe('EstanciaPage', () => {
  let component: EstanciaPage;
  let fixture: ComponentFixture<EstanciaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EstanciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
