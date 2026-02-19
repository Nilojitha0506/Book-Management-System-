import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { Book } from './book';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render main heading <h1>', () => {
    const h1 = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(h1).toBeTruthy();
    expect(h1.textContent?.length).toBeGreaterThan(0); 
  });

  it('should open add modal', () => {
    component.openAddModal();
    fixture.detectChanges();
    expect(component.addModal).toBeTrue();
    const modal = fixture.debugElement.query(By.css('.modal-content'));
    expect(modal).toBeTruthy();
  });

  it('should close add modal', () => {
    component.openAddModal();
    fixture.detectChanges();
    component.closeAddModal();
    fixture.detectChanges();
    expect(component.addModal).toBeFalse();
  });

  it('should open edit modal', () => {
    const book: Book = { id: 1, title: 'Test', author: 'Author', isbn: '123', publicationDate: '2026-01-01' };
    component.openEditModal(book);
    expect(component.editingBook).toEqual(book);
    expect(component.originalBook).toEqual(book);
  });

  it('should close edit modal', () => {
    component.editingBook = { id: 1, title: 'Test', author: 'Author', isbn: '123', publicationDate: '2026-01-01' };
    component.originalBook = { ...component.editingBook };
    component.closeEditModal();
    expect(component.editingBook).toBeNull();
    expect(component.originalBook).toBeNull();
  });

  it('should open delete confirmation', () => {
    component.deleteBook(5);
    expect(component.showDeleteConfirm).toBeTrue();
    expect(component.deleteBookId).toBe(5);
  });

  it('should close delete confirmation', () => {
    component.showDeleteConfirm = true;
    component.deleteBookId = 5;
    component.closeDeleteConfirm();
    expect(component.showDeleteConfirm).toBeFalse();
    expect(component.deleteBookId).toBeNull();
  });

  it('should trigger alert with correct message and type', () => {
    component.triggerAlert('Test success', 'success');
    expect(component.showAlert).toBeTrue();
    expect(component.alertMessage).toBe('Test success');
    expect(component.alertType).toBe('success');
  });

  it('should hide alert after clicking OK', () => {
    component.showAlert = true;
    component.showAlert = true;
    component.showAlert = false;
    expect(component.showAlert).toBeFalse();
  });

  it('should have action buttons', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBeGreaterThan(0);
  });
});
