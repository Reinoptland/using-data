import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import logo from "./logo.svg";
import "./App.css";

// 1. We want to fetch the data -> data, setData
// 2. We want to display the data
// 3. We want to display loading -> loading, setLoading
// 4. We want to display errors -> error, setError

function useAdvice() {
  const [apiStatus, setApiStatus] = useState({
    query: "love",
    data: [],
    loading: false,
    error: "",
  });

  useEffect(() => {
    async function fetchAdvice() {
      setApiStatus((previousStatus) => {
        return { ...previousStatus, loading: true, error: "" };
      });

      try {
        const response = await fetch(
          `https://api.adviceslip.com/advice/search/${apiStatus.query}`
        );

        if (response.status === 404) {
          return setApiStatus((previousStatus) => {
            return {
              ...previousStatus,
              loading: false,
              data: [],
              error: "Please enter a search term",
            };
          });
        }

        const advice = await response.json();

        if (advice.message) {
          return setApiStatus((previousStatus) => {
            return {
              ...previousStatus,
              loading: false,
              data: [],
              error: advice.message.text,
            };
          });
        }

        setApiStatus((previousStatus) => {
          return { ...previousStatus, loading: false, data: advice.slips };
        });
      } catch (error) {
        return setApiStatus((previousStatus) => {
          return {
            ...previousStatus,
            loading: false,
            data: [],
            error: error.message,
          };
        });
      }
    }

    fetchAdvice();
  }, [apiStatus.query]);

  function changeHandler(newQuery) {
    setApiStatus((previousStatus) => {
      return { ...previousStatus, query: newQuery };
    });
  }

  return { apiStatus, changeHandler };
}

function App() {
  const {
    apiStatus: { query, error, loading, data },
    changeHandler,
  } = useAdvice();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Get wise with advice</h1>
        <label htmlFor="query">
          What do you want advice about?
          <input
            name="query"
            value={query}
            onChange={(e) => changeHandler(e.target.value)}
          />
        </label>
        {loading && <img src={logo} className="App-logo" alt="logo" />}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div>
          {data.map((slip) => {
            return <p key={slip.id}>{slip.advice}</p>;
          })}
        </div>
      </header>
    </div>
  );
}

export default App;
