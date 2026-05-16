FROM python:3.11-slim

WORKDIR /app

ENV PYTHONPATH="/app"

# Install dependencies
RUN pip install uv
COPY requirements.txt /app
RUN uv pip install --system -r requirements.txt
COPY . /app
RUN uv pip install --system -e .

CMD ["./build.sh"]
