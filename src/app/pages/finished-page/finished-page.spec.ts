import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinishedPage } from './finished-page';

describe('FinishedPage', () => {
  let component: FinishedPage;
  let fixture: ComponentFixture<FinishedPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinishedPage],
    }).compileComponents();

    fixture = TestBed.createComponent(FinishedPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
