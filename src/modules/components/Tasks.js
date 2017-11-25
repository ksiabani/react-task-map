import React, {Component} from 'react';

// A constant to keep sizes and size descriptions (missing from API?)
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
        // Initial state for tasks
        this.state = {
            translateX: 0,
            isPushLeftVisible: false,
            isPushRightVisible: true
        };
        this.pushRight = this.pushRight.bind(this);
        this.pushLeft = this.pushLeft.bind(this);
        this.updateCardsPosition = this.updateCardsPosition.bind(this);
    }

    componentDidMount() {
        // Re-position cards on window resize
        this.updateCardsPosition();
        window.addEventListener('resize', this.updateCardsPosition);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateCardsPosition);
    }

    updateCardsPosition() {
        // Re-position cards
        let vw = window.innerWidth;
        let cardsWidth = this.getCardWidth(vw) * 4;
        this.setState({
            translateX: 0,
            isPushLeftVisible: false,
            isPushRightVisible: vw < cardsWidth
        });
    }

    getCardWidth(vw) {
        // A simple algorithm to get card's width at a given resolution.
        // It's used to position cards on navigation (user clicks left or right nav buttons)
        if (vw >= 768 && vw < 992) {
            return ((vw - 10) / 2) - 4; //(vw - 10px)/ no of cards - margins
        }
        else if (vw >= 992 && vw < 1200) {
            return ((vw - 10) / 3) - 4;
        }
        else if (vw >= 1200) {
            return ((vw - 10) / 4) - 4;
        }
        return vw - 14;
    }

    pushRight() {
        // Move cards accordingly when user clicks the right nav button
        let vw = window.innerWidth;
        let cardsWidth = this.getCardWidth(vw) * 4;
        let newTranslateX = this.state.translateX + this.getCardWidth(vw);
        let activeTask = this.props.tasks.find(task => task.id === this.props.activeTaskId);
        let activeTaskIndex = this.props.tasks.indexOf(activeTask);
        if (activeTaskIndex < 3 && vw < 768) {
            let nextActiveTaskId = this.props.tasks[activeTaskIndex + 1].id;
            this.props.getActiveTaskId(nextActiveTaskId);
        }
        // While remaining card space is smaller than the viewport width
        if (cardsWidth - newTranslateX >= vw - 22) {
            this.setState({translateX: this.state.translateX + this.getCardWidth(vw) + 4});
        }
        // End of cards space, hide right nav button
        if (newTranslateX > cardsWidth - vw) {
            this.setState({isPushRightVisible: false});
        }
        // Show left nav button
        if (newTranslateX !== 0) {
            this.setState({isPushLeftVisible: true});
        }
    }

    pushLeft() {
        // Move cards accordingly when user clicks the left nav button
        let vw = window.innerWidth;
        let cardsWidth = this.getCardWidth(vw) * 4;
        let newTranslateX = this.state.translateX - this.getCardWidth(vw) - 4;
        this.setState({translateX: newTranslateX});
        let activeTask = this.props.tasks.find(task => task.id === this.props.activeTaskId);
        let activeTaskIndex = this.props.tasks.indexOf(activeTask);
        if (activeTaskIndex > 0 && vw < 768) {
            let prevActiveTaskId = this.props.tasks[activeTaskIndex - 1].id;
            this.props.getActiveTaskId(prevActiveTaskId);
        }
        // Back to start, hide left nav button
        if (newTranslateX === 0) {
            this.setState({isPushLeftVisible: false});
        }
        // Show right nav button
        this.setState({isPushRightVisible: true});
    }


    // Rendering tasks card
    render() {
        const {tasks, isLoading, error} = this.props;
        const {translateX, isPushLeftVisible, isPushRightVisible} = this.state;
        return (
            <div className="cards">
                {tasks.map(task =>
                    <div key={task.id} className={`card ${task.id === this.props.activeTaskId && 'is-active'}`}
                         onClick={this.props.getActiveTaskId.bind(this, task.id)}
                         style={{transform: `translateX(${translateX * -1}px)`}}>
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
                <div className={`cards__push cards__push--left ${isPushLeftVisible && 'is-visible'}`} onClick={this.pushLeft}>
                    <img src={ require('../../images/checkbox-arrow-left.png') }/>
                </div>
                <div className={`cards__push cards__push--right ${isPushRightVisible && 'is-visible'}`} onClick={this.pushRight}>
                    <img src={ require('../../images/checkbox-arrow-right.png') }/>
                </div>
            </div>
        )
    }
}

export default Tasks;


