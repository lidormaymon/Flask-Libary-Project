const MY_SERVER = 'https://flask-libarly-sql-alchemy.onrender.com'
const showCustomers = async () => {
    customers = await axios.get(MY_SERVER + '/show-customers');

    //Displaying Customers data in a table
    customersDisplay.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name of customer</th>
                    <th>City</th>
                    <th>Age</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${customers.data.map(inf => `
                <tr>
                    <td>${inf.id}</td>
                    <td>${inf.name}</td>
                    <td>${inf.city}</td>
                    <td>${inf.age}</td>
                    <td><button onclick="openDele(${inf.id})">Delete</button>
                    <button onclick="updateCustomer(${inf.id})">Edit</button></td>
                </tr> `
    )
            .join("")}
            </tbody>
        </table>`
};

showCustomers()

//Counting the amount of customers there are to be displayed
const countCustomers = async () => {
    const count = await axios.get(MY_SERVER + '/show-customers')
    count_customers.innerHTML = `Customers record:${count.data.length}`
}

countCustomers()


//SEARCH CUSTOMERS FUNCTIONS
//CHECK BOX FUNCTION
const checkBox = () => {
        const searchIDBox = document.getElementById('searchIDBox')
        const searchNameBox = document.getElementById('searchNameBox')

        const searchIdInput = document.getElementById('search_customer_id')
        const searchNameInput = document.getElementById('search_customer_name')
        if (searchIDBox.checked) {
            showCustomers()
            searchIdInput.style.display = 'block'
            searchNameInput.style.display = 'none'
        }else if(searchNameBox.checked) {
            showCustomers()
            searchNameInput.style.display = 'block'
            searchIdInput.style.display = 'none'
        }}



//SEARCH CUSTOMER BY NAME
const searchCustomerName = async () => {
    const searchCustomerCap = document.getElementById('search_customer_name')
    const searchCustomer = searchCustomerCap.value.toLowerCase()

    const response = await axios.get(`${MY_SERVER}/search-customer-name?search=${searchCustomer}`);
    const filteredData = response.data

    if (filteredData.some(info =>
        info.name.toLowerCase().includes(searchCustomer))) {
        customersDisplay.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name of customer</th>
                    <th>City</th>
                    <th>Age</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${filteredData.map(inf => `
                <tr>
                    <td>${inf.id}</td>
                    <td>${inf.name}</td>
                    <td>${inf.city}</td>
                    <td>${inf.age}</td>
                    <td><button onclick="openDele(${inf.id})">Delete</button>
                    <button onclick="updateCustomer(${inf.id})">Edit</button></td>
                </tr> `
        )
                .join("")}
            </tbody>
        </table>`
        searchMSG.innerHTML = ''
    } else {
        customersDisplay.innerHTML = ''
        searchMSG.innerHTML = 'Customer not found'
        searchMSG.style.color = 'red'
    }
};

//SEARCH CUSTOMER BY id
const searchCustomerID = async () => {
    const searchCustomerCap = document.getElementById('search_customer_id')
    const searchCustomer = searchCustomerCap.value

    const response = await axios.get(`${MY_SERVER}/search-customer-id?search=${searchCustomer}`);
    const filteredData = response.data

    if (filteredData.some(customer =>
        customer.id.toString().includes(searchCustomer))) {
        customersDisplay.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name of customer</th>
                    <th>City</th>
                    <th>Age</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${filteredData.map(inf => `
                <tr>
                    <td>${inf.id}</td>
                    <td>${inf.name}</td>
                    <td>${inf.city}</td>
                    <td>${inf.age}</td>
                    <td><button onclick="openDele(${inf.id})">Delete</button>
                    <button onclick="updateCustomer(${inf.id})">Edit</button></td>
                </tr> `
        )
                .join("")}
            </tbody>
        </table>`
        searchMSG.innerHTML = ''
    } else {
        customersDisplay.innerHTML = ''
        searchMSG.innerHTML = 'Customer not found'
        searchMSG.style.color = 'red'
    }
};

//END OF SEARCH FUNCTIONS

//Updating customer functions
//Function for popping an edit window, it's begin called inside updateCustomer function
const openEdit = () => {
    const displayEdit = document.getElementById('editCustomerDisplay')
    displayEdit.style.display = 'block'
    document.body.style.backgroundColor = '#DCDCDC'
    document.body.style.overflow = 'hidden'
}

//A fucntion to fill the edit inputs with the actual data of the ID customer that was pressed
const updateCustomer = async (id) => {
    openEdit()
    //Declaring viralbes for inputs
    const customerName = document.getElementById('customer_name')
    const city = document.getElementById('customer_city')
    const age = document.getElementById('customer_age')
    //Server virable
    const customersServer = await axios.get(MY_SERVER + '/show-customers');
    const customer = customersServer.data.find(data => data.id == id)
    //Entering values of data to inputs
    customerName.value = customer.name
    city.value = customer.city
    age.value = customer.age


    const submitButton = document.getElementById('sumbitCustomer');
    submitButton.addEventListener('click', () => {
        submitEdit(id);
    });

}

//Function tu sumbit the edit and actually updating it by using put
const submitEdit = async (bookID) => {
    const customerName = document.getElementById('customer_name').value
    const city = document.getElementById('customer_city').value
    const age = document.getElementById('customer_age').value

    const data = {
        name: customerName,
        city: city,
        age: age
    };

    if (!customerName || !city || !age) {
        toastr.error('Must fill all the fields!', 'Error')
    }else{
        await axios.put(MY_SERVER + '/customers-update/' + bookID, data).then(() => {
        console.log(data)
        }).finally(() => {
         toastr.success('Customer has been edited!', 'Success');
        })
    }
};

//Closing the edit window
const closeEdit = () => {
    const displayEdit = document.getElementById('editCustomerDisplay')
    displayEdit.style.display = 'none'
    document.body.style.backgroundColor = '#fff'
    document.body.style.overflow = 'visible'
}
//End of edit functions


//Functions of deleting customer
//Opening the wanrning window before deleting
const openDele = (id) => {
        const displayDele = document.getElementById('displayDelete')
        displayDele.style.display = 'block'
        document.body.style.backgroundColor = '#DCDCDC'
        document.body.style.overflow = 'hidden'
        const deleteButton = document.getElementById('yesBtn');
        deleteButton.setAttribute('data-id', id);
    }

//Function to delete the customer and its begin called in yesBtn
const deleteCustomer = async () => {
    const deleteButton = document.getElementById('yesBtn');
    const id = deleteButton.getAttribute('data-id');
    await axios.delete(`${MY_SERVER}/delete-customer/${id}`).then(() => {
        console.log(data)
        }).finally(() => {
         toastr.success('Customer has been deleted!', 'Success');
        })
    showCustomers()
}

//Fucntion to close the warning window
const closeDele = () => {
    const displayDele = document.getElementById('displayDelete')
    displayDele.style.display = 'none'
    document.body.style.backgroundColor = '#fff'
    document.body.style.overflow = 'visible'
}

//Defining the toastr attritubtes
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