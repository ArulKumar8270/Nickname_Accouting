const jsonServer = require("json-server");
const server     = jsonServer.create();
const router     = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);


const USERS = [
  { email: "user1@gmail.com",        password: "pass123",  role: "user"  },
  { email: "user2@gmail.com",        password: "pass123",  role: "user"  },
  { email: "user3@gmail.com",        password: "pass123",  role: "user"  },
  { email: "user4@gmail.com",        password: "pass123",  role: "user"  },
  { email: "user5@gmail.com",        password: "pass123",  role: "user"  },
  { email: "user6@gmail.com",        password: "pass123",  role: "user"  },
  { email: "user7@gmail.com",        password: "pass123",  role: "user"  },
  { email: "user8@gmail.com",        password: "pass123",  role: "user"  },
  { email: "aapi1329@gmail.com",     password: "pass123",  role: "user"  },
  { email: "rifayasafi11@gmail.com", password: "rifaya97", role: "user"  },
  { email: "admin@gmail.com",        password: "admin123", role: "admin" },
];

// Login route — must be before router
server.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = USERS.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  res.json({ email: user.email, role: user.role, name: user.email.split("@")[0] });
});

// json-server handles all other /api/* routes via db.json
server.use("/api", router);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});