import { Router, Route, Switch, useParams } from "wouter";

import Users from './components/Users';
import Settings from './components/Settings';

import { Redirect } from 'wouter';
import Video from "./components/Video";
import Profile from "./components/Profile";


function RedirectWithParams({to, params}){
    const inParams = useParams();
    for (const p of params){
        to+='/'+inParams[p];
    }
    return <Redirect to={to}/>
}


export default function AppRouter(){
    return (
        <Router>
            <Switch>
                <Route path='/users'><Users/></Route>
                <Route path='/settings'><Settings/></Route>
                <Route path='/video/:title?/:type?'><Video/></Route>
                <Route path='/profile/:email?/:confirmCode?'><Profile/></Route>
                <Route path='/'>Home</Route>
                <Route><Redirect to={'/'}/></Route>
            </Switch>
        </Router>
    );
}