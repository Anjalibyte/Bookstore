let allBooks = [];

// ===============================
// HOME PAGE - LOAD BOOKS
// ===============================

const bookList = document.getElementById("bookList");

if (bookList) {

    fetch("/api/books")
        .then(response => response.json())
        .then(books => {
            allBooks = books;
            displayBooks(allBooks);
        })
        .catch(error => {
            console.error("Error loading books:", error);
        });
}

function displayBooks(books) {

    const bookList = document.getElementById("bookList");

    if (!bookList) {
        return;
    }

    bookList.innerHTML = "";

    books.forEach(book => {

        const bookDiv = document.createElement("div");

        bookDiv.innerHTML = `
            <h2>${book.title}</h2>
            <p>Author: ${book.author}</p>
            <p>Price: ₹${book.price}</p>
            <p>${book.description}</p>

            <button onclick="viewBook(${book.id})">
                View Details
            </button>

            <hr>
        `;

        bookList.appendChild(bookDiv);
    });
}


// ===============================
// SEARCH BOOKS
// ===============================

const searchInput = document.getElementById("searchInput");

function searchBooks() {

    const searchText = searchInput.value.toLowerCase().trim();

    const filteredBooks = allBooks.filter(book =>
        book.title.toLowerCase().includes(searchText) ||
        book.author.toLowerCase().includes(searchText)
    );

    displayBooks(filteredBooks);
}

if (searchInput) {
    searchInput.addEventListener("input", searchBooks);
}


// ===============================
// VIEW BOOK DETAILS
// ===============================

function viewBook(id) {
    window.location.href = "book.html?id=" + id;
}


// ===============================
// BOOK DETAILS PAGE
// ===============================

const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

const bookDetails = document.getElementById("bookDetails");

if (bookId && bookDetails) {

    fetch("/api/books/" + bookId)
        .then(response => response.json())
        .then(book => {

            bookDetails.innerHTML =
                "<h2>" + book.title + "</h2>" +
                "<p>Author: " + book.author + "</p>" +
                "<p>Price: ₹" + book.price + "</p>" +
                "<p>" + book.description + "</p>" +
                "<button onclick=\"addToCart(" + book.id + ")\">Add to Cart</button>";
        })
        .catch(error => {
            console.error("Error loading book details:", error);
        });
}


// ===============================
// ADD TO CART
// ===============================

function addToCart(id) {

    fetch("/api/cart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            bookId: id,
            quantity: 1
        })
    })
        .then(response => response.json())
        .then(cart => {

            alert("Book added to cart!");
            window.location.href = "cart.html";
        })
        .catch(error => {

            console.error(error);
            alert("Unable to add book to cart.");
        });
}


// ===============================
// CART PAGE
// ===============================

const cartList = document.getElementById("cartList");

if (cartList) {

    fetch("/api/cart")
        .then(response => response.json())
        .then(cartItems => {

            cartList.innerHTML = "";

            if (cartItems.length === 0) {

                cartList.innerHTML = "<p>Your cart is empty.</p>";

                document.getElementById("totalPrice").innerText =
                    "Total: ₹0";

                return;
            }

            let total = 0;

            cartItems.forEach(cartItem => {

                fetch("/api/books/" + cartItem.bookId)
                    .then(response => response.json())
                    .then(book => {

                        total += book.price * cartItem.quantity;

                        const item = document.createElement("div");

                        item.innerHTML =
                            "<h2>" + book.title + "</h2>" +
                            "<p>Author: " + book.author + "</p>" +
                            "<p>Price: ₹" + book.price + "</p>" +
                            "<p>Quantity: " + cartItem.quantity + "</p>";

                        const removeButton =
                            document.createElement("button");

                        removeButton.type = "button";
                        removeButton.innerText = "Remove";

                        removeButton.onclick = function () {
                            removeFromCart(cartItem.id);
                        };

                        item.appendChild(removeButton);

                        const line = document.createElement("hr");

                        item.appendChild(line);

                        cartList.appendChild(item);

                        document.getElementById("totalPrice").innerText =
                            "Total: ₹" + total;
                    });
            });
        })
        .catch(error => {
            console.error("Error loading cart:", error);
        });
}


// ===============================
// REMOVE FROM CART
// ===============================

