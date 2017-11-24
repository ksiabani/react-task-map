/*global google*/
import React from "react";

const {compose, withProps, lifecycle} = require("recompose");
const {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    DirectionsRenderer
} = require("react-google-maps");

const MapWithADirectionsRenderer = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyATXfxvxETsCpLVUcYHFlNrM4qNgM0-VLo&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{height: `100vh`}}/>,
        containerElement: <div style={{height: `100vh`}}/>,
        mapElement: <div style={{height: `100%`}}/>,
    }),
    withScriptjs,
    withGoogleMap,
    lifecycle({
        componentWillMount() {
            const refs = {};
            this.setState({
                center: {
                    lat: 41.9, lng: -87.624
                },
                onMapMounted: ref => {
                    refs.map = ref;
                },
                onBoundsChanged: () => {
                    this.setState({
                        center: refs.map.getCenter()
                    });
                    // google.maps.event.trigger(this._mapComponent, "resize");
                },
            })
        },
        componentDidMount() {
            const DirectionsService = new google.maps.DirectionsService();
            const {tasks, isLoading, error} = this.props;
            // TODO: Do I need this timeout?
            setTimeout(() => {
                DirectionsService.route({
                    origin: new google.maps.LatLng(tasks[0].pickup_lat, tasks[0].pickup_lng),
                    destination: new google.maps.LatLng(tasks[0].delivery_lat, tasks[0].delivery_lng),
                    travelMode: google.maps.TravelMode.DRIVING,
                }, (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        this.setState({
                            directions: result,
                        });
                    } else {
                        console.error(`error fetching directions ${result}`);
                    }
                });
            }, 0);
        }
    })
)(props =>
    <GoogleMap
        ref={props.onMapMounted}
        defaultZoom={7}
        center={props.center}
        onBoundsChanged={props.onBoundsChanged}
    >
        {props.directions && <DirectionsRenderer directions={props.directions}/>}
    </GoogleMap>
);


class Map extends React.PureComponent {

    // constructor(props) {
    //     super(props);
    // }

    componentWillMount() {
    }

    componentDidMount() {
    }

    render() {
        const {tasks, isLoading, error} = this.props;

        if (error) {
            return <p>{error.message}</p>;
        }

        if (isLoading) {
            return <p>Loading ...</p>;
        }
        return (
            <MapWithADirectionsRenderer tasks={tasks}/>
        )
    }
}

<Map />

export default Map;