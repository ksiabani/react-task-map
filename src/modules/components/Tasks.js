import React, {Component} from 'react';

const url = 'https://api-test.nimber.com/jobs/filter.json?country_code=&date[type]=null&filter_visible=&from=Oslo&north_east=&order=DESC&page=1&per_page=20&place_search_method=&polyline=&search_types=pickup,delivery&size=null,1,2,3,4,5&sort=created_at&south_west=&state=buyable&X-API-Key=66467917eb9cee742b4f4c1f38419cca'
const sizes = [
    {size: "XS", description: "Fits in a pocket"},
    {size: "S", description: "Fits in a bag"},
    {size: "M", description: "Fits in a car"},
    {size: "L", description: "Fits in a big car"},
    {size: "XL", description: "Fits in a trailer"},
];

class Tasks extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tasks: [],
            isLoading: false,
            error: null,
        };
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

    render() {
        const {tasks, isLoading, error} = this.state;

        if (error) {
            return <p>{error.message}</p>;
        }

        if (isLoading) {
            return <p>Loading ...</p>;
        }

        return (
            <div className="cards">
                {tasks.map(task =>
                    <div key={task.id} className="card">
                        <div className="card__img">
                            <img
                                src={task.picture_location}/>
                        </div>
                        <div className="card__content">
                            <h2 className="card__content__title">{task.title}</h2>
                            <h3 className="card__content__route">{task.pickup_city} → {task.delivery_city}</h3>
                            <h4 className="card__content__size">
                                <span>{sizes[task.size - 1].size}</span>{sizes[task.size - 1].description}
                            </h4>
                        </div>
                        <div className="card__price">€ {task.task_price}</div>
                    </div>
                )}
                {/*   <div class="cards__push-left"><</div> */}
                <div className="cards__push-right">&gt;</div>
            </div>
        )
    }
}

export default Tasks;


