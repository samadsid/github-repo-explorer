# GitHub Commits Explorer

A full-stack web application that allows users to explore the commit history of any public GitHub repository. Users can search for a repository, browse its commits with server-side pagination, filter commits by author, and view comments associated with individual commits.

The application follows a layered backend architecture with clear separation of concerns and a modern React frontend. It is fully containerized with Docker, providing separate development and production environments.

## Features

* Search any public GitHub repository by owner and repository name.
* Browse repository commits with server-side pagination.
* Filter commits by author.
* View comments for individual commits.
* Retrieve repository authors dynamically from the GitHub API.
* Pagination powered by GitHub Link headers.
* Strongly typed APIs using TypeScript.
* Clean layered backend architecture.
* Responsive user interface built with Material UI.
* Multi-stage Docker builds for optimized production deployment.
* Separate Docker Compose configurations for development and production environments.


## Tech Stack

### Backend

* Node.js
* Express.js
* TypeScript
* Axios
* GitHub REST API

### Frontend

* React
* TypeScript
* Vite
* Material UI
* Axios

### DevOps

* Docker
* Docker Compose
* Nginx

---

## Architecture

### High-Level Architecture

```text
┌─────────────────┐
│     Browser     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ React Frontend  │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│ Express Backend │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub REST API │
└─────────────────┘
```

### Backend Request Flow

The backend follows a layered architecture to keep responsibilities well separated and the codebase maintainable.

```text
Client Request
      │
      ▼
Routes
      │
      ▼
Middlewares
      │
      ▼
Controllers
      │
      ▼
Services
      │
      ▼
GitHub REST API
```

### Layer Responsibilities

| Layer       | Responsibility                                                                  |
| ----------- | ------------------------------------------------------------------------------- |
| Routes      | Define API endpoints and map requests to controllers.                           |
| Middlewares | Validate route parameters and query parameters before processing requests.      |
| Controllers | Handle HTTP requests and responses while delegating business logic to services. |
| Services    | Communicate with the GitHub API and implement application business logic.       |
| Mappers     | Convert GitHub API responses into application-specific domain models.           |
| Translators | Translate GitHub API errors into consistent application errors.                 |
| Utilities   | Provide shared helper functions such as GitHub Link header parsing.             |



## Project Structure

### Backend

```text
backend/
└── src/
    ├── config/
    ├── constants/
    ├── controllers/
    ├── errors/
    ├── interfaces/
    │   ├── domain/
    │   ├── github/
    │   └── request/
    ├── mappers/
    ├── middlewares/
    ├── routes/
    ├── services/
    ├── translators/
    └── utils/
```

### Frontend

```text
frontend/
└── src/
    ├── api/
    ├── components/
    ├── constants/
    ├── interfaces/
    ├── pages/
```

The backend follows a layered architecture that separates request handling, business logic, data transformation, and error handling. The frontend is organized into reusable components, API clients, and page-level containers to keep the application modular and maintainable.

---

## API Endpoints

### Get Repository Commits

```http
GET /api/github/:owner/:repo/commits
```

#### Query Parameters

| Parameter | Type   | Required | Description                        |
| --------- | ------ | -------- | ---------------------------------- |
| page      | number | No       | Page number (default: 1)           |
| limit     | number | No       | Number of commits per page (1–100) |
| author    | string | No       | Filter commits by author           |

**Example**

```http
GET /api/github/facebook/react/commits?page=1&limit=10&author=gaearon
```

---

### Get Repository Authors

```http
GET /api/github/:owner/:repo/authors
```

Returns the list of unique authors for the specified repository.

**Example**

```http
GET /api/github/facebook/react/authors
```

---

### Get Commit Comments

```http
GET /api/github/:owner/:repo/commits/:sha/comments
```

#### Query Parameters

| Parameter | Type   | Required | Description                         |
| --------- | ------ | -------- | ----------------------------------- |
| page      | number | No       | Page number (default: 1)            |
| limit     | number | No       | Number of comments per page (1–100) |

**Example**

```http
GET /api/github/facebook/react/commits/abc123/comments?page=1&limit=10
```

---

### Pagination

The application implements **server-side pagination** using the pagination information provided by the GitHub REST API through the `Link` response header.

Each paginated response includes:

* Current page
* Page size
* Whether a next page exists
* Whether a previous page exists

Since the GitHub API does not expose the total number of available records, the application intentionally does not estimate or return a total count.


## Getting Started

### Prerequisites

Make sure the following tools are installed on your machine:

* Node.js (v20 or later)
* npm
* Docker
* Docker Compose

---

## Running Locally

