import { Router, Route, Switch } from "wouter";
import Login from "./Login";

export default function Authenticate(){
    return (
        <Router>
            <Switch>
                <Route path='/signup'>Signup</Route>
                <Route path='/verifysignup'>Verify Signup</Route>
                <Route path='/forgotpassword'>Forgot Password</Route>
                <Route path='/verifyforgot'>Verify Forgot</Route>
                <Route><Login/></Route>
            </Switch>
        </Router>
    );
}