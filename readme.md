# Library Management System

This project is a Library Management System built with Node.js, Express, TypeScript, TypeORM, PostgreSQL, and Redis.

## Concurrency Control and Data Integrity

This project implements a robust concurrency control mechanism and ensures data integrity through the following features:

### Distributed Locking with Redis

- Utilizes Redis for distributed locking to prevent race conditions during book borrowing operations.
- Implements a lock-acquire mechanism on a per-book basis, ensuring that only one transaction can process a specific book at a time.
- The lock is maintained in Redis memory, providing low-latency access and release operations.

### Transactional Integrity

- Employs database transactions to maintain ACID (Atomicity, Consistency, Isolation, Durability) properties during critical operations.
- Implements a rollback mechanism to revert all changes in case of any failure during the transaction, ensuring data consistency.

### Process Flow

1. When a book borrowing request is initiated, the system first attempts to acquire a distributed lock for the specific book using Redis.
2. If the lock is successfully acquired, a database transaction is started.
3. Within the transaction, the system performs the necessary checks and updates (e.g., checking book availability, updating book status, creating borrowing record).
4. If any step within the transaction fails, a rollback is triggered, reverting all changes made during the transaction.
5. Upon successful completion of the transaction, the changes are committed to the database.
6. Finally, the distributed lock in Redis is released, allowing other operations on the same book to proceed.

This approach ensures that the book inventory is accurately maintained even under high concurrency scenarios, preventing issues such as overbooking or inconsistent state between the book and borrowing records.

## Prerequisites

- Docker
- Docker Compose

## Getting Started

Follow these steps to get the project up and running on your local machine:

1. Clone the repository:

```bash
$ git clone https://github.com/mertcatili/Library.git
```

2. Create a `.env` file in the root directory and add the following environment variables:

   ```bash
   JWT_SECRET="library_management"
   ENABLE_AUTH="0"
   PORT="3000"
   LOG_LEVEL="info"
   REDIS_HOST="redis"
   REDIS_PORT="6379"
   DB_HOST="db"
   DB_PORT="5432"
   DB_USERNAME="admin"
   DB_PASSWORD="123"
   DB_NAME="library"
   ```

3. Build and start the Docker containers:

```bash
$ docker-compose up --build
```

   This command will build the Docker image for the application and start the containers for the app, PostgreSQL database, and Redis.

4. The application should now be running and accessible at `http://localhost:3000`.

## API Endpoints

- `POST /users`: Create a new user
- `GET /users`: Get all users
- `GET /users/:id`: Get a user by ID
- `POST /users/:userId/borrow/:bookId`: Borrow a book
- `POST /users/:userId/return/:bookId`: Return a book
- `GET /books`: Get all books
- `GET /books/:id`: Get a book by ID
- `POST /books`: Create a new book

## Running Tests

To run the tests, use the following command:

```bash
$ npm test
```

## Database DDL's

```sql
CREATE TABLE public.books (
	id serial4 NOT NULL,
	"name" varchar(100) NOT NULL,
	"isActive" bool NOT NULL DEFAULT true,
	CONSTRAINT "PK_f3f2f25a099d24e12545b70b022" PRIMARY KEY (id)
);

CREATE TABLE public.users (
	id serial4 NOT NULL,
	"firstName" varchar(100) NOT NULL,
	"lastName" varchar(100) NOT NULL,
	CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id)
);

CREATE TABLE public.borrowings (
	id serial4 NOT NULL,
	"borrowDate" timestamp NOT NULL,
	"returnDate" timestamp NULL,
	"userId" int4 NULL,
	"bookId" int4 NULL,
	score numeric(3, 2) NULL,
	CONSTRAINT "PK_5da0d5a9a91e8c386e1f6812db2" PRIMARY KEY (id)
);

ALTER TABLE public.borrowings ADD CONSTRAINT "FK_151ca9466056600f08958b3432d" FOREIGN KEY ("userId") REFERENCES public.users(id);
ALTER TABLE public.borrowings ADD CONSTRAINT "FK_5da2b7ee3b60c381d4bbdb50668" FOREIGN KEY ("bookId") REFERENCES public.books(id);
```
## Database Schema

![Database Schema](./docs/images/library-schema.png)