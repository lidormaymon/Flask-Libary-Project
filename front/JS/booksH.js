const MY_SERVER = 'https://flask-libarly-sql-alchemy.onrender.com'
//Display Books data in a table function
const showBooks = async () => {
    const booksData = await axios.get(MY_SERVER + '/show-books');
    booksDisplay.innerHTML = `
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name of book</th>
                <th>Author</th>
                <th>Date of released</th>
                <th>Quantity</th>
                <th>Type</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            ${booksData.data.map(book => `
            <tr>
                <td>${book.id}</td>
                <td>${book.name}</td>
                <td>${book.author}</td>
                <td>${book.date_published}</td>
                <td>${book.quantity}</td>
                <td>${book.type}</td>
                <td><button onclick="openDele(${book.id})">Delete</button>
                <button onclick="updateBook(${book.id})">Edit</button></td>
            </tr> `
    )
            .join("")}
        </tbody>
    </table>`
};

showBooks()

//Counting the amount of books there are in the database
const countBooks = async () => {
    const response = await axios.get(MY_SERVER + '/show-books')
    booksCount = response.data.length
    console.log(booksCount);
    title.innerHTML = `Books record:${booksCount}`
}

countBooks()

//SEARCH BOOKS FUNCTION
//CHECKBOX FUNCTIONS
const checkBox = () => {
    const searchIDBox = document.getElementById('searchIDBox')
    const searchNameBox = document.getElementById('searchNameBox')
    const searchAuthorBox = document.getElementById('searchAuthorBox')


    const searchIdInput = document.getElementById('search_book_id')
    const searchNameInput = document.getElementById('search_book_name')
    const searchAuthorInput = document.getElementById('search_author_name')
    if (searchIDBox.checked) {
        searchIdInput.style.display = 'block'
        searchNameInput.style.display = 'none'
        searchAuthorInput.style.display = 'none'
        showBooks()
    } else if (searchNameBox.checked) {
        searchNameInput.style.display = 'block'
        searchIdInput.style.display = 'none'
        searchAuthorInput.style.display = 'none'
        showBooks()
    } else if (searchAuthorBox.checked) {
        searchAuthorInput.style.display = 'block'
        searchNameInput.style.display = 'none'
        searchIdInput.style.display = 'none'
        showBooks()
    }
}



//SEARCH BOOK BY NAME FUNCTION
const searchBooksName = async () => {
    const searchBookCap = document.getElementById('search_book_name');
    const searchBook = searchBookCap.value.toLowerCase();

    const response = await axios.get(`${MY_SERVER}/search-books-name?search=${searchBook}`);
    const filteredData = response.data;


    //Checking if the input value exist in the database
    if (filteredData.some(book =>
        book.name.toLowerCase().includes(searchBook)
    )) {
        booksDisplay.innerHTML = `
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name of book</th>
                <th>Author</th>
                <th>Date of release</th>
                <th>Quantity</th>
                <th>Type</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            ${filteredData
                .map(
                    data => `
                        <tr>
                            <td>${data.id}</td>
                            <td>${data.name}</td>
                            <td>${data.author}</td>
                            <td>${data.date_published}</td>
                            <td>${data.quantity}</td>
                            <td>${data.type}</td>
                            <td>
                                <button onclick="openDele(${data.id})">Delete</button>
                                <button onclick="updateBook(${data.id})">Edit</button>
                            </td>
                        </tr>`
                )
                .join('')}
        </tbody>
    </table>`;
        searchMSG.innerHTML = ''; // Clear any previous "Book not found" message
    } else {
        // No books found, display a message
        booksDisplay.innerHTML = '';
        searchMSG.innerHTML = 'Book not found';
        searchMSG.style.color = 'red';
    }
}

//SEARCH BOOK BY AUTHOR NAME FUNCTION
const searchAuthorName = async () => {
    const searchBookCap = document.getElementById('search_author_name');
    const searchBook = searchBookCap.value.toLowerCase();

    const response = await axios.get(`${MY_SERVER}/search-books-name?search=${searchBook}`);
    const filteredData = response.data;


    //Checking if the input value exist in the database
    if (filteredData.some(book =>
        book.author.toLowerCase().includes(searchBook)
    )) {
        booksDisplay.innerHTML = `
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name of book</th>
                <th>Author</th>
                <th>Date of release</th>
                <th>Quantity</th>
                <th>Type</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            ${filteredData
                .map(
                    data => `
                        <tr>
                            <td>${data.id}</td>
                            <td>${data.name}</td>
                            <td>${data.author}</td>
                            <td>${data.date_published}</td>
                            <td>${data.quantity}</td>
                            <td>${data.type}</td>
                            <td>
                                <button onclick="openDele(${data.id})">Delete</button>
                                <button onclick="updateBook(${data.id})">Edit</button>
                            </td>
                        </tr>`
                )
                .join('')}
        </tbody>
    </table>`;
        searchMSG.innerHTML = ''; // Clear any previous "Book not found" message
    } else {
        // No books found, display a message
        booksDisplay.innerHTML = '';
        searchMSG.innerHTML = 'Book not found';
        searchMSG.style.color = 'red';
    }
}

