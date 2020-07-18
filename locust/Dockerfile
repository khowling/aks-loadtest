FROM python:3

WORKDIR /usr/src/app

ADD locustfile.py .

RUN pip install locust

EXPOSE 8089
CMD [ "locust" ]
