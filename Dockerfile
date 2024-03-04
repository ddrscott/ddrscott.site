FROM python:3.9-slim

WORKDIR /app

ENV PYTHONPATH "/app"

# Install dependencies
COPY requirements.txt /app
RUN pip install -r requirements.txt

COPY . /app

RUN pip install -e .

ENTRYPOINT ["mkdocs"]
