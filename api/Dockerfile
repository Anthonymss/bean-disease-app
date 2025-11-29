FROM python:3.10-slim

# Evitar archivos pyc y usar stdout
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Dependencias necesarias para OpenCV, PIL, TensorFlow
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    libjpeg62-turbo \
    zlib1g \
    && rm -rf /var/lib/apt/lists/*

# Directorio de trabajo
WORKDIR /app

# Instalar dependencias
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt --no-cache-dir

# Copiar toda tu app
COPY . .

# Exponer puerto
EXPOSE 10000

# Comando final (SIN reload)
CMD ["uvicorn", "app:main:app", "--host", "0.0.0.0", "--port", "10000"]