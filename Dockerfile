FROM python:3.11

WORKDIR /app

# Copy dependency file
COPY backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ /app/

# Copy frontend code into the 'static' directory
COPY frontend/ /app/static/

CMD ["uvicorn","main:app","--host","0.0.0.0","--port","8000"]
