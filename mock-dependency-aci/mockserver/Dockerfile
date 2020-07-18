FROM golang:1.14 as builder


# setting working directory
WORKDIR /go/src/app

# installing dependencies
RUN go get github.com/sirupsen/logrus
RUN go get github.com/buaazp/fasthttprouter
RUN go get github.com/valyala/fasthttp

COPY main.go .
RUN CGO_ENABLED=0 GOOS=linux go build -o mockserver

FROM scratch as final

COPY --from=builder /go/src/app/mockserver .
COPY response.json .

EXPOSE 8080

CMD ["/mockserver"]
