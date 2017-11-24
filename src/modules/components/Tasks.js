import React, {Component} from 'react';

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
            translateX: 0,
            isPushLeftVisible: false,
            isPushRightVisible: true,
        };
        this.pushRight = this.pushRight.bind(this);
        this.pushLeft = this.pushLeft.bind(this);
        this.updateCardsPosition = this.updateCardsPosition.bind(this);
    }

    componentDidMount() {
        this.updateCardsPosition();
        window.addEventListener('resize', this.updateCardsPosition);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateCardsPosition);
    }

    updateCardsPosition() {
        this.setState({
            translateX: 0,
            isPushLeftVisible: false,
            isPushRightVisible: true
        });
    }

    getCardWidth(vw) {
        if (vw >= 768 && vw < 992) {
            return  vw / 2 - 10;
        }
        else if (vw >= 992) {
            return vw / 3 - 10;
        }
        return vw - 20;
    }

    pushRight() {
        let vw = window.innerWidth;
        let cardsWidth = this.getCardWidth(vw)*4;
        let newTranslateX = this.state.translateX + this.getCardWidth(vw);
        // TODO: Come up with a better formula
        if (newTranslateX <= cardsWidth - vw + 31) { // 30 is the margins
            this.setState({translateX: this.state.translateX + this.getCardWidth(vw)});
        }
        if (newTranslateX > cardsWidth - vw) {
            this.setState({isPushRightVisible: false});
        }
        if (newTranslateX !== 0) {
            this.setState({isPushLeftVisible: true});
        }
        // console.log(newTranslateX, cardsWidth, vw, cardsWidth - vw + 30);
    }

    pushLeft() {
        let vw = window.innerWidth;
        this.setState({translateX: this.state.translateX - this.getCardWidth(vw)});
        if (this.state.translateX === this.getCardWidth(vw)) {
            this.setState({isPushLeftVisible: false});
        }
    }


    render() {
        const {tasks, isLoading, error} = this.props;
        const {translateX, isPushLeftVisible, isPushRightVisible} = this.state;

        if (error) {
            return <p>{error.message}</p>;
        }

        if (isLoading) {
            return <p>Loading ...</p>;
        }

        return (
            <div className="cards">
                {tasks.map(task =>
                    <div key={task.id} className={`card ${task.id === this.props.activeTaskId && 'is-active'}`}
                         onClick={this.props.getActiveTaskId.bind(this, task.id)}
                         style={{transform: `translateX(-${translateX}px)`}}>
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
                <div className={`cards__push-left ${isPushLeftVisible && 'is-visible'}`} onClick={this.pushLeft}>
                    <img src={ require('../../images/checkbox-arrow-left.png') } />
                </div>
                <div className={`cards__push-right ${isPushRightVisible && 'is-visible'}`} onClick={this.pushRight}>
                    <img src={ require('../../images/checkbox-arrow-right.png') } />
                </div>
            </div>
        )
    }
}

export default Tasks;


