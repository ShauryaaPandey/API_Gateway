# API Gateway

A scalable API Gateway built with Node.js and Express that serves as a single entry point for microservices. The gateway handles authentication, request routing, rate limiting, logging, and centralized error management before forwarding requests to downstream services.

## Features

- Authentication Middleware
- API Request Routing & Proxying
- Rate Limiting for Abuse Prevention
- Request Logging using Morgan
- Centralized Error Handling
- Service-to-Service Communication with Axios
- Microservices-Friendly Architecture

## Tech Stack

- Node.js
- Express.js
- Axios
- HTTP Proxy Middleware
- Express Rate Limit
- Morgan
- PM2

## Architecture

```text
Client
   |
   v
API Gateway
   |
   |---- Authentication Service
   |
   |---- Booking Service
```

The API Gateway acts as a middleware layer between clients and backend services. It validates incoming requests, performs authentication checks, applies rate limiting, and forwards valid requests to the appropriate microservice.

## Project Structure

```text
API_Gateway/
│
├── index.js
├── package.json
└── README.md
```

## Authentication Flow

1. Client sends request with `x-access-token`.
2. Gateway intercepts the request.
3. Gateway calls the Authentication Service.
4. If the token is valid:
   - Request is forwarded to the target microservice.
5. If invalid:
   - A 401 Unauthorized response is returned.

## Rate Limiting

To protect backend services from excessive traffic:

- Window Duration: 2 Minutes
- Maximum Requests: 5 Requests per User

If the limit is exceeded:

```json
{
  "success": false,
  "message": "Too many requests",
  "err": {}
}
```

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node index.js
```

The gateway runs on:

```text
http://localhost:3005
```

## Sample Endpoint

### Health Check

```http
GET /home
```

Response:

```json
{
  "message": "API Gateway called"
}
```

## Dependencies

- Express
- Axios
- Morgan
- HTTP Proxy Middleware
- Express Rate Limit
- PM2

## Use Cases

- Microservices Architecture
- Centralized Authentication
- API Security
- Traffic Control
- Request Monitoring
- Service Routing

## Future Improvements

- JWT Verification at Gateway Level
- API Versioning
- Load Balancing
- Service Discovery
- Caching with Redis
- Circuit Breaker Pattern
- Distributed Tracing

## Author

Developed as a backend infrastructure project demonstrating API Gateway design patterns and microservices communication.
