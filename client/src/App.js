import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";


import Serials from './pages/Serials';
import Tinder from './pages/Tinder';
import Badoo from './pages/Badoo';


export default function App() {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/serials">Serials</Link>
                        </li>
                        <li>
                            <Link to="/tinder">Tinder</Link>
                        </li>
                        <li>
                            <Link to="/badoo">Badoo</Link>
                        </li>
                    </ul>
                </nav>

                <Switch>
                    <Route path="/serials">
                        <Serials />
                    </Route>
                    <Route path="/tinder">
                        <Tinder />
                    </Route>
                    <Route path="/badoo">
                        <Badoo />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}