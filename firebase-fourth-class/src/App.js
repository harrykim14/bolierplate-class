import './App.css';
import React, { useEffect } from 'react'
import { Switch, Route, Link, useHistory } from 'react-router-dom';
import ChatPage from './components/ChatPage/ChatPage'
import LoginPage from './components/LoginPage/LoginPage'
import RegisterPage from './components/RegisterPage/RegisterPage'
import firebase from './firebase';
import { useDispatch, useSelector } from 'react-redux'; 
import { setUser } from './redux/actions/user_action';

function App() {

  let history = useHistory();
  let dispatch = useDispatch();
  const isLoading = useSelector(state => state.user.isLoading)

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      console.log(user)

      if (user) {
        // 이미 로그인 함
        history.push("/");
        dispatch(setUser(user));
      } else {
        history.push("/login");
      }
    })
  }, [])

  if (isLoading) {
    return (
      <div>
        ...loading
      </div>
    )
  } else {
    return (
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/regist" component={RegisterPage} />
        <Route exact path="/" component={ChatPage} />
      </Switch>
  );
  }  
}

export default App;
