FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    build-essential \
    libpq-dev \
    python3-dev \
    libc6-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "run.py"]


# FROM python:3.11

# WORKDIR /app

# RUN apt-get update && apt-get install -y --no-install-recommends \
#     build-essential \
#     libpq-dev \
#     python3-dev \
#     gcc \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*

# COPY requirements.txt .

# RUN pip install --upgrade pip setuptools wheel

# RUN pip install -r requirements.txt

# COPY . .

# EXPOSE 5000

# ENTRYPOINT ["python"]

# CMD ["app.py"]