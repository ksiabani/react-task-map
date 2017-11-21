import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Map from './Map';
import MapRoute from './RouteMap';
import Header from './modules/components/Header';
import Tasks from './modules/components/Tasks';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Header/>
                <MapRoute/>
                <Tasks/>
            </div>
        );
    }
}

export default App;
