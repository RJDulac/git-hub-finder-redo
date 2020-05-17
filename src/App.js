import React, { useState, Fragment } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Users from "./components/users/Users";
import Search from "./components/users/Search";
import Alert from "./components/layout/Alert";
import About from "./components/pages/About";
import User from "./components/users/User";

import GithubState from "./context/github/GithubState";

import axios from "axios";

const App = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  //get single Github user
  const getUser = async username => {
    setLoading(true);
    try {
      const repsonse = await axios.get(
        `https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      );
      setUser(repsonse.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  //Get users repos
  const getUserRepos = async username => {
    setLoading(true);
    try {
      const repsonse = await axios.get(
        `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      );
      setRepos(repsonse.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const clearUsers = () => {
    setUsers([]);
    setLoading(false);
  };
  const showAlert = (message, type) => {
    setAlert({ message, type });

    setTimeout(() => setAlert(null), 5000);
  };
  return (
    <GithubState>
      <div>
        <Navbar />
        <div className="container">
          <Alert alert={alert} />
          <Switch>
            <Route
              exact
              path="/"
              render={props => (
                <Fragment>
                  <Search
                    clearUsers={clearUsers}
                    showClear={users.length > 0 ? true : false}
                    setAlert={showAlert}
                  />
                  <Users />
                </Fragment>
              )}
            />
            <Route exact path="/about" component={About} />
            <Route
              exact
              path="/user/:login"
              render={props => (
                <User
                  {...props}
                  getUser={getUser}
                  getUserRepos={getUserRepos}
                  user={user}
                  loading={loading}
                  repos={repos}
                />
              )}
            />
          </Switch>
        </div>
      </div>
    </GithubState>
  );
};

export default App;
