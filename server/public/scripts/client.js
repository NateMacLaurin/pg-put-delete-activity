$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);

  // TODO - Add code for edit & delete buttons
  $(`#bookShelf`).on('click', '.delBtn', handleDelete);
  $(`#bookShelf`).on('click', '.readBtn', handleRead);
}

function handleRead(){
  const id = $(this).closest('tr').data("book").id;
  console.log('AJAX PUT', id);

  const dataToSend = {data : $(this).closest('tr').data("book")};

  console.log('PUTting:', dataToSend);

  $.ajax({
    type: 'PUT',
    url: `/books/${id}`,
    data: dataToSend
  }).then(function (response){
    console.log('updated');
    refreshBooks();
  }).catch(function (error){
    alert('error updating read status');
  });
}

function handleDelete(){
  const id = $(this).closest('tr').data("book").id;
  console.log('AJAX DELETE', id);

  $.ajax({
      type: 'DELETE',
      url: `/books/${id}`
  }).then(function (response){
      console.log('deleted');
      refreshBooks();
  }).catch(function (error){
      alert('error deleting book');
  });
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    let $tr = $(`<tr></tr>`);
    $tr.data('book', book);
    $tr.append(`<td>${book.title}</td>`);
    $tr.append(`<td>${book.author}</td>`);
    $tr.append(`<td>${book.status}</td>`);
    if(book.status != 'Read'){
      $tr.append(`<button class="readBtn">Read</button>`);
    }
    $tr.append(`<button class="delBtn">DELETE</button>`);
    $('#bookShelf').append($tr);
  }
}
