class Book {
  constructor(title, author, isbn){
  this.title = title;
  this.author = author;
  this.isbn = isbn;
  }
}

class UI {
  addBookToList(book){
    const list = document.getElementById('book-list');
    // create table row
    const row = document.createElement('tr');
    // insert columns
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="delete">X</a></td>
      `;
    
    list.appendChild(row);
  }

  showAlert(message,className){
    // create div
    const div = document.createElement('div');
    // add class to div
    div.className = `alert ${className}`;
    // add text node to div
    div.appendChild(document.createTextNode(message));
    // ui elements
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    // insert alert
    container.insertBefore(div, form);
    // disappear after 3 seconds
    setTimeout(function(){
      document.querySelector('.alert').remove();
    },3000)
  }
  deleteBook(target){
    if (target.className === 'delete'){
      target.parentElement.parentElement.remove();
      }
  }
  clearFields(){
    document.getElementById('title').value = ''
    document.getElementById('author').value = ''
    document.getElementById('isbn').value = ''
  }
}
class Store {
  static getBooks(){
    let books;
    if(localStorage.getItem('books')=== null){
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'))
    }
    return books
  }
  static displayBooks(){
    const books = Store.getBooks();

    books.forEach(function(book){
      const ui = new UI
      // add book to UI
      ui.addBookToList(book)
    })
  }
  static addBook(book){
    const books = Store.getBooks();

    books.push(book);
    localStorage.setItem('books',JSON.stringify(books));
  }
  static removeBook(isbn){
    const books = Store.getBooks();
    books.forEach(function(book, index){
      if (book.isbn===isbn){
        books.splice(index,1);
      }
    })

    localStorage.setItem('books',JSON.stringify(books));
  }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded',Store.displayBooks)

// Listeners
document.getElementById('book-form').addEventListener('submit',function(e){
  // get form values
  const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value
  
  // instantiate book
  const book = new Book(title, author, isbn);

  // Instantiate UI object
  const ui = new UI();
  console.log(ui)
  // Validate
  if (title === '' || author==='' || isbn===''){
    // Error Alert
    ui.showAlert('Do Not Leave Fields Blank','error')
  } else {
    // Add Book to List
    ui.addBookToList(book);

    // Add to LS
    Store.addBook(book);

    // Success Alert
    ui.showAlert('Book Added','success')

    // Clear fields
    ui.clearFields();
  }

  e.preventDefault();
})
// even listener for delete
document.getElementById('book-list').addEventListener('click',function(e){
  // Instantiate UI object
  const ui = new UI();

  // delete using prototype method
  ui.deleteBook(e.target);

  // Remove From LS
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent)

  // show alert
  ui.showAlert('Book Removed','success')

  e.preventDefault();
})