function removeFromCart(cartId) {

    fetch("/api/cart/" + cartId, {
        method: "DELETE"
    })
        .then(response => {

            if (!response.ok) {
                throw new Error("Delete failed");
            }

            window.location.reload();
        })
        .catch(error => {

            console.error(error);
            alert("Unable to remove book from cart.");
        });
}


// ===============================
// GO TO CHECKOUT
// ===============================

function goToCheckout() {

    window.location.href = "checkout.html";
}


// ===============================
// CHECKOUT PAGE
// ===============================

const checkoutDetails =
    document.getElementById("checkoutDetails");

if (checkoutDetails) {

    fetch("/api/cart")
        .then(response => response.json())
        .then(cartItems => {

            if (cartItems.length === 0) {

                checkoutDetails.innerHTML =
                    "<p>Your cart is empty.</p>";

                return;
            }

            let total = 0;

            const requests = cartItems.map(cartItem => {

                return fetch("/api/books/" + cartItem.bookId)
                    .then(response => response.json())
                    .then(book => {

                        total += book.price * cartItem.quantity;

                        return book;
                    });
            });

            Promise.all(requests)
                .then(books => {

                    let html = "";

                    books.forEach(book => {

                        html +=
                            "<h2>" + book.title + "</h2>" +
                            "<p>Price: ₹" + book.price + "</p>";
                    });

                    html += "<h2>Total: ₹" + total + "</h2>";

                    checkoutDetails.innerHTML = html;
                });
        });
}


// ===============================
// CONFIRM ORDER
// ===============================

function confirmOrder() {

    fetch("/api/cart")
        .then(response => response.json())
        .then(cartItems => {

            if (cartItems.length === 0) {

                alert("Your cart is empty!");
                return;
            }

            let total = 0;

            const bookRequests = cartItems.map(cartItem =>

                fetch("/api/books/" + cartItem.bookId)
                    .then(response => response.json())
                    .then(book => {

                        total += book.price *
                            cartItem.quantity;
                    })
            );

            return Promise.all(bookRequests)
                .then(() => {

                    return fetch("/api/orders", {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            totalPrice: total,
                            status: "CONFIRMED"
                        })
                    });
                })
                .then(response => response.json())
                .then(order => {

                    const deleteRequests =
                        cartItems.map(cartItem =>

                            fetch(
                                "/api/cart/" + cartItem.id,
                                {
                                    method: "DELETE"
                                }
                            )
                        );

                    return Promise.all(deleteRequests)
                        .then(() => order);
                });
        })
        .then(order => {

            if (!order) {
                return;
            }

            alert(
                "Order confirmed successfully!\n" +
                "Order ID: " + order.id +
                "\nTotal: ₹" + order.totalPrice
            );

            window.location.href = "index.html";
        })
        .catch(error => {

            console.error(error);
            alert("Unable to place order.");
        });
}


// ===============================
// LOGIN
// ===============================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value;

        const password =
            document.getElementById("loginPassword").value;

        if (email && password) {

            fetch("/api/users/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
                .then(response => response.text())
                .then(user => {

                    if (user && user !== "null") {

                        document.getElementById(
                            "loginMessage"
                        ).innerText =
                            "Login successful!";

                    } else {

                        document.getElementById(
                            "loginMessage"
                        ).innerText =
                            "Invalid email or password!";
                    }
                })
                .catch(error => {

                    console.error(error);

                    document.getElementById(
                        "loginMessage"
                    ).innerText =
                        "Login failed. Please try again.";
                });
        }
    });
}


// ===============================
// SIGNUP
// ===============================

const signupForm =
    document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name =
            document.getElementById("signupName").value;

        const email =
            document.getElementById("signupEmail").value;

        const password =
            document.getElementById("signupPassword").value;

        if (name && email && password) {

            fetch("/api/users/signup", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            })
                .then(response => response.text())
                .then(user => {

                    if (user && user !== "null") {

                        document.getElementById("signupMessage").innerText =
                            "Signup successful!";

                    } else {

                        document.getElementById("signupMessage").innerText =
                            "Email already registered!";
                    }
                })
                .catch(error => {

                    console.error(error);

                    document.getElementById(
                        "signupMessage"
                    ).innerText =
                        "Signup failed. Please try again.";
                });
        }
    });
}