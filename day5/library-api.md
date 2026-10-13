# Library API Design: Books Resource

## Endpoints

* List all books
  * Method: GET
  * Path: /books
  * Description: Retrieves a complete list of all books in the library.
  * Success Status Code: 200 OK

* Get one book
  * Method: GET
  * Path: /books/:id
  * Description: Retrieves the details of a specific book using its unique ID.
  * Success Status Code: 200 OK

* Create a new book
  * Method: POST
  * Path: /books
  * Description: Adds a newly published book to the library system.
  * Request Body: { "title": "New Book", "author": "John Doe", "year": 2026 }
  * Success Status Code: 201 Created

* Update a book
  * Method: PUT
  * Path: /books/:id
  * Description: Completely updates an existing book's details using its ID.
  * Request Body: { "title": "Updated Title", "author": "John Doe", "year": 2026 }
  * Success Status Code: 200 OK

* Delete a book
  * Method: DELETE
  * Path: /books/:id
  * Description: Removes a specific book from the library catalog using its ID.
  * Success Status Code: 204 No Content

* List books by an author
  * Method: GET
  * Path: /books?author=name
  * Description: Retrieves a filtered list of books written by a specific author.
  * Success Status Code: 200 OK

## Error Codes

* 400 Bad Request: Happens when the client sends invalid data. 
  * *Example:* A user attempts to create a new book using the POST /books endpoint but forgets to include the required "title" field in the JSON request body.
* 404 Not Found: Happens when the requested resource does not exist on the server.
  * *Example:* A user attempts to fetch a specific book using GET /books/999, but no book with the ID of 999 exists in the library database.