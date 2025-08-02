 <h1>
  🐾  Adoptly – Pet Donation App&nbsp;&nbsp;
  <img 
    src="https://firebasestorage.googleapis.com/v0/b/adoptly-b8aef.firebasestorage.app/o/icon.png?alt=media&token=e2637926-733e-427c-a9ed-2c911a31f653" 
    width="40" height="40" style="border-radius:50%;"
  />
</h1>

A **React Native** application that helps users **find, donate, and adopt pets** with ease. Built with **Clerk** for secure authentication, **Firebase Firestore** for real-time data storage, and powered by **Gemini API** for an intelligent chatbot experience.

## 📌 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [App Screenshots](#app-screenshots)
- [Download & QR Code](#download--qr-code)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## About

**Adoptly** is a pet adoption and donation platform that connects pet owners and potential adopters. Users can browse available pets, chat with owners in real-time, mark favorites, and add new pets for donation. It includes **Adopto**, an AI-powered chatbot that provides app-related insights and additional information using **Gemini API**.


## **Features**

### **1. Google Authentication via Clerk**

* Secure user login and sign-up using Google accounts.
* Powered by **Clerk**, which manages authentication flows and sessions.

### **2. Add New Pets for Adoption or Sale**

* Pet owners can create listings by providing details such as:
  * Name, breed, age, gender, and health information.
  * Upload images for better visibility.
* Allows donating or putting pets up for adoption quickly.


### **3. Favorite Pets Management**

* Users can **mark pets as favorites** for quick access later.
* Favorites list is stored in real-time (using Firestore).
* Helps adopters keep track of pets they are interested in.


### **4. Real-Time Chat Between Buyers and Pet Owners**

* Built-in chat feature for direct communication.
* Messages are synchronized in **real-time via Firestore**.
* Helps clarify details about adoption, meetups, or negotiations instantly.


### **5. Nearby Pet Adoption & Sale Listings**

* Location-based functionality to view pets available near the user.
* Displays **pet adoption events or listings** around your city.
* Enhances chances of quick adoption by connecting local pet owners and adopters.


### **6. AI Chatbot – Adopto**

* **Adopto** is an in-app chatbot powered by **Google Gemini API**.
* Can:

  * Provide pet information stored in the app (e.g., details of listed pets).
  * Answer general queries about pet care and breeds.
  * Guide users on app navigation (e.g., how to add a new pet).
* Acts as a **virtual assistant** to enhance user experience.


### **7. Firestore Integration for Pet Data Storage**

* **Firebase Firestore** is used to:

  * Store pet listings, favorites, and chat messages.
  * Enable **real-time updates** (pets appear instantly when added).
* Provides scalable and secure cloud storage for app data.

### **8. Cross-platform Support (Android & iOS)**

* Built with **React Native** (Expo Router) for **true cross-platform** support.
* Same codebase works on Android and iOS without extra configuration.
* Optimized performance and responsive UI for all screen sizes.

---

## Tech Stack

- **React Native + Expo Router**
- **Clerk** (Google OAuth Authentication)
- **Firebase Firestore** (Realtime database)
- **Gemini API** (AI Chatbot - Adopto)
- **React Native Paper** (UI Components)
- **Zustand / Context API** (State Management)
- **React Navigation** (Routing)
- **FlashList** (Optimized chat list rendering)

---

## Installation

### Prerequisites

- Node.js >= 14  
- Expo CLI installed globally  
- Firebase & Clerk accounts configured  
- Gemini API Key  

### Steps

```bash
# Clone the repository
git clone https://github.com/shubhmrwt01/Adoptly.git

# Navigate into the project directory
cd Adoptly

# Install dependencies
npm install
# or
yarn install

# Start the project
npm start
# or
yarn start
````

---

## Usage

1. Start the development server:

   ```bash
   npm start
   ```
2. Scan the QR code with **Expo Go** app to run on your device.
3. Login with **Google account** to access features.
4. Add, favorite, and chat about pets directly within the app.

---

## App Screenshots

*(Attach your screenshots here)*

Example:
![Screenshot](./assets/screenshots/home.png)

---

## Download & QR Code

* **GitHub Repository**: [Adoptly Repo](https://github.com/shubhmrwt01/Adoptly.git)

* **App URL**: *[https://tinyurl.com/Adoptly-Pet-Donation-App](https://tinyurl.com/Adoptly-Pet-Donation-App)*

* **QR Code to Install:**

  <p align="center">
    <img src="https://firebasestorage.googleapis.com/v0/b/adoptly-b8aef.firebasestorage.app/o/frame.png?alt=media&token=e8e9942d-af15-479f-bbb8-5f1acbc06680" width="250" />
  </p>

---

## Project Structure

```
Adoptly/
├── app/
│   ├── (tabs)/
│   ├── chat/
│   ├── chatbot/
│   ├── pet-details/
│   ├── user-post/
│   ├── add-new-pet/
│   └── index.jsx
├── assets/
├── components/
├── config/
├── constants/
├── .env
├── package.json
└── README.md
```

---

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m "Add feature"`)
4. Push to branch (`git push origin feature-name`)
5. Open a Pull Request

---

## License

This project is licensed under the [MIT License](LICENSE).

© 2025 Shubham Rawat – All rights reserved.

