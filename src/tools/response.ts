import { Request, Response } from "express";
import message from "../configs/messages.json";
import fs from "fs";
import path from "path";

// Log into file
function resLog(req: Request, res: Response, data: any): void {    
    const logData = {
        endpoint: req.originalUrl,
        ip: req.ip?.substr(7),
        request: req.body,
        response: data,
        status: res.statusCode,
        datetime: (req as any).customDate,
        elapsed_time: (req as any).elapsedTime, // Add the elapsed time here if needed
    };

    // Define the log file path based on the current date
    const logDirectory = path.join(__dirname, "../../logs");
    const logFilePath = path.join(logDirectory, `${new Date().toISOString().split("T")[0]}.log`);

    // Check if the log directory exists, if not, create it
    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory, { recursive: true });
    }

    // Read existing log entries or create an empty array
    let logEntries: any[] = [];
    if (fs.existsSync(logFilePath)) {
        const logFileContent = fs.readFileSync(logFilePath, "utf8");
        logEntries = JSON.parse(logFileContent);
    }

    // Add the new log entry to the array
    logEntries.push(logData);

    // Write the updated array back to the log file
    fs.writeFileSync(logFilePath, JSON.stringify(logEntries, null, 2), "utf8");
}

export default (req: Request, res: Response, data: any): Response<any, Record<string, any>> => {
    // Logging to terminal
    // Limit request/response logging print character
    (req as any).elapsedTime = new Date().getTime() - (req as any).startTime;

    let request: string | undefined;

    if (req) {
        if (req.body && Object.keys(req.body).length > 0) {
            request = JSON.stringify(req.body).length > 3000
                ? JSON.stringify(req.body).substr(0, 3000) + " ..."
                : JSON.stringify(req.body);
        } else if (req.params && Object.keys(req.params).length > 0) {
            request = JSON.stringify(req.params).length > 3000
                ? JSON.stringify(req.params).substr(0, 3000) + " ..."
                : JSON.stringify(req.params);
        } else if (req.query && Object.keys(req.query).length > 0) {
            request = JSON.stringify(req.query).length > 3000
                ? JSON.stringify(req.query).substr(0, 3000) + " ..."
                : JSON.stringify(req.query);
        } else {
            request = "";
        }
    }

    let response = data.data
        ? JSON.stringify(data.data).length > 3000
            ? JSON.stringify(data.data).substr(0, 3000) + " ..."
            : JSON.stringify(data.data)
        : "";

    console.log("\n==========================================================");
    console.log(`STATUS       : ${data.status == 200 ? "OK" : "ERR"}`);
    console.log(`IP           : ${req?.ip ? req.ip.substr(7) : ""}`);
    console.log(`ENDPOINT     : ${req?.originalUrl || ""}`);
    console.log(`TIMESTAMP    : ${(req as any).customDate || ""}`);
    console.log("PROCESS TIME : " + ((req && (req as any).elapsedTime) || "0") + " ms");
    console.log("====================== REQUEST ===========================");
    console.log(request + "\n");
    console.log("====================== RESPONSE ==========================");
    console.log(response + "\n");
    console.log("==========================================================");

    let msg = data.status == 200 ? message.OK : message.ERR;
    msg.status = data.status;
    msg.from = process.env.SERVICE_NAME as string;
    msg.message = data.message;
    msg.data = data.data;

    // If env value return true, log into file
    if (process.env.APP_LOG == "true") {
        resLog(req, res, data);
    }

    if (req !== undefined) return res.status(msg.status).json(msg);
    // In case the request is undefined, still return the response to avoid TypeScript errors.
    return res.status(msg.status).json(msg);
};
