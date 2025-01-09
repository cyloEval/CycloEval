# Backend Dockerfile
FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN python3 -m pip install --upgrade pip
RUN python3 -m venv .venv
RUN . .venv/bin/activate
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
EXPOSE 8000
