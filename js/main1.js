mapboxgl.accessToken =
            'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    zoom: 3.8, // starting zoom
    projection: 'albers',
    center: [-100, 40] // starting center
});


async function geojsonFetch() {

    let response = await fetch('assets/us-covid-2020-rates-final.json');
    //let response
    let stateData = await response.json();
    // other operations
};


map.on('load', function loadingData() {
    // Insert const stuff here for legend
    const layers = [ // TODO: layer and coolors need to change
        '0-5',
        '6-19',
        '20-39',
        '39-49',
        '50-99',
        '100-149',
        '150 and more'
    ];

    const colors = [
        '#FFEDA070',
        '#FED97670',
        '#FEB24C70',
        '#FD8D3C70',
        '#FC4E2A70',
        '#E31A1C70',
        '#BD002670',
        '#80002670'
    ];

    // add layer
    // add legend
    map.addSource('covidrates', { 
        type: 'geojson',
        data: 'assets/us-covid-2020-rates-final.json' // 
    });

    map.addLayer({
        'id': 'covidrates',
        'type': 'fill',
        'source': 'covidrates',
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

    const legend = document.getElementById('legend');
    legend.innerHTML = "<br><b>Covid Rates</b><br>";

    layers.forEach((layer, i) => {
        const color = colors[i];
        const item = document.createElement('div');
        const key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        const value = document.createElement('span');
        value.innerHTML = `${layer}`;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
    });

    map.on('mousemove', ({
        point
    }) => {
        const state = map.queryRenderedFeatures(point, {
            layers: ['covidrates']
        });
        document.getElementById('text-description').innerHTML = state.length ?
            `<h3>${state[0].properties.county}</h3><p><strong><em>${state[0].properties.state}</strong> people per square mile</em></p>` :
            `<p>Hover over a state!</p>`;
    });

});
const source =
    '<p style="text-align: right; font-size:10pt">Source: <a href="https://data.census.gov/cedsci/table?g=0100000US%24050000&d=ACS%205-Year%20Estimates%20Data%20Profiles&tid=ACSDP5Y2018.DP05&hidePreview=true">USGS</a></p>';
// combine all the html codes.
legend.innerHTML = labels.join('') + source;
geojsonFetch();