/*global google*/
import React from "react";

const {compose, withProps, lifecycle} = require("recompose");
const {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    DirectionsRenderer
} = require("react-google-maps");

const MapWithADirectionsRenderer = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBTvSpXxGotw0ZHxb-LB1W37kOzu_Q0b2s&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{height: `100vh`}}/>,
        containerElement: <div style={{height: `100vh`}}/>,
        mapElement: <div style={{height: `100%`}}/>
    }),
    withScriptjs,
    withGoogleMap,
    lifecycle({
        componentWillMount() {
            const refs = {};
            this.setState({
                activeTaskId: this.props.activeTaskId,
                activeTask: this.props.tasks.find(task => task.id === this.props.activeTaskId),
                center: {
                    lat: 59.91109599999999, lng: 10.7673005
                },
                onMapMounted: ref => {
                    refs.map = ref;
                },
                onBoundsChanged: () => {
                    this.setState({
                        center: refs.map.getCenter()
                    });
                },
            })
        },
        componentDidMount() {
            const DirectionsService = new google.maps.DirectionsService();
            const activeTask = this.state.activeTask;
            DirectionsService.route({
                origin: new google.maps.LatLng(activeTask.pickup_lat, activeTask.pickup_lng),
                destination: new google.maps.LatLng(activeTask.delivery_lat, activeTask.delivery_lng),
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
        },
        componentWillReceiveProps(props) {
            this.setState({
                activeTaskId: props.activeTaskId,
                activeTask: props.tasks.find(task => task.id === props.activeTaskId)
            });
            const activeTask = props.tasks.find(task => task.id === props.activeTaskId);
            // console.log(props.activeTaskId, activeTask);
            const DirectionsService = new google.maps.DirectionsService();
            // setTimeout(() => {
            DirectionsService.route({
                origin: new google.maps.LatLng(activeTask.pickup_lat, activeTask.pickup_lng),
                destination: new google.maps.LatLng(activeTask.delivery_lat, activeTask.delivery_lng),
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
        }
    })
)(props =>
        <GoogleMap
            ref={props.onMapMounted}
            defaultZoom={14}
            defaultCenter={{lat: 59.91109599999999, lng: 10.7673005}}
            center={props.center}
            onBoundsChanged={props.onBoundsChanged}
        >
            {props.directions && <DirectionsRenderer defaultOptions={{"suppressMarkers": true}} directions={props.directions}/>}
            <Marker
                icon={{
                    url: require('../../images/icon-marker-a.png')
                }}
                position={{lat: props.activeTask.pickup_lat, lng: props.activeTask.pickup_lng}}
            />
            <Marker
                icon={{
                    url: require('../../images/icon-marker-b.png')
                }}
                position={{lat: props.activeTask.delivery_lat, lng: props.activeTask.delivery_lng}}
            />
        </GoogleMap>
);


class Map extends React.PureComponent {

    render() {
        const {tasks, isLoading, error, activeTaskId} = this.props;
        // console.log(this.props)

        if (error) {
            return <p>{error.message}</p>;
        }

        if (isLoading) {
            return <p>Loading ...</p>;
        }
        return (
            <MapWithADirectionsRenderer tasks={tasks} activeTaskId={activeTaskId}/>
        )
    }
}

<Map />

export default Map;
