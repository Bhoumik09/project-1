Here is a professional, ready-to-use `README.md` file for your repository. It covers all the steps you mentioned in a clear, organized format.

You can copy-paste this directly into your GitHub repository.

---

```markdown
# 4 in a Row (Connect Four) - Real-Time Multiplayer Game

A full-stack, real-time multiplayer implementation of the classic "4 in a Row" game. This project features real-time matchmaking, a competitive bot, persistent game history using PostgreSQL, and decoupled analytics processing using Apache Kafka.

## 🚀 Features

* **Real-Time Gameplay:** Seamless 1v1 matches using WebSockets (Socket.io).
* **Smart Matchmaking:** Auto-matches players or pairs with a bot if no opponent is found within 10s.
* **Competitive Bot:** An intelligent bot that blocks winning moves and plays strategically (not random).
* **Game Analytics:** Decoupled architecture using **Apache Kafka** to stream and process game events asynchronously.
* **Leaderboard:** Tracks wins, losses, and draws, stored persistently in **PostgreSQL**.
* **Resiliency:** Reconnection logic for disconnected players (30s window).

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS
* **Backend:** Node.js, Express, Socket.io
* **Database:** PostgreSQL
* **Message Broker:** Apache Kafka (with Zookeeper/KRaft)
* **DevOps:** Docker, Docker Compose

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (must be running)
* [Node.js](https://nodejs.org/) (v16 or higher)

---

## 🏃‍♂️ Getting Started

Follow these steps to get the project running locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/Bhoumik09/project-1.git](https://github.com/Bhoumik09/project-1.git)
cd project-1

```

### 2. Start Backend & Services (Docker)

We use Docker Compose to spin up the **Node.js Server**, **PostgreSQL Database**, and **Kafka Broker** all at once.

1. Make sure Docker Desktop is open and running.
2. Run the following command in the root directory:

```bash
docker-compose up -d --build

```

> **Note:** This may take a few minutes the first time as it downloads images and builds the server.
> * **Backend API** will run at: `http://localhost:5000`
> * **Database** will run on port `5432`
> * **Kafka** will run on port `9092`
> 
> 

### 3. Start the Frontend

The frontend is run locally outside of Docker for easier development and hot-reloading.

1. Open a new terminal.
2. Navigate to the frontend folder:
```bash
cd frontend

```


3. Install dependencies:
```bash
npm install

```


4. Start the development server:
```bash
npm run dev

```



**The game is now live at:** [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)

---

## 📂 Project Structure

```bash
├── frontend/           # React frontend application
├── server/             # Node.js backend & Game Logic
├── scripts/            # Database initialization SQL scripts
├── docker-compose.yml  # Orchestration for DB, Kafka, and Server
└── README.md           # You are here

```

## 🐛 Troubleshooting

* **Ports already in use?**
If you see errors about ports 5432, 9092, or 5000 being occupied, make sure to stop other local services or instances of Postgres/Kafka.
* **Database connection error?**
Ensure the Docker containers are healthy by running `docker ps`. The server waits for Postgres to be "healthy" before starting.

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

**Built by Nainsi**

```

```
