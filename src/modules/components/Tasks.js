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
        let vw = window.innerWidth;
        let cardsWidth = this.getCardWidth(vw) * 4;
        this.setState({
            translateX: 0,
            isPushLeftVisible: false,
            isPushRightVisible: vw < cardsWidth
        });
    }

    getCardWidth(vw) {
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
        let vw = window.innerWidth;
        let cardsWidth = this.getCardWidth(vw) * 4;
        let newTranslateX = this.state.translateX + this.getCardWidth(vw);
        // While remaining card space is smaller than the viewport width
        if (cardsWidth - newTranslateX >= vw - 22) {
            this.setState({translateX: this.state.translateX + this.getCardWidth(vw) + 4});
        }
        if (newTranslateX > cardsWidth - vw) {
            this.setState({isPushRightVisible: false});
        }
        if (newTranslateX !== 0) {
            this.setState({isPushLeftVisible: true});
        }
    }

    pushLeft() {
        let vw = window.innerWidth;
        let cardsWidth = this.getCardWidth(vw) * 4;
        let newTranslateX = this.state.translateX - this.getCardWidth(vw) - 4;
        this.setState({translateX: newTranslateX});
        if (newTranslateX === 0) {
            this.setState({isPushLeftVisible: false});
        }
        this.setState({isPushRightVisible: true});
        // console.log(`
        //     newTranslateX: ${newTranslateX},
        //     cardsWidth: ${cardsWidth},
        //     cardWidth: ${this.getCardWidth(vw)},
        //     vw: ${vw}
        // `);

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
                <div className={`cards__push-left ${isPushLeftVisible && 'is-visible'}`} onClick={this.pushLeft}>
                    <img src={ require('../../images/checkbox-arrow-left.png') }/>
                </div>
                <div className={`cards__push-right ${isPushRightVisible && 'is-visible'}`} onClick={this.pushRight}>
                    <img src={ require('../../images/checkbox-arrow-right.png') }/>
                </div>
            </div>
        )
    }
}

export default Tasks;


