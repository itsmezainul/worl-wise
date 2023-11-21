import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContex";

function CountriesList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;
  if (!cities.length)
    return (
      <Message message="Add your first country by clicking on a country on the map" />
    );

  const countries = cities.reduce((arr, city) => {
    if (!arr.map((val) => val.country).includes(city.country))
      return [
        ...arr,
        { country: city.country, emoji: city.emoji, id: city.id },
      ];
    else return arr;
  }, []);
  return (
    <ul className={styles.countryList}>
      {countries.map((val) => (
        <CountryItem country={val} key={val.id} />
      ))}
    </ul>
  );
}

export default CountriesList;
