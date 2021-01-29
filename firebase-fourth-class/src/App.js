import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import ChatPage from './components/ChatPage'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route exact path="/regist" component={RegisterPage} />
        <Route exact path="/chat" component={ChatPage} />
      </Switch>
    </Router>
  );
}

export default App;
