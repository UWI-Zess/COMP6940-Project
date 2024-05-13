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
                svg.selectAll("*").remove(); // Clear previous SVG content

                const projection = d3.geoAlbersUsa().scale(1300).translate([487.5, 305]);
                const path = d3.geoPath().projection(projection);

                const colorScale = d3.scaleSequentialLog(d3.interpolateReds)
                    .domain(
                        // @ts-ignore
                        [1, d3.max(data, d => d.count)]
                    );

                svg.append("g")
                    .selectAll("path")
                    .data(states)
                    .join("path")
                    .attr("d", path)
                    .attr("fill", d => {
                        // @ts-ignore
                        const stateData = data.find(item => item.state === d.properties.name);
                        return stateData ? colorScale(stateData.count) : '#fff';
                    })
                    .append("title")
                    .text(
                        // @ts-ignore
                        d => `${d.properties.name}: ${data.find(item => item.state === d.properties.name)?.count || 0} incidents`
                    );
            });
    }, [data]);

    return <svg ref={ref} width={975} height={610} style={{ width: '100%', height: 'auto' }}></svg>;
};

export default HeatmapComponent;
