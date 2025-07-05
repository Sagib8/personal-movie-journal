
## Preview

![My Space Screenshot](my_space.png)


# Personal Movie Journal

A full-stack web application for managing a personal movie journal. Users can securely register and log in, search movies using the TMDB API, add them to their personal space, track watch status, rate and comment, and mark favorites.

---

## Project Objectives

- Enable users to maintain a personal list of movies they watched or want to watch
- Provide secure authentication with session management using JWT
- Offer full CRUD functionality for managing personal movie data
- Integrate with an external API (TMDB) for movie search and metadata

---

## Features

### User Authentication
- JWT-based login and registration system
- Password strength validation (minimum 8 characters with upper/lowercase and number)
- Username availability check in real-time
- Security question and answer for login protection after repeated failures
- Each user can only access their own data

### Movie Search via TMDB API
- Search movies by title
- Display basic details: title, release year, poster, and rating
- Clickable results navigate to a full movie details page

### Personal Movie Journal
- Add movies to personal space
- Set watch status: Watched / Want to Watch
- Add personal rating (1–10)
- Write personal comments
- Mark or unmark as favorite
- Filter by watch status or favorites
- Edit or delete existing movie entries

---

## Technologies Used

### Frontend
- React with functional components and hooks
- Axios for HTTP requests
- Bootstrap (via custom styling)

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password and security answer hashing
- TMDB API integration for movie data

---

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/Sagib8/personal-movie-journal.git
cd movie-journal
```

2. Backend Setup:
```bash
cd backend
npm install
```
- Create a `.env` file in the `backend` directory:
```
PORT=4000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
TMDB_API_KEY=your_tmdb_key
```
- Start the backend:
```bash
npm run dev
```

3. Frontend Setup:
```bash
cd frontend
npm install
npm start
```

---

## API Integration

- The Movie Database (TMDB): https://www.themoviedb.org/documentation/api

---


## License

This project was developed for educational purposes. You are free to modify and extend it.
