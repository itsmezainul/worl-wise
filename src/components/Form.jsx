// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import Message from "./Message";
import Spinner from "./Spinner";
import { useUrlLoaction } from "../hooks/useUrlLoaction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../contexts/CitiesContex";
import { useNavigate } from "react-router-dom";
const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [lat, lng] = useUrlLoaction();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isGeoCadingLoading, setIsGeoCodingLoading] = useState(false);
  const [isGeoCodingError, setIsGeoCodingError] = useState("");
  const [emoji, setEmoji] = useState("");
  const navigate = useNavigate();

  const { createCity, isLoading } = useCities();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !emoji) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat,
        lng,
      },
    };
    await createCity(newCity);
    navigate("/app/cities");
  }
  useEffect(
    function () {
      if (!lat || !lng) return;
      async function fetchCityData() {
        try {
          setIsGeoCodingLoading(true);
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          setCityName(data.city || data.locality || "");
          setCountry(data.countryName || "");
          setEmoji(convertToEmoji(data.countryCode));
          if (data.countryCode === "")
            throw new Error(
              "That seems to be no county found please choose valid country "
            );
        } catch (error) {
          setIsGeoCodingError(error.message);
        } finally {
          setIsGeoCodingLoading(false);
        }
      }
      setIsGeoCodingError("");
      fetchCityData();
    },
    [lat, lng]
  );

  if (isGeoCadingLoading) return <Spinner />;

  if (isGeoCodingError) return <Message message={isGeoCodingError} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={(e) => handleSubmit(e)}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
