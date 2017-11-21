import React, {Component} from 'react';

class Tasks extends Component {
    render() {
        return (
            <div className="cards">
                <div className="card">
                    <div className="card__img">
                        <img src="https://d1xqbpwl1wh09p.cloudfront.net/avatars/60/fa7c/c030229b/60fa7cc030229b12a9b17f7071e143e5.jpg" />
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
                {/*   <div class="cards__push-left"><</div> */}
                <div className="cards__push-right">&gt;</div>
            </div>
        )
    }
}

export default Tasks;