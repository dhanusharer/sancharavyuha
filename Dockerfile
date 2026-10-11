# Sanchara Vyuha AI-TOS v6.0 Dockerfile Configuration
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for OpenCV & SQLite
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "services.backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
