# IMS Frontend

The **IMS Frontend** is the user interface for the Inventory Management System (IMS), built with **TypeScript** and **React** using **Vite**. It provides an intuitive interface for managing products, customers, and transactions, and is deployed on **AWS Amplify** for continuous deployment and hosting. The design is simple, leveraging **React Bootstrap** components, with plans to enhance the styling using custom CSS in the future.

## 🚀 Tech Stack

- **Frontend Framework**: React (TypeScript)
- **Build Tool**: Vite
- **Deployment**: AWS Amplify
- **UI Components**: React Bootstrap
- **Authentication**: Auth0 (OAuth2.0)

## 🛠️ Features

- **Manage Inventory**: Add, update, and delete products via a user-friendly interface.
- **Customer Management**: Add and manage customers.
- **Transaction Management**: Perform and view buy/sell transactions with filters and date-range options.
- **Responsive Design**: Works seamlessly across devices.

## 🔧 Running Locally

1. **Clone the repository**:

   ```bash
   git clone <your-repo-url>
   cd ims-frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the app in development mode:**

   ```bash
   npm run dev
   ```

4. **Build for production:**

   ```bash
   npm run build
   ```

   dist folder will have the necessary files to deploy this as a static webpage.

## **🌐 Deployment**

This app is continuously deployed on AWS Amplify. Any new changes pushed to the main branch are automatically built and deployed.

## **📑 Future Work**

- Enhanced Styling: Custom CSS will be added to improve the visual design beyond React Bootstrap components.
- Additional Features: Possible new features and improvements based on user feedback.
