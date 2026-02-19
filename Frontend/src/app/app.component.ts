import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BookService } from './services/book.service';
import { Book } from './book';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class AppComponent implements OnInit {
  books: Book[] = [];

  newBook: Book = { id: 0, title: '', author: '', isbn: '', publicationDate: '' };
  addModal = false;

  editingBook: Book | null = null;
  originalBook: Book | null = null;

  showDeleteConfirm = false;
  deleteBookId: number | null = null;

  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'warning' | 'error' = 'success';

  constructor(private bookService: BookService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks().subscribe(data => this.books = data);
  }

  triggerAlert(message: string, type: 'success' | 'warning' | 'error' = 'success') {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;

    this.cd.detectChanges(); 

    setTimeout(() => {
      this.showAlert = false;
      this.cd.detectChanges();
    }, 3000); 
  }

  closeAlert() {
    this.showAlert = false;
  }

  openAddModal() {
    this.newBook = { id: 0, title: '', author: '', isbn: '', publicationDate: '' };
    this.addModal = true;
  }

  saveNewBook() {
    const { title, author, isbn, publicationDate } = this.newBook;
    if (!title || !author || !isbn || !publicationDate) {
      this.triggerAlert("Please fill in all fields!", "warning");
      return;
    }

    this.bookService.addBook(this.newBook).subscribe(() => {
      this.loadBooks();
      this.addModal = false;
      this.triggerAlert("Book added successfully!", "success");
    });
  }

  closeAddModal() {
    this.addModal = false;
  }

  openEditModal(book: Book) {
    this.originalBook = { ...book };
    this.editingBook = { ...book };

    if (this.editingBook.publicationDate) {
      const d = new Date(this.editingBook.publicationDate);
      const year = d.getFullYear();
      const month = ('0' + (d.getMonth() + 1)).slice(-2);
      const day = ('0' + d.getDate()).slice(-2);
      this.editingBook.publicationDate = `${year}-${month}-${day}`;
    }
  }

  saveEdit() {
    if (!this.editingBook || !this.originalBook) return;
    const origDate = this.originalBook.publicationDate
      ? this.originalBook.publicationDate.substring(0, 10)
      : '';
    const editDate = this.editingBook.publicationDate || '';

    if (
      this.editingBook.title === this.originalBook.title &&
      this.editingBook.author === this.originalBook.author &&
      this.editingBook.isbn === this.originalBook.isbn &&
      editDate === origDate
    ) {
      this.triggerAlert("No changes detected!", "warning");
      return;
    }

    this.bookService.updateBook(this.editingBook).subscribe(() => {
      this.loadBooks();
      this.closeEditModal();
      this.triggerAlert("Book updated successfully!", "success");
    });
  }

  closeEditModal() {
    this.editingBook = null;
    this.originalBook = null;
  }

  deleteBook(id: number) {
    this.deleteBookId = id;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    if (this.deleteBookId !== null) {
      this.bookService.deleteBook(this.deleteBookId).subscribe(() => {
        this.loadBooks();
        this.triggerAlert("Book deleted successfully!", "success");
        this.closeDeleteConfirm();
      });
    }
  }

  closeDeleteConfirm() {
    this.showDeleteConfirm = false;
    this.deleteBookId = null;
  }
}
