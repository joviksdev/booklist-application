const domElement = identifier => document.querySelector(`${identifier}`);

domElement('.book-list').addEventListener('submit', handleForm);

class Book {
  constructor(title, author, description, isbn) {
    this.title = title;
    this.author = author;
    this.description = description;
    this.isbn = isbn;
  }
}

class StoreBook {
  static addBook(book) {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
      books.push(book);
      localStorage.setItem('books', JSON.stringify(books));
    } else {
      books = JSON.parse(localStorage.getItem('books'));
      books.push(book);
      localStorage.setItem('books', JSON.stringify(books));
    }
  }

  static removeBook(index) {
    let books = JSON.parse(localStorage.getItem('books'));
    if (books !== null) {
      books.forEach((book, i) => {
        if (
          books.indexOf(book) === parseInt(index) &&
          confirm(
            `Are you sure you want to delete ${book.title} form book list`
          )
        ) {
          books.splice(i, 1);
          localStorage.setItem('books', JSON.stringify(books));
          UI.store();
        }
      });
    }
  }

  static editBook(index) {
    let books = JSON.parse(localStorage.getItem('books'));

    if (books !== null) {
      books.forEach((book, i) => {
        if (books.indexOf(book) === parseInt(index)) {
          domElement('.title').value = book.title;
          domElement('.author').value = book.author;
          domElement('.description').value = book.description;
          domElement('.isbn').value = book.isbn;

          books.splice(i, 1);
        }
      });
    }

    localStorage.setItem('books', JSON.stringify(books));
    UI.store();
  }
}

class UI {
  static store() {
    let books = JSON.parse(localStorage.getItem('books'));
    if (books !== null) {
      let book = books
        .map(value => {
          return `
          <div class="display-output">
              <h3>Title: ${value.title} </h3>
              <p><strong>Author: ${value.author}</strong></p>
              <p>Description: ${value.description}</p>
              <p>ISBN: ${value.isbn}</p>
              <button class="btn btn-delete" onclick=StoreBook.removeBook('${books.indexOf(
                value
              )}')>Delete</button>
              <button class="btn btn-edit" onclick=StoreBook.editBook('${books.indexOf(
                value
              )}')>Edit</button>
          </div>
      `;
        })
        .join('');

      domElement('.output').innerHTML = book;
    }
  }
}

function handleForm(e) {
  e.preventDefault();

  const title = domElement('.title').value;
  const author = domElement('.author').value;
  const description = domElement('.description').value;
  const isbn = parseInt(domElement('.isbn').value);

  if (validateForm(title, author, description, isbn)) {
    const book = new Book(title, author, description, isbn);
    StoreBook.addBook(book);
    UI.store();

    const div = `
      <p class = "error-green"> Book added Successfully!!</p>
    `;
    domElement('.error').innerHTML = div;

    setTimeout(() => {
      domElement('.error').innerHTML = '';
    }, 3000);

    domElement('.book-list').reset();
  }
}

function validateForm(...input) {
  const error = domElement('.error');
  [title, author, description, isbn] = input;
  if (title === '' || author === '' || description === '' || isbn === '') {
    const div = `
      <p class = "error-red"> *Fill in all fields</p>
    `;
    error.innerHTML = div;

    setTimeout(() => {
      error.innerHTML = '';
    }, 3000);

    return false;
  } else if (isbn < 0 || isNaN(isbn)) {
    const div = `
      <p class = "error-red"> *ISBN must be a valid number</p>
    `;
    error.innerHTML = div;

    setTimeout(() => {
      error.innerHTML = '';
    }, 3000);

    return false;
  } else {
    return true;
  }
}

document.addEventListener('DOMContentLoaded', () => UI.store());
