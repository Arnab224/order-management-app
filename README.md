# 🍔 Foodify - Order Management System

A full-stack food delivery application built with **React + Vite** (Frontend) and **Node.js + Express** (Backend), featuring real-time order tracking using Socket.IO.

## 📋 Features

### 1. Menu Display
- Browse a list of food items with images, descriptions, and prices
- Responsive grid layout for optimal viewing on all devices
- Dynamic menu loading with loading states and error handling

### 2. Order Placement
- Add items to cart with quantity management
- Automatic quantity increment for duplicate items
- View cart summary with total calculation
- Complete checkout form with delivery details:
  - Customer name
  - Delivery address
  - Phone number

### 3. Order Status Tracking
- Real-time order status updates via Socket.IO
- Visual progress tracker with status indicators:
  - 📝 Order Received
  - 🍳 Preparing
  - 🚚 Out for Delivery
  - ✅ Delivered
- No page refresh needed for status updates

### 4. Test-Driven Development (TDD)
- Comprehensive backend tests using Jest and Supertest
- Frontend tests using Vitest and React Testing Library
- Test coverage for:
  - API endpoints
  - Database models
  - React components
  - Context providers
  - Input validation

## 🏗️ Project Structure

```
Order_Management/
├── backend/                 # Node.js + Express API
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── middlewares/        # Custom middleware
│   ├── utils/              # Utility functions
│   ├── scripts/            # Database seed scripts
│   ├── tests/              # Jest test suites
│   └── server.js           # Entry point
│
└── frontend/               # React + Vite app
    ├── src/
    │   ├── app/            # App shell and routing
    │   ├── features/       # Feature-based modules
    │   │   ├── cart/       # Cart management
    │   │   ├── menu/       # Menu display
    │   │   └── order/      # Order placement & tracking
    │   ├── shared/         # Shared components & utilities
    │   └── tests/          # Vitest test suites
    └── public/             # Static assets
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or remote instance)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure your `.env`:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/foodify
NODE_ENV=development
```

5. Seed the database with menu items:
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

The backend API will be running at `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure your `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

5. Start the development server:
```bash
npm run dev
```

The frontend will be running at `http://localhost:5173`

## 🧪 Running Tests

### Backend Tests
```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Frontend Tests
```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 📡 API Endpoints

### Menu Endpoints
- `GET /api/menu` - Retrieve all menu items

### Order Endpoints
- `POST /api/orders` - Create a new order
- `GET /api/orders/:id` - Get order status by ID

### WebSocket Events
- `order-status-update` - Real-time order status updates

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM (Object Data Modeling)
- **Socket.IO** - Real-time bidirectional communication
- **Jest** - Testing framework
- **Supertest** - HTTP assertion library

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Socket.IO Client** - WebSocket client
- **Vitest** - Testing framework
- **React Testing Library** - Component testing utilities

## 🎯 Key Implementation Details

### Real-Time Updates
The application uses Socket.IO to provide real-time order status updates:
1. When an order is placed, the backend starts a status simulator
2. The simulator progresses through statuses: `ORDER_RECEIVED` → `PREPARING` → `OUT_FOR_DELIVERY` → `DELIVERED`
3. Each status change is broadcasted to connected clients via WebSocket
4. The frontend automatically updates the UI without page refresh

### State Management
- **Cart State**: Managed using React Context API with `useReducer` hook
- **Server State**: Handled with custom hooks and Axios for API calls
- **Loading/Error States**: Properly managed in all async operations

### Responsive Design
- Mobile-first approach using Tailwind CSS
- Responsive grid layouts for menu items
- Adaptive forms and buttons for all screen sizes

## 📝 Development Notes

### Database Seeding
The seed script (`backend/scripts/seedMenu.js`) populates the database with 8 sample menu items including burgers, pizza, wings, salads, and more. Run it whenever you need to reset the menu data.

### Environment Variables
Both frontend and backend require environment variables. Never commit actual `.env` files to version control. Use the provided `.env.example` files as templates.

### Testing Strategy
- **Backend**: Integration tests for API endpoints, unit tests for models and services
- **Frontend**: Component tests, context tests, hook tests
- Tests follow TDD principles - written before or alongside implementation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Implement the feature
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🐛 Known Issues & Future Enhancements

### Potential Improvements:
- [ ] Add user authentication and authorization
- [ ] Implement order history
- [ ] Add payment gateway integration
- [ ] Include order cancellation feature
- [ ] Add admin dashboard for menu management
- [ ] Implement email/SMS notifications
- [ ] Add delivery tracking on map
- [ ] Include ratings and reviews

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

