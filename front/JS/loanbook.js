const MY_SERVER = 'https://flask-libarly-sql-alchemy.onrender.com';

const addLoan = async () => {
    const custID = document.getElementById('custID').value;
    const bookID = document.getElementById('bookID').value;
    const loanDateStr = document.getElementById('loanDate').value;

    if (!custID || !bookID || !loanDateStr) {
        toastr.error('Please fill in all fields!', 'Error');
        return;
    }

    // Validate the date format
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(loanDateStr)) {
        toastr.error('Invalid date format! Please use DD/MM/YYYY.', 'Error');
        return;
    }

    const [day, month, year] = loanDateStr.split('/').map(Number);

    // Check if the day, month, and year are valid
    const isValidDate = (day > 0 && day <= 31) && (month > 0 && month <= 12) && (year > 0 && year <= 2023);
    if (!isValidDate) {
        toastr.error('Invalid date! Please enter a valid day, month, and year.', 'Error');
        return;
    }

    const loanDate = new Date(year, month - 1, day);
    const currentDate = new Date();

    if (loanDate > currentDate) {
        toastr.error('Invalid date! The loan date cannot be in the future.', 'Error');
        return;
    }

    const booksServer = await axios.get(`${MY_SERVER}/show-books`);
    const customersServer = await axios.get(MY_SERVER + '/show-customers');
    const custData = customersServer.data;
    const booksData = booksServer.data;

    if (custData.some(customer => customer.id == custID) && booksData.some(book => book.id == bookID)) {
        console.log(`BookID ${bookID} and CustID ${custID} exist`);

        const bookType = booksData.find(book => book.id == bookID).type;
        const bookQuantity = booksData.find(book => book.id == bookID).quantity;
        console.log(bookQuantity);
        console.log(bookType);

        const [day, month, year] = loanDateStr.split('/').map(Number);
        const loanDate = new Date(year, month - 1, day);
        const formattedDate = loanDate.toLocaleDateString('en-GB');
        const returnDate = new Date(loanDate);
        if (bookQuantity > 0) {
            if (bookType == 1) {
                console.log('works');
                returnDate.setDate(loanDate.getDate() + 10);
                const formattedReturnDate = returnDate.toLocaleDateString('en-GB');
                const data = {
                    custid: custID,
                    bookid: bookID,
                    loandate: formattedDate,
                    returndate: formattedReturnDate,
                    status: 'Active'
                };
                await axios.post(MY_SERVER + "/add-loan", data).then(() => {
                    console.log(data)
                }).finally(() => {
                    toastr.success('Customer added successfully!', 'Success');
                })
                updateQuantity();
            } else if (bookType == 2) {
                console.log('works');
                returnDate.setDate(loanDate.getDate() + 5);
                const formattedReturnDate = returnDate.toLocaleDateString('en-GB');
                const data = {
                    custid: custID,
                    bookid: bookID,
                    loandate: formattedDate,
                    returndate: formattedReturnDate,
                    status: 'Active'
                };
                await axios.post(MY_SERVER + "/add-loan", data).then(() => {
                    console.log(data)
                }).finally(() => {
                    toastr.success('Customer added successfully!', 'Success');
                })
                updateQuantity();
            } else if (bookType == 3) {
                console.log('works');
                returnDate.setDate(loanDate.getDate() + 2);
                const formattedReturnDate = returnDate.toLocaleDateString('en-GB');
                const data = {
                    custid: custID,
                    bookid: bookID,
                    loandate: formattedDate,
                    returndate: formattedReturnDate,
                    status: 'Active'
                };
                await axios.post(MY_SERVER + "/add-loan", data).then(() => {
                    console.log(data)
                }).finally(() => {
                    toastr.success('Customer added successfully!', 'Success');
                })
                updateQuantity();
            }
        } else {
            toastr.error('Out of books!', 'Error')
        }
    } else {
        console.log('Book ID and custID do not exist');
        toastr.error('Book ID or CustID do not exist!', 'Error');
    }
};



const updateQuantity = async () => {
    const bookID = document.getElementById('bookID').value;
    const booksData = await axios.get(MY_SERVER + '/show-books');
    const book = booksData.data[bookID - 1];
    const bookQuantity = booksData.data[bookID - 1].quantity//doing -1 because in lists index always start as 1
    const updatedQuantity = bookQuantity - 1 //Updating the quantity

    const data = {
        name: book.name,
        author: book.author,
        date_published: book.date_published,
        quantity: updatedQuantity,
        type: book.type
    };

    await axios.put(MY_SERVER + '/books-update/' + bookID, data);
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