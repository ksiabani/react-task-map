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
    // Pass Google Maps API key and provide needed elenents
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
            // Get active task here, will pass coordinates in a moment. Also set initial center
            this.setState({
                activeTaskId: this.props.activeTaskId,
                activeTask: this.props.tasks.find(task => task.id === this.props.activeTaskId),
                center: {
                    lat: 59.91109599999999, lng: 10.7673005
                },
                // Get the map instance here
                onMapMounted: ref => {
                    refs.map = ref;
                },
                // Attempt to recenter on resize, the library contains a bug, won't work
                onBoundsChanged: () => {
                    this.setState({
                        center: refs.map.getCenter()
                    });
                },
            })
        },
        componentDidMount() {
            // Call the Directions API and pass the coordinates for pickup and delivery.
            // This happens on component load
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
            const DirectionsService = new google.maps.DirectionsService();
            // Call the Directions API again. This time component state change (user clicks a card)
            // Should move this to a function on its own, didn't
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
        // Call Google Maps passing default values
        <GoogleMap
            ref={props.onMapMounted}
            defaultZoom={14}
            defaultCenter={{lat: 59.91109599999999, lng: 10.7673005}}
            center={props.center}
            onBoundsChanged={props.onBoundsChanged}
        >
            {props.directions && <DirectionsRenderer defaultOptions={{"suppressMarkers": true}} directions={props.directions}/>}
            // Add our custom markers here. The library has another bug and won't place the second marker correctly
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

// Finally render the whole thing with Google maps, directions and custom markers
class Map extends React.PureComponent {

    render() {
        const {tasks, isLoading, error, activeTaskId} = this.props;
        return (
            <MapWithADirectionsRenderer tasks={tasks} activeTaskId={activeTaskId}/>
        )
    }
}

<Map />

export default Map;
