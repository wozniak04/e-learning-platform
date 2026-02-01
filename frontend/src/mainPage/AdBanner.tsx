import { useEffect, useState } from "react";
import { BACKEND_URL } from "../variables";
import { Link } from "react-router-dom";
import "./AdBanner.css"; // Import stylów

interface AdData {
  ad: string;
  link: string;
}

const AdBanner = () => {
  const [adData, setAdData] = useState<AdData | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(`${BACKEND_URL}/reklamy`, {
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setAdData(data);
      } catch (err) {
        setAdData({ ad: event.data, link: "#" });
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  if (!adData) return null;

  return (
    <div className="ad-banner-container">
      <div className="ad-text">
        <strong>OKAZJA: </strong> {adData.ad}
      </div>

      <Link to={adData.link} className="ad-link">
        Sprawdź ofertę →
      </Link>

      <button
        className="ad-close-btn"
        onClick={() => setAdData(null)}
        aria-label="Zamknij">
        ×
      </button>
    </div>
  );
};

export default AdBanner;
