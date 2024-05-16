import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';

const HeatmapComponent = ({ data }) => {
    const ref = useRef(null);

    useEffect(() => {
        if (!data.length) return;

        fetch('data/states-10m.json')
            .then(response => response.json())
            .then(us => {
                // @ts-ignore
                const states = feature(us, us.objects.states).features;

                const svg = d3.select(ref.current);
                svg.selectAll('*').remove(); // Clear previous SVG content

                const projection = d3.geoAlbersUsa().scale(1300).translate([487.5, 305]);
                const path = d3.geoPath().projection(projection);

                // @ts-ignore
                const colorScale = d3.scaleSequential(d3.interpolateReds).domain([0, d3.max(data, d => d.average_hate_crimes_per_100k) || 0]);

                svg.append('g')
                    .selectAll('path')
                    .data(states)
                    .join('path')
                    .attr('d', path)
                    .attr('fill', d => {
                        // @ts-ignore
                        const stateData = data.find(item => item.state_name === d.properties.name);
                        return stateData ? colorScale(stateData.average_hate_crimes_per_100k) : '#fff';
                    })
                    .append('title')
                    .text(d => {
                        // @ts-ignore
                        const stateData = data.find(item => item.state_name === d.properties.name);
                        return stateData
                            ? `${stateData.state_name}: ${stateData.average_hate_crimes_per_100k.toFixed(2)} avg hate crimes per 100k`
                            // @ts-ignore
                            : `${d.properties.name}: No data`;
                    });
            });
    }, [data]);

    return <svg ref={ref} width={975} height={610} style={{ width: '100%', height: 'auto' }}></svg>;
};

export default HeatmapComponent;
