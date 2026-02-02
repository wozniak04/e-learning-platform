import { Server, Socket } from "socket.io";
import mqtt from "mqtt";

export const setupChatSocket = (io: Server) => {
    const MQTT_BROKER = process.env.MQTT_BROKER || "mqtt://localhost:1883";
    const mqttClient = mqtt.connect(MQTT_BROKER);

    mqttClient.on("connect", () => {
        console.log("Chat Socket: Połączono z brokerem MQTT");

        mqttClient.subscribe("chats/response/#");
    });


    mqttClient.on("message", (topic, message) => {
        console.log("📥 MQTT:", topic);
        if (topic.startsWith("chats/response/")) {
            const courseId = topic.split("/")[2];
            try {
                const history = JSON.parse(message.toString());
                io.to(courseId).emit("chat-history", history);
            } catch (err) {
                console.error("Błąd parsowania historii z MQTT:", err);
            }
        }
    });


    io.on("connection", (socket: Socket) => {
        console.log(`📡 Nowy klient na czacie: ${socket.id}`);

        socket.on("join-course-chat", (courseId: string) => {
            socket.join(courseId);
            console.log(`👥 Klient ${socket.id} dołączył do: ${courseId}`);
            mqttClient.publish("chats/request", JSON.stringify({ courseId }));
        });


        socket.on("send-message", (data: { courseId: string; content: string; username: string }) => {
            const payload = {
                courseId: data.courseId,
                username: data.username,
                content: data.content
            };

            mqttClient.publish("chats/new-message", JSON.stringify(payload));

            io.to(data.courseId).emit("receive-message", {
                username: data.username,
                content: data.content,
                created_at: new Date().toISOString()
            });
        });

        socket.on("disconnect", () => {
            console.log(`Klient rozłączony: ${socket.id}`);
        });
    });

    mqttClient.on("error", (err) => {
        console.error("Chat Socket MQTT Error:", err);
    });
};