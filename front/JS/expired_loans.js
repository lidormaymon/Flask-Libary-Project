const MY_SERVER = 'https://flask-libarly-sql-alchemy.onrender.com'
const currentDate = new Date();
const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
const currentDateFormat = currentDate.toLocaleDateString('en-GB', options);
console.log(currentDateFormat);

//Function to display all the loans that passed their return date
const showExpiredLoans = async () => {
    loans = await axios.get(MY_SERVER + '/show-expired-loans');
    display.innerHTML = `
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
                ${loans.data.map(data => `
                <tr>
                    <td>${data.id}</td>
                    <td>${data.customer_name}</td>
                    <td>${data.book_name}</td>
                    <td>${data.loandate}</td>
                    <td>${data.returndate}</td>
                    <td><button onclick="openReturnDisplay(${data.id})">Return</button>
                    <button onclick="updateLoan(${data.id})">Edit</button></td>
                </tr> `
    )
            .join("")}
            </tbody>
        </table>`
};

showExpiredLoans()

//Update loans functions
//Popping an edit window
const openEdit = () => {
    const displayEdit = document.getElementById('editLoanDisplay')
    displayEdit.style.display = 'block'
    document.body.style.backgroundColor = '#DCDCDC'
}

//Filling the inputs with the actual data of the loanID
const updateLoan = async (id) => {
    openEdit()
    //Declaring viralbes for inputs
    const customerID = document.getElementById('customer_id')
    const bookID = document.getElementById('book_id')
    const loanDate = document.getElementById('loan_date')
    const returnDate = document.getElementById('return_date')
    //Server virable
    const loansServer = await axios.get(MY_SERVER + '/show-loans');
    const loan = loansServer.data.find(data => data.id == id)
    //Entering values of data to inputs
    customerID.value = loan.custid
    bookID.value = loan.bookid
    loanDate.value = loan.loandate
    returnDate.value = loan.returndate


    const submitButton = document.getElementById('sumbitLoan');
    submitButton.addEventListener('click', () => {
        submitEdit(id);
    });

}

//Updating the data by put method
const submitEdit = async (loanID) => {
    const customerID = document.getElementById('customer_id').value
    const bookID = document.getElementById('book_id').value
    const loanDate = document.getElementById('loan_date').value
    const returnDate = document.getElementById('return_date').value

    const data = {
        custid: customerID,
        bookid: bookID,
        loandate: loanDate,
        returndate:returnDate
    };

    if (!customerID || !bookID || !loanDate || !returnDate) {
        toastr.error('Must fill all the fields', 'Error')
    }else {
        await axios.put(MY_SERVER + '/loans-update/' + loanID, data).then(() => {
        console.log(data)
        }).finally(() => {
         toastr.success('Loan has been edited!', 'Success');
        })
    }
};


//Closing the edit window
const closeEdit = () => {
    const displayEdit = document.getElementById('editLoanDisplay')
    displayEdit.style.display = 'none'
    document.body.style.backgroundColor = '#fff'
}

//Popping warning window before deleting the loan
const openReturnDisplay = (id) => {
        const displayDele = document.getElementById('displayDelete')
        displayDele.style.display = 'block'
        document.body.style.backgroundColor = '#DCDCDC'
        document.body.style.overflow = 'hidden'
        const deleteButton = document.getElementById('yesBtn');
        deleteButton.setAttribute('data-id', id);
    }

//Deleting the loan, its begin called in yesBtn
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

//Updating the quantintity of the book the was returned in Books by +1 as it was returned
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

//Closing the warning window
const closeDele = () => {
    const displayDele = document.getElementById('displayDelete')
    displayDele.style.display = 'none'
    document.body.style.backgroundColor = '#fff'
    document.body.style.overflow = 'visible'
}