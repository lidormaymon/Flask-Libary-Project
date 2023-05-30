const MY_SERVER = 'https://flask-libarly-sql-alchemy.onrender.com'
const showLoans = async () => {
const loansResponse = await axios.get(MY_SERVER + '/show-loans');
const loansData = loansResponse.data;

const activeLoans = loansData.filter((loan) => loan.status === 'Active');

const loansDisplay = document.getElementById('loansDisplay');
loansDisplay.innerHTML = `
<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Customer Name</th>
            <th>Book Name</th>
            <th>Loan Date</th>
            <th>Return Date</th>
            <th>Action</th>
        </tr>
    </thead>
<tbody>
${activeLoans.map((loan) => `
  <tr>
    <td>${loan.id}</td>
    <td>${loan.customer_name}</td>
    <td>${loan.book_name}</td>
    <td>${loan.loandate}</td>
    <td>${loan.returndate}</td>
    <td>
      <button onclick="openReturnDisplay(${loan.id})">Return</button>
      <button onclick="updateLoan(${loan.id})">Edit</button>
    </td>
  </tr>
`).join("")}
</tbody>
</table>`;
};


showLoans()




//SEARCH LOANS FUNCTION
    //CHECKBOX FUNCTIONS
    const checkBox = () => {
        const searchCustomerBox = document.getElementById('searchCustomerBox')
        const searchBookBox = document.getElementById('searchBookBox')

        const searchBook = document.getElementById('search-loan-book')
        const searchCustomer = document.getElementById('search-loan-customer')
        if (searchCustomerBox.checked) {
            searchBook.style.display = 'none'
            searchCustomer.style.display = 'block'
            showLoans()
        }else if(searchBookBox.checked) {
            searchCustomer.style.display = 'none'
            searchBook.style.display = 'block'
            showLoans()
        }}

    
    //Searching cucstomer function
    const searchLoanCustomer = async () => {
        const searchCustomerCap = document.getElementById('search-loan-customer');
        const searchCustomer = searchCustomerCap.value.toLowerCase();
        const response = await axios.get(`${MY_SERVER}/search-active-loan-customer?search=${searchCustomer}`);
        const filteredData = response.data;

        
        //Checking if the input value exist in the database
        if (filteredData.some(loan =>
            loan.customername.toLowerCase().includes(searchCustomer)
        )) {
            loansDisplay.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Customer Name</th>
                    <th>Book Name</th>
                    <th>Loan Date</th>
                    <th>Return Date</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${filteredData
                    .map(
                        data => `
                            <tr>
                                <td>${data.id}</td>
                                <td>${data.customername}</td>
                                <td>${data.bookname}</td>
                                <td>${data.loandate}</td>
                                <td>${data.returndate}</td>

                                <td>
                                    <button onclick="openDele(${data.id})">Return</button>
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
            loansDisplay.innerHTML = '';
            searchMSG.innerHTML = 'Customer not found';
            searchMSG.style.color = 'red';
        }
    }

    //Search book function
    const searchLoanBook = async () => {
        const searchBookCap = document.getElementById('search-loan-book');
        const searchBook = searchBookCap.value.toLowerCase();

        const response = await axios.get(`${MY_SERVER}/search-loan-book?search=${searchBook}`);
        const filteredData = response.data;

        
        //Checking if the input value exist in the database
        if (filteredData.some(loan =>
            loan.bookname.toLowerCase().includes(searchBook)
        )) {
            loansDisplay.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Customer Name</th>
                    <th>Book Name</th>
                    <th>Loan Date</th>
                    <th>Return Date</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${filteredData
                    .map(
                        data => `
                            <tr>
                                <td>${data.id}</td>
                                <td>${data.customername}</td>
                                <td>${data.bookname}</td>
                                <td>${data.loandate}</td>
                                <td>${data.returndate}</td>
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
            loansDisplay.innerHTML = '';
            searchMSG.innerHTML = 'Book not found';
            searchMSG.style.color = 'red';
        }
    }



const openEdit = () => {
    const displayEdit = document.getElementById('editLoanDisplay')
    displayEdit.style.display = 'block'
    document.body.style.backgroundColor = '#DCDCDC'
}

const updateLoan = async (id) => {
    openEdit()
    //Declaring viralbes for inputs
    const customerName = document.getElementById('customer_id')
    const bookName = document.getElementById('book_id')
    const loanDate = document.getElementById('loan_date')
    const returnDate = document.getElementById('return_date')
    //Server virable
    const loansServer = await axios.get(MY_SERVER + '/show-loans');
    const loan = loansServer.data.find(data => data.id == id)
    //Entering values of data to inputs
    customerName.value = loan.custid
    bookName.value = loan.bookid
    loanDate.value = loan.loandate
    returnDate.value = loan.returndate


    const submitButton = document.getElementById('sumbitLoan');
    submitButton.addEventListener('click', () => {
        submitEdit(id);
    });

}

const submitEdit = async (loanID) => {
    const customerID = document.getElementById('customer_id').value
    const bookID = document.getElementById('book_id').value
    const loanDate = document.getElementById('loan_date').value
    const returnDate = document.getElementById('return_date').value

    const data = {
        custid: customerID,
        bookid: bookID,
        loandate: loanDate,
        returndate:returnDate,
        status:'Active'
    };

    const booksServer = await axios.get(`${MY_SERVER}/show-books`);
    const customersServer = await axios.get(MY_SERVER + '/show-customers');
    const custData = customersServer.data;
    const booksData = booksServer.data;

    if (!customerID || !bookID || !loanDate || !returnDate) {
        toastr.error('Must fill all the fields!', 'Error')
    }if (custData.some(customer => customer.id == customerID) && booksData.some(book => book.id == bookID)) {
        await axios.put(MY_SERVER + '/loans-update/' + loanID, data).then(() => {
        console.log(data)
        }).finally(() => {
         toastr.success('Loan has been edited!', 'Success');
        })
    }else{
        toastr.error('Book ID or Customer ID do not exist!', 'Error')
    }
};


const closeEdit = () => {
    const displayEdit = document.getElementById('editLoanDisplay')
    displayEdit.style.display = 'none'
    document.body.style.backgroundColor = '#fff'
}

const openReturnDisplay = (id) => {
        const displayDele = document.getElementById('displayDelete')
        displayDele.style.display = 'block'
        document.body.style.backgroundColor = '#DCDCDC'
        document.body.style.overflow = 'hidden'
        const deleteButton = document.getElementById('yesBtn');
        deleteButton.setAttribute('data-id', id);
    }

const returnLoan = async () => {
    const deleteButton = document.getElementById('yesBtn');
    const id = deleteButton.getAttribute('data-id');
    const loansData = await axios.get(MY_SERVER + '/show-loans');
    const loan = loansData.data.find(data => data.id == id);
    const data = {
        custid: loan.custid,
        bookid: loan.bookid,
        loandate: loan.loandate,
        returndate: loan.returndate,
        status: 'Returned'
    };
    updateQuantity(loan.bookid);
    await axios.put(MY_SERVER + '/loans-update/' + id, data).then(() => {
                    console.log(data)
                }).finally(() => {
                    toastr.success('Book has been returned successfully!', 'Success');
                })
    
}

const updateQuantity = async (bookID) => {
    const booksData = await axios.get(MY_SERVER + '/show-books');
    const book = booksData.data.find(data => data.id === bookID);
    const bookQuantity = book.quantity;
    console.log(bookQuantity);
    const updatedQuantity = bookQuantity + 1; // Updating the quantity

    const data = {
        name: book.name,
        author: book.author,
        date_published: book.date_published,
        quantity: updatedQuantity,
        type: book.type
    };

    await axios.put(MY_SERVER + '/books-update/' + bookID, data);
};

const closeDele = () => {
    const displayDele = document.getElementById('displayDelete')
    displayDele.style.display = 'none'
    document.body.style.backgroundColor = '#fff'
    document.body.style.overflow = 'visible'
}

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