//SEARCH BOOK BY ID FUNCTION
const searchBooksID = async () => {
    const searchBookCap = document.getElementById('search_book_id');
    const searchBook = searchBookCap.value;

    const response = await axios.get(`${MY_SERVER}/search-books-id?search=${searchBook}`);
    const filteredData = response.data;

    // Do something with the filtered data

    if (filteredData.some(book =>
        book.id.toString().includes(searchBook)
    )) {
        booksDisplay.innerHTML = `
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name of book</th>
                <th>Author</th>
                <th>Date of release</th>
                <th>Quantity</th>
                <th>Type</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            ${filteredData
                .map(
                    data => `
                        <tr>
                            <td>${data.id}</td>
                            <td>${data.name}</td>
                            <td>${data.author}</td>
                            <td>${data.date_published}</td>
                            <td>${data.quantity}</td>
                            <td>${data.type}</td>
                            <td>
                                <button onclick="openDele(${data.id})">Delete</button>
                                <button onclick="updateBook(${data.id})">Edit</button>
                            </td>
                        </tr>`
                )
                .join('')}
        </tbody>
    </table>`;
        searchMSG.innerHTML = ''; // Clear any previous "Book not found" message
    } else {
        // No books found, display a message
        booksDisplay.innerHTML = '';
        searchMSG.innerHTML = 'Book not found';
        searchMSG.style.color = 'red';
    }
}


//Popping an edit window
const openEdit = () => {
    const displayEdit = document.getElementById('editBookDisplay')
    displayEdit.style.display = 'block'
    document.body.style.backgroundColor = '#DCDCDC'
    document.body.style.overflow = 'hidden'
}

//Filling the inputs inside edit window, calling sumbitEdit function in a button
const updateBook = async (id) => {
    openEdit()
    //Declaring viralbes for inputs
    const bookName = document.getElementById('book_name')
    const author = document.getElementById('author_name')
    const dateReleased = document.getElementById('date_released')
    const bookQuantity = document.getElementById('quantity_book')
    const typeBook = document.getElementById('type_book')
    //Server virable
    const booksServer = await axios.get(MY_SERVER + '/show-books');
    const book = booksServer.data.find(data => data.id == id)
    //Entering values of data to inputs
    bookName.value = book.name
    author.value = book.author
    dateReleased.value = book.date_published
    bookQuantity.value = book.quantity
    typeBook.value = book.type

    const submitButton = document.getElementById('sumbitBook');
    submitButton.addEventListener('click', () => {
        submitEdit(id);
    });

}

//Updating the data from the input
const submitEdit = async (bookID) => {
    const bookName = document.getElementById('book_name').value;
    const author = document.getElementById('author_name').value;
    const dateReleased = document.getElementById('date_released').value;
    const bookQuantity = document.getElementById('quantity_book').value;
    const typeBook = document.getElementById('type_book').value;

    const data = {
        name: bookName,
        author: author,
        date_published: dateReleased,
        quantity: bookQuantity,
        type: typeBook
    };

    if (!bookName || !author || !dateReleased || !bookQuantity || !typeBook) {
        toastr.error('You must fill all the fileds!', 'Error')
    } else {
        await axios.put(MY_SERVER + '/books-update/' + bookID, data).then(() => {
        }).finally(() => {
            toastr.success('Book has been edited!', 'Success');
            showBooks()
        })
    }
};


//Closing the edit window
const closeEdit = () => {
    const displayEdit = document.getElementById('editBookDisplay')
    displayEdit.style.display = 'none'
    document.body.style.backgroundColor = '#fff'
    document.body.style.overflow = 'visible'
}

//Delete book functions
//Popping a warning window before deleting
const openDele = (id) => {
    const displayDele = document.getElementById('displayDelete')
    displayDele.style.display = 'block'
    document.body.style.backgroundColor = '#DCDCDC'
    document.body.style.overflow = 'hidden'
    const deleteButton = document.getElementById('yesBtn');
    deleteButton.setAttribute('data-id', id);
}

//Deleting the book and its called inside openDele in yesBtn
const deleteBook = async () => {
    const deleteButton = document.getElementById('yesBtn');
    const id = deleteButton.getAttribute('data-id');
    await axios.delete(`${MY_SERVER}/delete-book/${id}`).then(() => {
    }).finally(() => {
        toastr.success('Book has been deleted!', 'Success');
        showBooks()
    })
    
}

//Closing the window and its called in no button and the X icon that was taken from IconScout
const closeDele = () => {
    const displayDele = document.getElementById('displayDelete')
    displayDele.style.display = 'none'
    document.body.style.backgroundColor = '#fff'
    document.body.style.overflow = 'visible'
}

//Defining the toastr attritubes
toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}