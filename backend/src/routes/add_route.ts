import { Router, Request, Response } from "express";
import { EventEmitter } from "events";
import mqtt from "mqtt";

const adEvents = new EventEmitter();

const mqttClient = mqtt.connect(process.env.MQTT_BROKER || "mqtt://localhost:1883");

mqttClient.on("connect", () => {
    console.log("Express połączony z brokerem MQTT");
    mqttClient.subscribe("reklamy");
});

mqttClient.on("message", (topic, message) => {
    adEvents.emit("new-ad", message);
});

const adsRoutes = Router();

adsRoutes.get("/", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL as string);
    res.setHeader("Access-Control-Allow-Credentials", "true");

    const sendSSE = (data: string) => {
        res.write(`data: ${data}\n\n`);
    };

    const adHandler = (data: string) => {
        sendSSE(data);
    };

    adEvents.on("new-ad", adHandler);

    const keepAlive = setInterval(() => {
        res.write(": keep-alive\n\n");
    }, 30000);

    req.on("close", () => {
        console.log("Klient SSE odłączony");
        adEvents.off("new-ad", adHandler);
        clearInterval(keepAlive);
        res.end();
    });
});

export default adsRoutes;
