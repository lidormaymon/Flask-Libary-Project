const MY_SERVER = 'https://flask-libarly-sql-alchemy.onrender.com'
const showLoans = async () => {
    const loansResponse = await axios.get(MY_SERVER + '/show-loans');
    const loansData = loansResponse.data;

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
            <th>Status</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        ${loansData.map((loan) => `
            <tr>
                <td>${loan.id}</td>
                <td>${loan.customer_name}</td>
                <td>${loan.book_name}</td>
                <td>${loan.loandate}</td>
                <td>${loan.returndate}</td>
                <td>${loan.status}</td>
                <td><button onclick="openDele(${loan.id})">Delete</button></td>
        `).join("")}
    </tbody>
</table>`
};


showLoans()

const countLoans = async () => {
    const count = await axios.get(MY_SERVER + '/show-loans')
    count_loans.innerHTML = `Loans record:${count.data.length}`
}

countLoans()


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
    } else if (searchBookBox.checked) {
        searchCustomer.style.display = 'none'
        searchBook.style.display = 'block'
        showLoans()
    }
}


//Searching cucstomer function
const searchLoanCustomer = async () => {
    const searchCustomerCap = document.getElementById('search-loan-customer');
    const searchCustomer = searchCustomerCap.value.toLowerCase();
    const response = await axios.get(`${MY_SERVER}/search-loan-customer?search=${searchCustomer}`);
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
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${filteredData
                .map(
                    loan => `
                            <tr>
                                <td>${loan.id}</td>
                                <td>${loan.customername}</td>
                                <td>${loan.bookname}</td>
                                <td>${loan.loandate}</td>
                                <td>${loan.returndate}</td>
                                <td>${loan.status}</td>
                                <td><button onclick="openDele(${loan.id})">Delete</button></td>
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
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${filteredData
                .map(
                    loan => `
                            <tr>
                                <td>${loan.id}</td>
                                <td>${loan.customername}</td>
                                <td>${loan.bookname}</td>
                                <td>${loan.loandate}</td>
                                <td>${loan.returndate}</td>
                                <td>${loan.status}</td>
                                <td><button onclick="openDele(${loan.id})">Delete</button></td>
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

//Delete loan functions
//Popping a warning window before deleting
const openDele = (id) => {
    const displayDele = document.getElementById('displayDelete')
    displayDele.style.display = 'block'
    document.body.style.backgroundColor = '#DCDCDC'
    document.body.style.overflow = 'hidden'
    const deleteButton = document.getElementById('yesBtn');
    deleteButton.setAttribute('data-id', id);
}

//Deleting the loan and its called inside openDele in yesBtn
const deleteLoan = async () => {
    const deleteButton = document.getElementById('yesBtn');
    const id = deleteButton.getAttribute('data-id');
    await axios.delete(`${MY_SERVER}/delete-loan/${id}`).then(() => {
    }).finally(() => {
        toastr.success('Loan has been deleted!', 'Success');
    })
    showBooks()
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