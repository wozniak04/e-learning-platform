import mqtt from "mqtt";


const MQTT_BROKER = "mqtt://localhost:1883";
const TOPIC = "reklamy";
const INTERVAL = 2000;

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
    console.log(`Ad Publisher uruchomiony. Rozsyłam reklamy na temat: ${TOPIC}`);

    const publishRandomAd = () => {
        const randomIndex = Math.floor(Math.random() * adsDatabase.length);
        const selectedAd = adsDatabase[randomIndex];


        const payload = JSON.stringify(selectedAd)

        client.publish(TOPIC, payload, { qos: 1 }, (err) => {
            if (err) {
                console.error("Błąd wysyłki MQTT:", err);
            } else {
                console.log(`Wysłano: ${selectedAd}`);
            }
        });
    };


    publishRandomAd();
    setInterval(publishRandomAd, INTERVAL);
});

client.on("error", (err) => {
    console.error("Błąd połączenia z brokerem MQTT:", err);
});