### 1. Clone the Repository

```bash
git clone <repository-url>
cd github-commits-app
```

### 2. Start the Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The backend will be available at:

```text
http://localhost:3000
```

---

### 3. Start the Frontend

Open a new terminal.

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

---

## Running with Docker

### Development

Start both the frontend and backend in development mode with hot reloading.

```bash
docker compose -f docker-compose.dev.yml up --build
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:3000
```

---

### Production

Build optimized production images and start the application.

```bash
docker compose up --build
```

Frontend (served by Nginx):

```text
http://localhost
```

Backend:

```text
http://localhost:3000
```

---

## Environment Variables

### Backend

Create a `.env` file inside the `backend` directory.

```env
PORT=3000

GITHUB_API=https://api.github.com

# Optional but recommended
GITHUB_TOKEN=
```

---

### Frontend

Create a `.env` file inside the `frontend` directory.

```env
VITE_API_BASE_URL=http://localhost:3000
```

For production, the frontend API URL is injected during the Docker build using the `VITE_API_BASE_URL` build argument.


## Design Decisions

During development, the focus was on building a clean, maintainable, and production-oriented application. The following design decisions were made intentionally.

### Layered Backend Architecture

The backend follows a layered architecture:

```text
Route
   ↓
Middleware
   ↓
Controller
   ↓
Service
```

Each layer has a single responsibility:

* **Routes** define API endpoints.
* **Middlewares** validate incoming requests.
* **Controllers** handle HTTP requests and responses.
* **Services** contain the application's business logic and communicate with the GitHub API.

This separation improves readability, maintainability, and testability.

---

### Thin Controllers

Controllers are intentionally kept thin and contain no business logic. Their responsibility is limited to extracting request data, invoking the appropriate service, and returning the response.

---

### Backend-Driven Pagination

Pagination is handled entirely by the backend instead of the frontend.

This approach:

* Keeps the frontend simple.
* Reduces unnecessary data transfer.
* Aligns with how the GitHub REST API exposes paginated resources.

---

### Backend-Driven Filtering

Commit filtering by author is performed on the backend rather than filtering an already-fetched dataset on the client.

This ensures:

* Consistent API behavior.
* Reduced client-side processing.
* Better scalability for repositories with large commit histories.

---

### Strong TypeScript Typing

Dedicated interfaces are used for:

* Request objects
* Domain models
* GitHub API responses

This improves type safety, readability, and maintainability.

---

### Shared Validation Logic

Common validation logic is extracted into reusable helper functions and middleware, reducing duplication while keeping validation rules consistent across endpoints.

---

### Response Mapping

GitHub API responses are mapped to application-specific domain models before being returned to the frontend.

This isolates the frontend from external API changes and provides a consistent response structure.

---

### GitHub Link Header Pagination

Instead of estimating the total number of available records, pagination is derived from the GitHub `Link` response header.

Since the GitHub API does not expose a total count for commits or comments, the application exposes:

* Current page
* Page size
* Next page availability
* Previous page availability

This accurately reflects the capabilities of the GitHub API.

---

### Multi-Stage Docker Builds

Both the frontend and backend use multi-stage Docker builds.

Development and production environments are separated to provide:

* Fast development workflow with hot reloading.
* Smaller production images.
* Reduced attack surface by excluding development dependencies from production containers.


### Author Filter Strategy

The GitHub REST API does not provide a dedicated endpoint to retrieve all commit authors for a repository. Since repositories can contain thousands of commits, fetching every page of commit history solely to build the author filter would result in excessive API requests, increased response times, and a higher likelihood of hitting GitHub API rate limits.

To balance performance and usability, the application generates the author filter from the **100 most recent commits**, which corresponds to the maximum number of commits that can be retrieved in a single GitHub API request (`per_page=100`).

This approach provides a representative list of recent contributors while keeping the endpoint fast and avoiding unnecessary requests. The trade-off is that contributors who have not authored one of the most recent 100 commits may not appear in the filter.


## Future Improvements

Given more time, the following enhancements could be added:

* Add unit and integration tests.
* Implement GitHub authentication using OAuth.
* Introduce response caching to reduce repeated GitHub API requests.
* Improve the user interface with skeleton loaders and richer error states.
* Add sorting options for commits.
* Display additional repository information such as stars, forks, and open issues.
* Add CI/CD pipelines for automated testing and deployment.


---

## Acknowledgements

This project uses the GitHub REST API to retrieve public repository information, commits, authors, and commit comments.

Special thanks to the maintainers of the open-source technologies that made this project possible, including Node.js, Express, React, Vite, Material UI, Docker, and TypeScript.
