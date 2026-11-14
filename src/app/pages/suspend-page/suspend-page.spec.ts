import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuspendPage } from './suspend-page';

describe('SuspendPage', () => {
  let component: SuspendPage;
  let fixture: ComponentFixture<SuspendPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuspendPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SuspendPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
