import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Map from './Map';
import MapRoute from './RouteMap';

class App extends Component {
  render() {
    return (
      <div className="App">
          <MapRoute/>
      </div>
    );
  }
}

export default App;
