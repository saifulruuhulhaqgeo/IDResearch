FROM golang:1.19-alpine as bebuilder
WORKDIR /app

COPY . .

RUN go mod tidy

RUN go build -o app ./cmd/main.go


FROM alpine:latest

WORKDIR /app
RUN mkdir -p frontend/build
COPY ./frontend/build ./frontend/build
COPY --from=bebuilder /app/app .
COPY --from=bebuilder /app/config.yaml .

EXPOSE 3000

ENTRYPOINT ["/app/app"]

