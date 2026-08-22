# Build Stage
FROM golang:1.23-alpine AS builder
WORKDIR /app
COPY go.mod ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o core-api ./cmd/server/main.go

# Final Runtime Stage
FROM alpine:3.19
RUN apk --no-cache add ca-certificates
WORKDIR /app
COPY --from=builder /app/core-api .
EXPOSE 8080
CMD ["./core-api"]
