import React, { useState, useEffect } from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ReactNotifications from "react-notifications-component";
import notify from "./utils/Notification";
import CircularProgress from "@material-ui/core/CircularProgress";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const getMoviesInfo = async (movieId) => {
    const apiKey = "AIzaSyAy-aUazecNE_zg-vbPB_1oD5mQ487ATsY";
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${movieId}&key=${apiKey}&part=snippet,statistics&fields=items(id,snippet,statistics)`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setMovies((movies) => [...movies, data.items[0]]);
  };

  let urls = [];
  const renderMovies = (urls) => {
    urls.map((url) => {
      getMoviesInfo(getIdFromUrl(url));
    });
  };

  function getIdFromUrl(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return match && match[7].length == 11 ? match[7] : false;
  }

  function getParam(name) {
    const url = window.location.href;
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
  }

  const getUser = async () => {
    const token = localStorage.getItem("token") || getParam("api_key");
    if (token) {
      const url = `https://fakebook-fs.herokuapp.com/user/get_user`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", token);
        setUser(data.user);
      } else {
        setUser(null);
        localStorage.removeItem("token");
        notify("Error", `Fail to login!`, "error");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getUser();
    if (localStorage.getItem("movieUrls")) {
      urls = JSON.parse(localStorage.getItem("movieUrls"));
    }
    renderMovies(urls);
  }, []);

  return (
    <div className="App">
      <Navbar
        user={user}
        setUser={setUser}
        urls={urls}
        renderMovies={renderMovies}
      />
      <ReactNotifications />

      {loading ? (
        <CircularProgress />
      ) : (
        <div>
          <Switch>
            <Route path="/login">
              <Login setUser={setUser} />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/">
              <Home movies={movies} />
            </Route>
          </Switch>
        </div>
      )}
    </div>
  );
}

export default App;
