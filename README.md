<h1>
  🐾 Adoptly – Pet Donation App
  <img 
    src="https://firebasestorage.googleapis.com/v0/b/adoptly-b8aef.firebasestorage.app/o/icon.png?alt=media&token=e2637926-733e-427c-a9ed-2c911a31f653" 
    width="40" 
    style="border-radius: 50%; vertical-align: middle; margin-left: 30px;" 
  />
</h1>

A **React Native** application that helps users **find, donate, and adopt pets** with ease. Built with **Clerk** for secure authentication, **Firebase Firestore** for real-time data storage, and powered by **Gemini API** for an intelligent chatbot experience.

---

## 📌 Table of Contents

* [About](#about)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Installation](#installation)
* [Usage](#usage)
* [App Screenshots](#app-screenshots)
* [Download & QR Code](#download--qr-code)
* [Project Structure](#project-structure)
* [Contributing](#contributing)
* [License](#license)

---

## 📖 About

**Adoptly** is a pet adoption and donation platform that connects pet owners and potential adopters. Users can browse available pets, chat with owners in real-time, mark favorites, and add new pets for donation. It includes **Adopto**, an AI-powered chatbot that provides app-related insights and additional information using **Gemini API**.

---

## ✨ Features

* **Google Authentication** via **Clerk**
* **Add New Pets** for adoption or sale
* **Favorite Pets** management
* **Real-time Chat** between buyers and pet owners
* **Nearby Pet Adoption & Sale Listings**
* **AI Chatbot – Adopto** (answers queries about pets or app)
* **Firestore Integration** for pet data storage
* **Cross-platform Support** (Android & iOS)

---

## 🛠 Tech Stack

* **React Native + Expo Router**
* **Clerk** (Google OAuth Authentication)
* **Firebase Firestore** (Realtime database)
* **Gemini API** (AI Chatbot - Adopto)
* **React Native Paper** (UI Components)
* **Zustand / Context API** (State Management)
* **React Navigation** (Routing)
* **FlashList** (Optimized chat list rendering)

---

## ⚙️ Installation

### Prerequisites

* Node.js >= 14
* Expo CLI installed globally
* Firebase & Clerk accounts configured
* Gemini API Key

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
```

---

## 🚀 Usage

1. Start the development server:

   ```bash
   npm start
   ```
2. Scan the QR code with **Expo Go** app to run on your device.
3. Login with **Google account** to access features.
4. Add, favorite, and chat about pets directly within the app.

---

## 📸 App Screenshots

*(Attach your screenshots here)*

Example:
![Screenshot](./assets/screenshots/home.png)

---

## 📲 Download & QR Code

* **GitHub Repository**: [Adoptly Repo](https://github.com/shubhmrwt01/Adoptly.git)

* **App URL**: *https://tinyurl.com/Adoptly-Pet-Donation-App*

* **QR Code to Install:**
  <p align="center">
  <img src="https://firebasestorage.googleapis.com/v0/b/adoptly-b8aef.firebasestorage.app/o/frame.png?alt=media&token=e8e9942d-af15-479f-bbb8-5f1acbc06680" width="250" />
</p>


---

## 📂 Project Structure

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

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m "Add feature"`)
4. Push to branch (`git push origin feature-name`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

© 2025 Shubham Rawat – All rights reserved.

