import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CitoPage } from './cito-page';

describe('CitoPage', () => {
  let component: CitoPage;
  let fixture: ComponentFixture<CitoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitoPage],
    }).compileComponents();

    fixture = TestBed.createComponent(CitoPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
