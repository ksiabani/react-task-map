import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
// import Map from './Map';
import MapRoute from './RouteMap';
import Header from './modules/components/Header';
import Tasks from './modules/components/Tasks';

const url = 'https://api-test.nimber.com/jobs/filter.json?country_code=&date[type]=null&filter_visible=&from=Oslo&north_east=&order=DESC&page=1&per_page=20&place_search_method=&polyline=&search_types=pickup,delivery&size=null,1,2,3,4,5&sort=created_at&south_west=&state=buyable&X-API-Key=66467917eb9cee742b4f4c1f38419cca';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tasks: [],
            isLoading: false,
            error: null,
            activeTaskId: 11931
        };
        this.getActiveTaskId = this.getActiveTaskId.bind(this);
    }

    componentDidMount() {
        this.setState({isLoading: true});
        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(data => this.setState({
                tasks: data,
                isLoading: false
            }))
            .catch(error => this.setState({error, isLoading: false}));
    }


    getActiveTaskId(taskId) {
        this.setState({activeTaskId: taskId});
    }

    render() {
        const {tasks, isLoading, error, activeTaskId} = this.state;
        return (
            <div className="App">
                <Header/>
                <MapRoute tasks={tasks} isLoading={isLoading} error={error} activeTaskId={activeTaskId}/>
                <Tasks tasks={tasks} isLoading={isLoading} error={error} activeTaskId={activeTaskId} getActiveTaskId={this.getActiveTaskId}/>
            </div>
        );
    }
}

export default App;
