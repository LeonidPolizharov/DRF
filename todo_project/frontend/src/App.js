import React from 'react';
import logo from './logo.svg';
import './App.css';
import UserList from './components/User.js';
import Navbar from './components/Menu.js';
import Footer from './components/Footer.js';
import axios from 'axios'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";
import {ProjectList, ProjectDetail} from './components/Project.js'
import ToDoList from './components/ToDo.js'
import LoginForm from './components/Auth.js';

const DOMAIN = 'http://127.0.0.1:8001/api/'
const get_url = (url) => `${DOMAIN}${url}`


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      navbarItems: [
          {name: 'Users', href: '/'},
          {name: 'Projects', href: '/projects'},
          {name: 'TODOs', href: '/todos'},
          {name: 'Token', href: '/token'},
      ],
      users: [],
      projects: [],
      project: {},
      todos: []
  }
}

set_token(token) {
    const cookies = new Cookies()
    cookies.set('token', token)
    this.setState({'token': token}, () => this.load_data())
}

is_authenticated() {
    return this.state.token != ''
}

logout() {
    this.set_token('')
}

get_token_from_storage() {
    const cookies = new Cookies()
    const token = cookies.get('token')
    this.setState({'token': token}, () => this.load_data())
}

get_token(username, password) {

    axios
        .post('http://127.0.0.1:8000/api-token-auth/', {
            username: username,
            password: password
        })
        .then(response => {
            this.set_token(response.data['token'])
            console.log(this.state.token)
        })
        .catch(error => alert('Неверный логин или пароль'))
}

get_headers() {
    let headers = {
        'Content-Type': 'application/json'
    }
    if (this.is_authenticated()) {
        headers['Authorization'] = 'Token ' + this.state.token
    }
    return headers
}

load_data() {
    const headers = this.get_headers()
    axios
        .get('http://127.0.0.1:8000/api/users', {headers})

        .then(response => {
            const users = response.data.results
            this.setState(
                {
                    'users': users
                }
            )
        })
        .catch(error => {
            console.log(error)
            this.setState({users: []})
        })


    axios
        .get('http://127.0.0.1:8000/api/projects', {headers})
        .then(response => {
            const projects = response.data.results
            this.setState(
                {
                    'projects': projects
                }
            )
        })
        .catch(error => console.log(error))


    axios
        .get('http://127.0.0.1:8000/api/todos', {headers})
        .then(response => {
            const todos = response.data.results
            this.setState(
                {
                    'todos': todos
                }
            )
        })
        .catch(error => console.log(error))
}

componentDidMount() {
    this.get_token_from_storage()
    // this.load_data()
}

  render() {
    return (
        <Router>
            <header>
                <Navbar navbarItems={this.state.navbarItems}/>
            </header>
            <main role="main" className="flex-shrink-0">
                <div className="container">
                    <Switch>
                        <Route exact path='/'>
                            <UserList users={this.state.users}/>
                        </Route>
                        <Route exact path='/projects'>
                            <ProjectList items={this.state.projects}/>
                        </Route>
                        <Route exact path='/todos'>
                            <ToDoList items={this.state.todos}/>
                        </Route>
                        <Route exact path='/login' component={() => <LoginForm
                                get_token={(username, password) => this.get_token(username, password)}/>}/>
                            <Route path="/project/:id">
                                <ProjectPage projects={this.state.projects}/>
                        </Route>
                        <Route path="/project/:id" children={<ProjectDetail getProject={(id) => this.getProject(id)}
                                                                            item={this.state.project}/>}/>
                    </Switch>
                </div>
            </main>
            <Footer/>
        </Router>


    )
  }
}


export default App;