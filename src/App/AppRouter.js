import { Router, Route, Switch } from "wouter";

import Users from './components/Users';
import Settings from './components/Settings';

import { Redirect } from 'wouter';
import Video from "./components/Video";


export default function AppRouter(){
    return (
        <Router>
            <Switch>
                <Route path='/users'><Users/></Route>
                <Route path='/settings'><Settings/></Route>
                <Route path='/video'><Video/></Route>
                <Route path='/profile'>Profile</Route>
                <Route path='/'>Home</Route>
                <Route><Redirect to={'/'}/></Route>
            </Switch>
        </Router>
    );
}