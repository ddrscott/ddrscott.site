FROM python:3.9-slim


WORKDIR /app

# Install dependencies
RUN pip install pipenv
COPY Pipfile /app
COPY Pipfile.lock /app
RUN pipenv install --system

COPY . /app

RUN pip install -e .

ENTRYPOINT ["mkdocs"]
