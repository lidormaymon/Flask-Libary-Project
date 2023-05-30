const MY_SERVER = 'https://flask-libarly-sql-alchemy.onrender.com';

//Function that adds book to the database
const addBook = async () => {
    const name = document.getElementById('name').value;
    const author = document.getElementById('author').value;
    const yearPublish = document.getElementById('year_publish').value;
    const typeBook = document.getElementById('type_book').value;
    const quantityBooks = document.getElementById('quantity_books').value;

    const response = await axios.get(MY_SERVER + '/show-books');
    const book = response.data.find(data => data.name === name);

    const data = {
        name: name,
        author: author,
        date_published: yearPublish,
        type: typeBook,
        quantity: quantityBooks
    };

    if (!name || !author || !yearPublish || !typeBook || !quantityBooks) {
        toastr.error('Please fill in all fields!', 'Error');
    } else if (book) {
        toastr.error('Book already exists!', 'Error');
    } else {
        try {
            await axios.post(`${MY_SERVER}/add-book`, data).then(() => {
        console.log(data)
        }).finally(() => {
         toastr.success('Customer added successfully!', 'Success');
        })
            ;
        } catch (error) {
            toastr.error('An error occurred while adding the book!', 'Error');
        }
    }
};

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