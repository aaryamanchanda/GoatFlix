# 🐐 GoatFlix - Cinematic Streaming Experience

GoatFlix is a premium, high-performance movie and TV show exploration platform designed to feel like a state-of-the-art streaming service. It replicates the "Netflix-style" interface while providing a seamless, interactive user experience powered by the latest web technologies.

---

## 📄 Product Requirements Document (PRD)

### 1. Objective
To build a visually stunning movie database and streaming player interface that allows users to discover trending content, view detailed metadata, and play content securely based on subscription status.

### 2. Core Features
*   **Dynamic Discoverability**: Real-time trending, popular, and top-rated content fetched via TMDB.
*   **Intelligent Search**: Multi-type search (Movies & TV) with instant result overlays.
*   **Cinematic Hero Carousel**: Auto-rotating banner featuring high-resolution backdrops and metadata.
*   **Subscription Gated Access**: Premium content is protected by a `ProtectedRoute` system, requiring an active subscription to access the player.
*   **Interactive Player**: Embedded high-quality streaming interface with auto-play and episode selection.
*   **Continuous Discovery**: "Continue Watching" row powered by local storage to track viewing progress.
*   **Glassmorphic Design**: Modern UI with subtle blurs, sleek transitions, and a dark-mode first aesthetic.

---

## 🛠 Tech Stack

*   **Core**: [React 19](https://react.dev/)
*   **Build Tool**: [Vite 6](https://vite.dev/)
*   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) + Vanilla CSS for micro-animations
*   **Routing**: [React Router DOM 7](https://reactrouter.com/)
*   **Data Fetching**: [Axios](https://axios-http.com/)
*   **Backend & Auth**: [Firebase 12](https://firebase.google.com/) (Authentication & Firestore)
*   **Icons & Assets**: Custom SVG & TMDB Image API

---

## 🔑 API Configuration & Security

### TMDB API
This project uses the Movie Database API for real-time metadata. 
**Current API Key**: `f80c9736e0eeda31350cd3af24b128bf` (Hardcoded in `src/utils/tmdb.js`).

> [!WARNING]
> For production environments, it is highly recommended to move this key to a `.env` file and use `import.meta.env.VITE_TMDB_API_KEY`.

### Firebase Setup
The project is architected to use Firebase for Authentication (Google Login) and user profiles. To enable these features:
1.  Create a project at [Firebase Console](https://console.firebase.google.com/).
2.  Enable **Google Auth** in the Authentication tab.
3.  Add a Web App to get your configuration.
4.  Update `src/utils/firebase.js` with your specific keys:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  // ...
};
```

---

## 🚀 Demonstration: How to Run

1.  **Clone the Repository**:
    ```bash
    git clone [repository-url]
    cd GoatFlix
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Start Development Server**:
    ```bash
    npm run dev
    ```
4.  **Access App**:
    Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛡 Security Features

*   **Protected Access**: The `ProtectedRoute.jsx` component wraps sensible routes (`/player`), verifying user authentication and subscription status before rendering media.
*   **Environment Handling**: Prepared support for `.env` variables to prevent key exposure.
*   **Encapsulated Logic**: API calls and Firebase initializers are isolated in `src/utils` to minimize attack surface in UI components.
*   **Secure Player Embeds**: Vidking iframe integration with specific permissions to prevent uncontrolled popups or unsafe scripts.

---

## 🧩 Problems Faced & Solutions

*   **Iframe Messaging**: Communication between the embedded player and the main UI for tracking watch progress required a custom `window.addEventListener("message", ...)` implementation to handle cross-origin data.
*   **Layout Shift**: Large backdrop images from TMDB were causing layout instability. This was solved using `Skeleton` components and `aspect-ratio` CSS properties in Tailwind.
*   **Component Modularity**: Transitioning from a monolithic design to a bento-box architecture required refactoring global state for the Search system to coexist with the Hero Banner.

---

## 📈 Roadmap & Future Improvements

- [ ] **Real Payment Integration**: Replace the simulated pricing page with a live [Stripe](https://stripe.com/) Checkout flow.
- [ ] **User Profiles**: Allow multiple user profiles (Adult/Kids) under a single Firebase account.
- [ ] **Advanced Filtering**: Add genre-based browse pages and refined sorting (Release Date, Rating).
- [ ] **Mobile Optimization**: Further refine the navigation drawer and touch gestures for a native-like mobile app experience.
- [ ] **Watchlist**: Implement a "My List" feature synced with Firestore instead of local storage.

---

*Built with ❤️ by Aarya Manchanda*
