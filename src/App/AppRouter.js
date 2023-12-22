import { Router, Route, Switch } from "wouter";

import Users from './components/Users';
import Home from './components/Home';
import Settings from './components/Settings';

export default function AppRouter(){
    return (
        <Router>
            <Switch>
                <Route path='/users'><Users/></Route>
                <Route path='/settings'><Settings/></Route>
                <Route><Home/></Route>
            </Switch>
        </Router>
    );
}