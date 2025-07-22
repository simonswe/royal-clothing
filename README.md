# Royal Clothing - Catalogue Site

A modern clothing catalogue site built with React, TypeScript, Material-UI, and Firebase.

## Features

- Browse clothing items with beautiful card layout
- Filter items by:
  - Price range
  - Brand
  - Color
  - Size
  - Type of clothing
- Admin panel with:
  - Add new items with image upload
  - Delete existing items
  - Simple password-based authentication

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   VITE_FIREBASE_PROJECT_ID=your_project_id_here
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   VITE_FIREBASE_APP_ID=your_app_id_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Admin Access

The default admin password is `admin123`. In a production environment, you should change this to a secure password and implement proper authentication.

## Technologies Used

- React 18
- TypeScript
- Material-UI
- Firebase (Firestore & Storage)
- Vite

## Project Structure

- `/src/components` - React components
- `/src/services` - Firebase and API services
- `/src/types` - TypeScript type definitions
- `/src/config` - Configuration files

## Development

1. Run tests:
   ```bash
   npm test
   ```

2. Build for production:
   ```bash
   npm run build
   ```

3. Preview production build:
   ```bash
   npm run preview
   ```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
