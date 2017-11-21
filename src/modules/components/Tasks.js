import React, {Component} from 'react';
import Client from '../../modules/Client';

class Tasks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            loading: true
        };
    };

    getTasks = () => {
        fetch(
            'https://api-test.nimber.com/jobs/filter.json?country_code=&date[type]=null&filter_visible=&from=Oslo&north_east=&order=DESC&page=1&per_page=20&place_search_method=&polyline=&search_types=pickup,delivery&size=null,1,2,3,4,5&sort=created_at&south_west=&state=buyable&X-API-Key=66467917eb9cee742b4f4c1f38419cca'
        )
            .then(function (response) {
                return response;
            })
            .then(response => {
                setTimeout(() => {
                    this.setState({
                        loading: false
                    });
                }, 300);
                return response.json();
            })
            .then(data => {
                this.setState({
                    tasks: data
                });
            })
            .catch(() => {
                console.log("Error fetching the data from server")
            });
    };

    componentWillMount() {
        this.getTasks();
    }

    render() {
        const tasks = this.state.tasks;
        if (!this.state.loading) {
            return (
                <div className="cards">
                    {tasks.map(task =>
                        <div key={task.id} className="card">
                            <div className="card__img">
                                <img
                                    src="https://d1xqbpwl1wh09p.cloudfront.net/avatars/60/fa7c/c030229b/60fa7cc030229b12a9b17f7071e143e5.jpg"/>
                            </div>
                            <div className="card__content">
                                <h2 className="card__content__title">iPhone SE</h2>
                                <h3 className="card__content__route">Oslo → Oslo</h3>
                                <h4 className="card__content__size">
                                    <span>XL</span>Fits in a big trailer
                                </h4>
                            </div>
                            <div className="card__price">€ 140</div>
                        </div>
                    )}
                    {/*   <div class="cards__push-left"><</div> */}
                    <div className="cards__push-right">&gt;</div>
                </div>
            )
        }
        else {
            return null;
        }
    }
}

export default Tasks;