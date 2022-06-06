mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';

//create map
var map = new mapboxgl.Map({
container: 'map', // container id
style: 'mapbox://styles/mapbox/dark-v10' // map style URL from Mapbox Studio
});

// wait for map to load before adjusting it
map.on('load', () => {

map.addSource('cases', {
        type: 'geojson',
        data: 'assets/us-covid-2020-rates.json'
    });

    map.addLayer({
        'id': 'rates',
        'type': 'fill',
        'source': 'cases',
        'paint': {
            'fill-color': [
                'step',
                ['get', 'rates'],
                '#FFEDA0', // stop_output_0
                5, // stop_input_0
                '#FED976', // stop_output_1
                20, // stop_input_1
                '#FEB24C', // stop_output_2
                30, // stop_input_2
                '#FD8D3C', // stop_output_3
                50, // stop_input_3
                '#FC4E2A', // stop_output_4
                100, // stop_input_4
                '#E31A1C', // stop_output_5
                150, // stop_input_5
                '#BD0026', // stop_output_6
                200, // stop_input_6
                "#800026" // stop_output_7
            ],
            'fill-outline-color': '#BBBBBB',
            'fill-opacity': 0.7,
        }

    });

// set map bounds to the continental US
map.fitBounds([
    [-133.2421875, 16.972741],
    [-47.63671875, 52.696361]
]);

// make a pointer cursor
map.getCanvas().style.cursor = 'default';

// define layer names
var layers = [
    '0-10',
    '10-20',
    '20-50',
    '50-100',
    '100-200',
    '200-500',
    '500-1000',
    '1000+'
];
var colors = [
    '#FFEDA0',
    '#FED976',
    '#FEB24C',
    '#FD8D3C',
    '#FC4E2A',
    '#E31A1C',
    '#BD0026',
    '#800026'
];

// create legend
for (i = 0; i < layers.length; i++) {
    var layer = layers[i];
    var color = colors[i];
    var item = document.createElement('div');
    var key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;

    var value = document.createElement('span');
    value.innerHTML = layer;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
}

// change info window on hover
map.on('mousemove', (e) => {
    const features = map.queryRenderedFeatures(e.point);
    
    // Limit the number of properties we're displaying for
    // legibility and performance
    const displayProperties = [
        'county',
        'pop18',
        'cases',
        'deaths',
        'rates'
    ];
    
    const displayFeatures = features.map((feat) => {
    const displayFeat = {};
    displayProperties.forEach((prop) => {
    displayFeat[prop] = feat[prop];
    });
    return displayFeat;
    });
    
    // Write object as string with an indent of two spaces.
    document.getElementById('features').innerHTML = JSON.stringify(
    displayFeatures,
    null,
    2
    );
});
});