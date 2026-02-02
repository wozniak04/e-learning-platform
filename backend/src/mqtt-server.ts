import mqtt from "mqtt";
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();
const MQTT_BROKER = "mqtt://localhost:1883";
const INTERVAL = 10000;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432"),
});
const adsDatabase = [
    { ad: "Zostań mistrzem AI: Zobacz Kurs Python w AI nr 12!", link: "/course/e15fd8b3d2" },
    { ad: "Opanuj bazy danych: Zobacz Kurs SQL!", link: "/course/dea4eb8ada" },
    { ad: "Zacznij programować: Zobacz Python 101!", link: "/course/7c4e75e309" },
    { ad: "Twórz piękne interfejsy: Zobacz Kurs Frontend!", link: "/course/0a6d170364" },
    { ad: "Zarządzaj kodem jak pro: Zobacz Git Expert!", link: "/course/74eeec0c45" },
    { ad: "PostgreSQL od podstaw: Zobacz Kurs PostgreSQL Mastery!", link: "/course/f992761b2f" },
    { ad: "Nowość: Zobacz Kurs React od Podstaw nr 1!", link: "/course/ead430b721" },
    { ad: "Zaawansowany backend: Zobacz Kurs Node.js Zaawansowany nr 3!", link: "/course/1433ea903c" },
    { ad: "Projektuj mądrze: Zobacz Kurs Design Patterns nr 4!", link: "/course/b810653bb3" },
];


const client = mqtt.connect(MQTT_BROKER);

client.on("connect", () => {
    console.log('mqtt uruchomiony');

    client.subscribe(["chats/request", "chats/new-message"], (err) => {
        if (!err) console.log("Nasłuchiwanie na zapytania o czat aktywne");
    });

    const publishRandomAd = () => {
        const randomIndex = Math.floor(Math.random() * adsDatabase.length);
        const selectedAd = adsDatabase[randomIndex];


        const payload = JSON.stringify(selectedAd)

        client.publish("reklamy", payload, { qos: 1 }, (err) => {
            if (err) {
                console.error("Błąd wysyłki MQTT:", err);
            } else {
                console.log(`Wysłano: ${selectedAd}`);
            }
        });
    };


    publishRandomAd();
    setInterval(publishRandomAd, INTERVAL);

    client.on("message", async (topic, message) => {
        if (topic === "chats/request") {
            try {
                const { courseId } = JSON.parse(message.toString());
                console.log(`Zapytanie o historię dla kursu: ${courseId}`);


                const result = await pool.query(
                    "SELECT username, content, created_at FROM public.chat_messages WHERE course_id = $1 ORDER BY created_at ASC LIMIT 50",
                    [courseId]
                );

                const responseTopic = `chats/response/${courseId}`;
                const payload = JSON.stringify(result.rows);


                client.publish(responseTopic, payload, { qos: 1 });
                console.log(`Odesłano ${result.rows.length} komentarzy dla ${courseId}`);
            } catch (err) {
                console.error("Błąd podczas przetwarzania zapytania czatu:", err);
            }
        }
        else if (topic === "chats/new-message") {
            try {
                const { courseId, username, content } = JSON.parse(message.toString());
                console.log(`Nowa wiadomość w kursie ${courseId} od ${username}: ${content}`);
                await pool.query(
                    "INSERT INTO public.chat_messages (course_id, username, content, created_at) VALUES ($1, $2, $3, NOW())",
                    [courseId, username, content]
                );

            } catch (err) {
                console.error("Błąd podczas przetwarzania nowej wiadomości czatu:", err);
            }
        }
    });
});

client.on("error", (err) => {
    console.error("Błąd połączenia z brokerem MQTT:", err);
});