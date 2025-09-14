## YelpCamp ##
### Description

YelpCamp is a full-stack web application for creating, reviewing, and rating campgrounds. It demonstrates RESTful routes, user authentication, file uploads (Cloudinary), and map integration (Mapbox).

### Tech stack

- Node.js, Express
- MongoDB (Mongoose)
- EJS templates
- Passport.js (authentication)
- Cloudinary (image hosting)
- Mapbox (geocoding / maps)

### Features

- Create, read, update, delete campgrounds
- User registration and login
- Add and remove images for campgrounds
- Write and manage reviews
- Geolocation via Mapbox
- Data validation and authorization

### Prerequisites

- Node.js (v14+)
- npm
- MongoDB (local or Atlas)
- Cloudinary account (optional for image uploads)
- Mapbox account (for map/geocoding)

### Installation

1. Clone the repository
    ```bash
    git clone <repo-url>
    cd YelpCamp
    ```
2. Install dependencies
    ```bash
    npm install
    ```
3. Create a .env file in the project root (see Example .env below)
4. (Optional) Seed the database
    ```bash
    node seeds/index.js
    ```

### Run

- Development
  ```bash
  npm run dev
  ```
- Production
  ```bash
  npm start
  ```

### Environment variables (example .env)

```
PORT=3000
DB_URL=mongodb://localhost:27017/yelpcamp
SESSION_SECRET=your_session_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
MAPBOX_TOKEN=your_mapbox_token
```

### Common scripts

- npm run dev — start with nodemon
- npm start — start production server
- node seeds/index.js — populate sample data

### Contributing

- Fork the repo, create a feature branch, and open a pull request.
- Keep changes focused and add clear commit messages.
- Run the app and ensure no regressions before submitting.

### License

MIT