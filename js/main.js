mapboxgl.accessToken =
            'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
        let map = new mapboxgl.Map({
            container: 'map', 
            style: 'mapbox://styles/mapbox/dark-v10',
            zoom: 4, 
            projection: 'albers',
            center: [-100, 40] 
        });

        const grades = [100, 10000, 20000],
            colors = ['#fee0d2', '#fc9272', '#de2d26'],
            radii = [6, 12, 25];

        //load data to the map as new layers.
        //map.on('load', function loadingData() {
        map.on('load', () => { //simplifying the function statement: arrow with brackets to define a function
            // when loading a geojson, there are two steps
            // add a source of the data and then add the layer out of the source
            map.addSource('cases', { 
                type: 'geojson',
                data: 'assets/us-covid-2020-counts-final.json'
            });

            map.addLayer({
                    'id': 'cases-circle',
                    'type': 'circle',
                    'source': 'cases',
                    'minzoom': 3.4,
                    'paint': {
                        'circle-radius': {
                            'property': 'cases',
                            'stops': [
                                [{
                                    zoom: 5,
                                    value: grades[0]
                                }, radii[0]],
                                [{
                                    zoom: 5,
                                    value: grades[1]
                                }, radii[1]],
                                [{
                                    zoom: 5,
                                    value: grades[2]
                                }, radii[2]]
                            ]
                        },
                        'circle-color': {
                            'property': 'cases',
                            'stops': [
                                [grades[0], colors[0]],
                                [grades[1], colors[1]],
                                [grades[2], colors[2]]
                            ]
                        },
                        'circle-stroke-color': 'white',
                        'circle-stroke-width': 1,
                        'circle-opacity': 0.6
                    }
                },
                'waterway-label'
            );

            // click on tree to view magnitude in a popup
            map.on('click', 'cases-circle', (event) => {
                new mapboxgl.Popup()
                    .setLngLat(event.features[0].geometry.coordinates)
                    .setHTML(`<strong>Counts:</strong> ${event.features[0].properties.cases}`)
                    .addTo(map);
            });

        });

        // create legend
        const legend = document.getElementById('legend');

        //set up legend grades and labels
        var labels = ['<strong>Counts</strong>'],
            vbreak;
        //iterate through grades and create a scaled circle and label for each
        for (var i = 0; i < grades.length; i++) {
            vbreak = grades[i];

            dot_radii = 2 * radii[i];

            labels.push(
                '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
                'px; height: ' +
                dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
                '</span></p>');

        }
        const source =
            '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">The New York Times</a></p>';
        legend.innerHTML = labels.join('') + source;