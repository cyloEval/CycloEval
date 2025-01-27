# Use a lightweight Python image
FROM python:3.10-slim

# Set the working directory to the root of the project
WORKDIR /app
# Install system dependencies for Python
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY server/requirements.txt .
RUN python3 -m pip install --upgrade pip \
    && pip install -r requirements.txt

# Copy the entire project into the container
RUN mkdir -p server
COPY ./server ./server

# Expose the application's port
EXPOSE 8000

# Command to run the application from the root of the project
CMD ["uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

