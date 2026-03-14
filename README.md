# Schedulr — Scheduling Platform

Schedulr is a full-stack scheduling platform that allows customers to book services with providers based on their availability.

The system supports service browsing, availability management, time slot booking, and booking cancellation.

---

# Features

### Authentication
- User registration
- User login
- JWT authentication
- Role based access (Customer / Provider)

### Services
- Providers can create services
- Each service includes:
  - name
  - description
  - duration
  - price

### Availability
- Providers define their availability slots
- Availability can span multiple days
- Time slots are generated automatically based on service duration

### Booking System
- Customers can:
  - browse services
  - choose a day
  - choose a time slot
  - confirm booking

### Booking Rules
- A customer can only have **one active booking per service**
- Booked slots are disabled in the UI
- Cancelled bookings free the slot again

### Booking Management
Customers can:
- view their bookings
- cancel bookings

---

# Tech Stack

## Frontend
- React
- Vite
- Axios
- Vercel deployment

## Backend
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- JWT Authentication

---

# Project Structure
