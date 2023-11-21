import { createContext, useEffect, useContext, useReducer } from "react";

const BASE_URL = "http://localhost:9000";

const CitiesContex = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: "",
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loaded":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, currentCity: action.payload, isLoading: false };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((val) => val.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      return { ...state, error: action.payload };
    default:
      throw new Error("Unkown action");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );
  useEffect(function () {
    async function fetchData() {
      dispatch({ type: "loaded" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "there is something issue while fetching data",
        });
      }
    }
    fetchData();
  }, []);

  async function getCity(id) {
    if (Number(id) === currentCity.id) return;

    dispatch({ type: "loaded" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "there is something issue while fetching city",
      });
    }
  }

  async function createCity(newCity) {
    dispatch({ type: "loaded" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "there is something issue while Creating city",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loaded" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "there is something issue while deleting city",
      });
    }
  }

  return (
    <CitiesContex.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContex.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContex);
  if (context === undefined)
    throw new Error("Access Context out side of provider");
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { CitiesProvider, useCities };
