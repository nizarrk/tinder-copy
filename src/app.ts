import express, { Application, Request, Response, NextFunction } from "express";
import http from "http";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import moment from "moment";
import csurf from "csurf";
import response from "./tools/response";

dotenv.config({ path: path.join(__dirname, "../env/.env.dev") });

const app: Application = express();

app.use(morgan("dev"));

// Security Middleware
app.use(helmet());

// CORS Configuration
const corsOptions: cors.CorsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    // Check if the request should be allowed from the given origin
    // You can implement your own logic to validate the origin

    // Allow requests without a specified origin (e.g., Postman)
    const allowedOrigins = ["http://localhost"];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Middleware for parsing JSON
app.use(express.json());

// Middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Enable cookie parsing
// app.use(cookieParser('testing, ', { httpOnly: true }));

// Enable CSRF protection
// const csrfProtection = csurf({ cookie: true });
// app.use(csrfProtection);

// Serve static files from the 'uploads' directory
// app.use('/uploads', express.static('uploads'));

// Custom middleware to add timestamps
app.use((req: Request, res: Response, next: NextFunction) => {
  (req as any).customDate = moment().format("DD MMM YYYY HH:mm:ss");
  (req as any).customTime = moment().format("HH:mm:ss").toUpperCase();
  (req as any).customTimestamp = moment().format("YYYY-MM-DD HH:mm:ss").toUpperCase();
  (req as any).startTime = new Date().getTime();
  next();
});

// Routes registration
const routesDir = path.join(__dirname, './routes');

fs.readdirSync(routesDir).forEach(file => {
    const routePath = path.join(routesDir, file);
    const routePathWithoutExt = path.parse(routePath).name; // Remove file extension
    const adjustRouteName = routePathWithoutExt.replace('Routes', ''); // Remove word 'Routes' from routes file name    

    const dashedRoutePath = adjustRouteName.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();

    import(routePath).then(routeModule => {
        app.use(`/api/${dashedRoutePath}`, routeModule.default || routeModule);
    }).catch(error => {
        console.error(`Error loading route file '${routePath}':`, error);
    });
});

// app.get("/api/csrf-token", (req: Request, res: Response) => {
//   // res.cookie('XSRF-TOKEN', req.csrfToken());
//   const csrfToken = (req as any).csrfToken();
//   res.cookie('XSRF-TOKEN', csrfToken);
//   response(req, res, {
//     status: 200,
//     message: "Success"
//   });
// });

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Node.js!');
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  response(req, res, {
    status: err.status || 500,
    message: err.message || "Internal Server Error"
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.set("port", port);

const server = http.createServer(app);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  const addr = server.address();

  console.log(
    `[OK] ${process.env.SERVICE_NAME} running on port: ${process.env.PORT}`
  );
}
