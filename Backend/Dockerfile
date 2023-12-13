FROM python:3.12-slim AS base
#FROM python:3.9.0-alpine

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /code/requirements.txt

COPY ./src /code/src
#COPY ./.env /code/.env

CMD ["uvicorn", "src.app:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]
