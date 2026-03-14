# Scheduling Platform

Schedulr is a full-stack scheduling platform that allows customers to book services with providers based on their availability.

The system supports service browsing, availability management, time slot booking, and booking cancellation.

---

# Live Demo

### Frontend

https://fullstack-scheduling-platform.vercel.app/

### Backend API (Swagger)

https://schedulingplatform.runasp.net/swagger

---

# Features

## Authentication

* User registration
* User login
* JWT authentication
* Role-based access (Customer / Provider)

## Services

Providers can create services.

Each service includes:

* name
* description
* duration
* price

## Availability

* Providers define their availability slots
* Availability can span multiple days
* Time slots are generated automatically based on the service duration

## Booking System

Customers can:

* browse services
* choose a day
* choose a time slot
* confirm booking

## Booking Rules

* A customer can only have **one active booking per service**
* Booked slots are disabled in the UI
* Cancelled bookings free the slot again

## Booking Management

Customers can:

* view their bookings
* cancel bookings

---

# Tech Stack

## Frontend

* React
* Vite
* Axios
* Vercel Deployment

## Backend

* ASP.NET Core Web API
* Entity Framework Core
* SQL Server
* JWT Authentication
* Hosted on **MonsterASP / RunASP**

---

# Deployment

## Frontend Deployment

The frontend is deployed on **Vercel**.

URL:
https://fullstack-scheduling-platform.vercel.app/

## Backend Deployment

The backend API is hosted on **MonsterASP (RunASP)**.

Swagger Documentation:
https://schedulingplatform.runasp.net/swagger

The API provides endpoints for:

* Authentication
* Services management
* Provider availability
* Booking management

---

# Project Architecture

```
Frontend (React + Vite)
        │
        │ HTTP Requests (Axios)
        ▼
Backend API (ASP.NET Core)
        │
        │ Entity Framework Core
        ▼
SQL Server Database
```

---

# Key Concepts

### Role-Based System

Two main roles exist in the platform:

**Customer**

* Browse services
* Book available slots
* View bookings
* Cancel bookings

**Provider**

* Create services
* Define availability
* Manage service schedule


* Booking reminders
* Calendar integration
