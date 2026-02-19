# Gunakan image Python resmi
FROM python:3.11-slim

# Set working directory di dalam container
WORKDIR /app

# Copy requirements terlebih dahulu (agar caching optimal)
COPY requirements.txt .

# Install dependency
RUN pip install --no-cache-dir -r requirements.txt

# Copy seluruh source code
COPY ./app ./app

# Expose port FastAPI
EXPOSE 8000

# Command untuk menjalankan server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
