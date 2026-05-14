# Dairy Flat Airlines Booking System
# Author: REN WENPENGQING

A full-stack airline booking system built with Next.js, TypeScript, MongoDB Atlas, and Tailwind CSS.

## Live Demo

https://renwenpengqing-dairy-flat-airlines.vercel.app

---

## Features

- Flight search system
- One-way and return trip support
- Available flight date selection
- Flight booking and invoice generation
- Passenger flight lookup
- Booking cancellation system
- Booking confirmation modal
- MongoDB Atlas database integration
- Responsive modern UI
- Vercel deployment

---

## Tech Stack

- Next.js
- TypeScript
- MongoDB Atlas
- Tailwind CSS
- Vercel

---

## Installation

Clone the repository:

```bash
git clone https://github.com/krisrenwen/RENWENPENGQING_dairy-flat-airlines.git

```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file and add:

```env
MONGODB_URI=your_mongodb_connection_string
```

Run the development server:

```bash
npm run dev
```

---

## Project Structure

```txt
app/
 ├── api/
 ├── booking/
 ├── cancel/
 ├── invoice/
 ├── my-flights/
 ├── search/

lib/
 ├── mongodb.ts
```

---

## Database

This project uses MongoDB Atlas to store:

- Flight schedules
- Passenger bookings
- Booking references
- Flight seat availability

---

## Deployment

The project is deployed using Vercel.