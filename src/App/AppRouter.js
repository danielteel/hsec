import { Router, Route, Link, Switch } from "wouter";

import Users from './components/Users';
import Home from './components/Home';

export default function AppRouter(){
    return (
        <Router>
            <Switch>
                <Route path='/users'><Users/></Route>
                <Route><Home/></Route>
            </Switch>
        </Router>
    );
}