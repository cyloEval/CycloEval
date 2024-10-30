# Project Setup

## Prerequisites

- Node.js and npm (or pnpm)
- Python 3.8+
- pip (Python package installer)

## Frontend Setup

<!-- TODO -->

## Backend Setup

1. Install Python dependencies:
    ```shell
    pip install -r requirements.txt
    ```

2. Start the FastAPI server:
    ```shell
    uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload
    ```

## Project Structure

### Frontend (React)

- `client/`: Contains the React frontend code.
  - `src/`: Source code for the React application.
    - `components/`: React components.
    - `lib/`: Utility functions and API calls.
    - `App.tsx`: Main application component.
    - `main.tsx`: Entry point for the React application.
  - `public/`: Public assets and HTML file.

### Backend (FastAPI)

- `server/`: Contains the FastAPI backend code.
  - `api/`: API routes.
    - `routes.py`: Defines the API endpoints.
  - `core/`: Core settings and database configuration.
    - `config.py`: Configuration settings.
    - `database.py`: Database connection and session management.
  - `crud/`: CRUD operations for the database models.
    - `user.py`: CRUD operations for users.
    - `coordinate.py`: CRUD operations for coordinates.
    - `detected_shock.py`: CRUD operations for detected shocks.
  - `models/`: Database models.
    - `models.py`: SQLAlchemy models.
  - `schemas/`: Pydantic schemas for request and response models.
    - `user.py`: Schemas for user-related data.
    - `coordinate.py`: Schemas for coordinate-related data.
    - `detected_shock.py`: Schemas for detected shock-related data.
  - `services/`: Business logic and utility functions.
    - `data_processing.py`: Functions for processing sensor data and detecting shocks.
  - `tests/`: Test cases for the backend.
    - `test_main.py`: Tests for the main application.
    - `test_data_processing.py`: Tests for data processing functions.
    - `test_database.py`: Tests for database operations.
  - `main.py`: Entry point for the FastAPI application.

## Running Tests

To run the tests, use the following command:
```shell
pytest
```

## API Endpoints

### User Endpoints

- **Create User**
  - **POST** `/users/`
  - Request Body:
    ```json
    {
      "email": "user@example.com",
      "password": "password123",
      "name": "John Doe"
    }
    ```
  - Response:
    ```json
    {
      "userId": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2023-10-18T14:32:58"
    }
    ```

- **Get User by ID**
  - **GET** `/users/{user_id}`
  - Response:
    ```json
    {
      "userId": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2023-10-18T14:32:58"
    }
    ```

### Detected Shock Endpoints

- **Create Detected Shock**
  - **POST** `/shocks/`
  - Request Body:
    ```json
    {
      "timestamp": "2023-10-18T14:32:58",
      "zAccel": 4.5,
      "userId": 1,
      "latitude": 45.0,
      "longitude": 3.0,
      "altitude": 300.0
    }
    ```
  - Response:
    ```json
    {
      "id": 1,
      "timestamp": "2023-10-18T14:32:58",
      "zAccel": 4.5,
      "userId": 1,
      "coordinateId": 1
    }
    ```

- **Get Detected Shocks by User ID**
  - **GET** `/users/{user_id}/shocks/`
  - Response:
    ```json
    [
      {
        "id": 1,
        "timestamp": "2023-10-18T14:32:58",
        "zAccel": 4.5,
        "userId": 1,
        "coordinateId": 1
      }
    ]
    ```

## Testing API Endpoints

You can test the API endpoints using Swagger UI, Postman, or cURL.

### 1. Using Swagger UI

FastAPI provides an interactive API documentation using Swagger UI.

#### Steps:
1. **Run your FastAPI application**:
    ```shell
    uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload
    ```
2. **Open Swagger UI**:
    Navigate to `http://127.0.0.1:8000/docs` in your web browser.
3. **Interact with the API**:
    You can test all your endpoints directly from the Swagger UI by filling in the required parameters and clicking the "Execute" button.

### 2. Using Postman

Postman is a popular tool for testing APIs.

#### Steps:
1. **Open Postman** and create a new request.
2. **Set the request type** (GET, POST, etc.) and enter the URL of the endpoint you want to test.
3. **Add request parameters**:
    - For **POST** requests, go to the "Body" tab, select "raw", and choose "JSON" from the dropdown. Then, enter the JSON payload.
    - For **GET** requests, you can add query parameters directly in the URL or use the "Params" tab.
4. **Send the request** and view the response.

### 3. Using cURL

cURL is a command-line tool for making HTTP requests.

#### Examples:

- **Create User**:
    ```shell
    curl -X POST "http://127.0.0.1:8000/users/" -H "Content-Type: application/json" -d '{"email": "user@example.com", "password": "password123", "name": "John Doe"}'
    ```

- **Login and Get Token**:
    ```shell
    curl -X POST "http://127.0.0.1:8000/token" -H "Content-Type: application/json" -d '{"email": "user@example.com", "password": "password123"}'
    ```

- **Get User by ID**:
    ```shell
    curl -X GET "http://127.0.0.1:8000/users/1"
    ```

- **Create Detected Shock**:
    ```shell
    curl -X POST "http://127.0.0.1:8000/shocks/" -H "Content-Type: application/json" -d '{"timestamp": "2023-10-18T14:32:58", "zAccel": 4.5, "userId": 1, "latitude": 45.0, "longitude": 3.0, "altitude": 300.0}'
    ```

- **Get Shocks by User ID**:
    ```shell
    curl -X GET "http://127.0.0.1:8000/users/1/shocks/"
    ```

These methods will help you test your FastAPI endpoints effectively.

## Environment Variables

Create a `.env` file in the `server` directory with the following content:
```
DATABASE_URL=sqlite:///./test.db
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Notes

- Ensure that the database URL in the `.env` file matches your database configuration.
- Adjust the `SECRET_KEY` and other security settings as needed.
