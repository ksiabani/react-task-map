import React, {Component} from 'react';
import Loader from 'react-loaders';
import Map from './modules/components/Map';
import Header from './modules/components/Header';
import Tasks from './modules/components/Tasks';
import './App.css';

const endPoint = 'https://api-test.nimber.com/jobs/filter.json?country_code=&date[type]=null&filter_visible=&from=Oslo&north_east=&order=DESC&page=1&per_page=20&place_search_method=&polyline=&search_types=pickup,delivery&size=null,1,2,3,4,5&sort=created_at&south_west=&state=buyable&X-API-Key=66467917eb9cee742b4f4c1f38419cca';

class App extends Component {

    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            tasks: [],
            isLoading: false,
            error: null,
            activeTaskId: 11931
        };
        this.getActiveTaskId = this.getActiveTaskId.bind(this);
    }

    componentDidMount() {
        // Prepare headers
        let myHeaders = new Headers();
        myHeaders.append('Access-Control-Allow-Origin', '*');
        let myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default'
        };
        this.setState({isLoading: true});

        // Send GET with fetch and basic error handling
        fetch(endPoint, myInit)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Oops! Something went wrong...');
                }
            })
            .then(data => this.setState({
                tasks: data,
                isLoading: false
            }))
            .catch(error => this.setState({error, isLoading: false}));
    }

    // Set active task id when on card click
    getActiveTaskId(taskId) {
        this.setState({activeTaskId: taskId});
    }

    // App rendering happens here
    render() {
        const {tasks, isLoading, error, activeTaskId} = this.state;

        // If something went wrong while fetching data from server, return error message
        if (error) {
            return <p>{error.message}</p>;
        }
        // Wait for fetched data before showing components. In the meantime, show a loader
        return (
            <div className="app">
                {isLoading && <Loader type="ball-pulse-sync" active={true} />}
                {!isLoading && <Header/>}
                {!isLoading && <Map tasks={tasks} activeTaskId={activeTaskId}/>}
                {!isLoading && <Tasks tasks={tasks} activeTaskId={activeTaskId} getActiveTaskId={this.getActiveTaskId}/>}
            </div>
        );

    }
}

export default App;
