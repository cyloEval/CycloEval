# Project Setup

## Prerequisites

- Node.js and npm (or pnpm)
- Python 3.8+
- pip (Python package installer)

## Frontend Setup

1. Navigate to the `client` directory:
    ```shell
    cd client
    ```

2. Install the dependencies:
    ```shell
    npm install
    ```

3. Start the development server:
    ```shell
    npm run dev
    ```

## Backend Setup

1. Install Python dependencies:
    ```shell
    pip install -r server/requirements.txt
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
      - `map/legende.tsx`: Legend component for the map.
    - `lib/`: Utility functions and API calls.
    - `App.tsx`: Main application component.
    - `main.tsx`: Entry point for the React application.
  - `public/`: Public assets and HTML file.
  - `index.html`: Main HTML file.
  - `index.css`: Main CSS file.

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

## API Endpoints

### Authentication Endpoints

- **Register User**
  - **POST** `/auth/register`
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

- **Login User**
  - **POST** `/auth/login`
  - Request Body:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - Response:
    ```json
    {
      "access_token": "your_access_token",
      "token_type": "bearer",
      "email": "user@example.com"
    }
    ```

### Detected Shock Endpoints

- **Import Sensor Data**
  - **POST** `/importSensorData`
  - Request Body:
    ```json
    {
      "filename": "sensor_data.json",
      "raw_json": "..."
    }
    ```
  - Response:
    ```json
    [
      {
        "id": 1,
        "timestamp": "2023-10-18T14:32:58",
        "zAccel": 4.5,
        "userId": 1,
        "latitude": 45.0,
        "longitude": 3.0,
        "altitude": 300.0
      },
      ...
    ]
    ```

## Environment Variables

Create a `.env` file in the `server` directory with the following content:
```
DATABASE_URL=sqlite:///./ShockDB.db
SECRET_KEY=your_secret_key 
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Notes

- Ensure that the database URL in the `.env` file matches your database configuration.
- Adjust the `SECRET_KEY` and other security settings as needed.

## Running Tests

To run the tests, use the following command:
```shell
pytest
```
