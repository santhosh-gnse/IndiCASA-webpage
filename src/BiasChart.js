import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./BiasChart.css";

const BiasChart = ({ data }) => {
	const chartContainerRef = useRef(null);
	const tooltipRef = useRef(null);
	const [encoderView, setEncoderView] = useState("faceted");
	const [biasView, setBiasView] = useState("faceted");

	// Extract unique categories
	const lossTypes = Array.from(new Set(data.map((d) => d.Loss))).sort(
		(a, b) => {
			if (a === "Bare Model") return -1;
			if (b === "Bare Model") return 1;
			return a.localeCompare(b);
		}
	);

	const biasTypes = Array.from(new Set(data.map((d) => d["Bias Type"])));

	useEffect(() => {
		if (!data || data.length === 0) return;

		const updateVisualization = () => {
			// Filter data based on bias view
			let filteredData = data;
			if (biasView === "overall") {
				filteredData = data.filter((d) => d["Bias Type"] === "Overall");
			}

			const activeBiasTypes = Array.from(
				new Set(filteredData.map((d) => d["Bias Type"]))
			);

			// Group/aggregate data based on encoder view
			let chartData = [];

			if (encoderView === "faceted") {
				const groupedByModel = d3.group(filteredData, (d) => d.Model);
				chartData = Array.from(groupedByModel, ([key, value]) => ({
					title: key,
					data: value,
				}));
			} else {
				// Average all models
				const aggregated = d3.rollups(
					filteredData,
					(v) => d3.mean(v, (d) => d.Value),
					(d) => d.Loss,
					(d) => d["Bias Type"]
				);

				const flattenedAggregated = [];
				aggregated.forEach(([loss, biasMap]) => {
					biasMap.forEach(([bias, value]) => {
						flattenedAggregated.push({
							Model: "Average",
							Loss: loss,
							"Bias Type": bias,
							Value: value,
						});
					});
				});
				chartData = [
					{ title: "Average of All Models", data: flattenedAggregated },
				];
			}

			// Clear previous charts
			d3.select(chartContainerRef.current).selectAll("*").remove();

			// Render charts
			chartData.forEach((chart) => {
				const wrapper = d3
					.select(chartContainerRef.current)
					.append("div")
					.attr("class", "chart-wrapper");

				wrapper.append("h3").attr("class", "chart-title").text(chart.title);

				const svg = wrapper
					.append("svg")
					.attr("width", 500)
					.attr("height", 350);

				drawGroupedBarChart(chart.data, svg, activeBiasTypes);
			});
		};

		updateVisualization();
	}, [data, encoderView, biasView, biasTypes, lossTypes]);

	const drawGroupedBarChart = (chartData, svg, activeBiasTypes) => {
		const margin = { top: 20, right: 20, bottom: 60, left: 60 };
		const width = 500 - margin.left - margin.right;
		const height = 350 - margin.top - margin.bottom;

		const plotArea = svg
			.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`);

		// Scales
		const x0 = d3.scaleBand().domain(lossTypes).range([0, width]).padding(0.2);

		const x1 = d3
			.scaleBand()
			.domain(activeBiasTypes)
			.range([0, x0.bandwidth()])
			.padding(0.05);

		const y = d3
			.scaleLinear()
			.domain([
				0,
				Math.max(
					0.1,
					d3.max(chartData, (d) => d.Value)
				),
			])
			.nice()
			.range([height, 0]);

		const color = d3.scaleOrdinal().domain(biasTypes).range(d3.schemeTableau10);

		// Axes
		const xAxis = d3.axisBottom(x0);
		svg
			.append("g")
			.attr("class", "x-axis")
			.attr("transform", `translate(${margin.left}, ${height + margin.top})`)
			.call(xAxis)
			.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", "-.8em")
			.attr("dy", ".15em")
			.attr("transform", "rotate(-45)");

		const yAxis = d3.axisLeft(y).ticks(5, ".1f");
		svg
			.append("g")
			.attr("class", "y-axis")
			.attr("transform", `translate(${margin.left}, ${margin.top})`)
			.call(yAxis);

		// Y-axis label
		svg
			.append("text")
			.attr("class", "y-axis-label")
			.attr("transform", "rotate(-90)")
			.attr("y", 15)
			.attr("x", -(height / 2 + margin.top))
			.attr("dy", "1em")
			.style("text-anchor", "middle")
			.text("Validation Δsim");

		// Draw bars
		const groups = plotArea
			.selectAll(".loss-group")
			.data(d3.group(chartData, (d) => d.Loss))
			.enter()
			.append("g")
			.attr("class", "loss-group")
			.attr("transform", ([loss, _]) => `translate(${x0(loss)}, 0)`);

		groups
			.selectAll("rect")
			.data(([_, values]) => values)
			.enter()
			.append("rect")
			.attr("x", (d) => x1(d["Bias Type"]))
			.attr("width", x1.bandwidth())
			.attr("fill", (d) => color(d["Bias Type"]))
			.attr("y", height)
			.attr("height", 0)
			.on("mouseover", (event, d) => {
				d3.select(event.currentTarget).style("opacity", 0.7);
				const tooltip = d3.select(tooltipRef.current);
				tooltip
					.style("opacity", 1)
					.html(
						`
						<strong>${d["Bias Type"]}</strong><br>
						Loss: ${d.Loss}<br>
						Value: ${d.Value.toFixed(4)}<br>
						Model: ${d.Model}
					`
					)
					.style("left", event.pageX + 10 + "px")
					.style("top", event.pageY - 10 + "px");
			})
			.on("mouseout", (event) => {
				d3.select(event.currentTarget).style("opacity", 1);
				d3.select(tooltipRef.current).style("opacity", 0);
			})
			.transition()
			.duration(500)
			.attr("y", (d) => y(d.Value))
			.attr("height", (d) => height - y(d.Value));

		// Legend (only if multiple bias types)
		if (activeBiasTypes.length > 1) {
			const legend = svg
				.append("g")
				.attr("class", "legend-container")
				.attr(
					"transform",
					`translate(${margin.left + width - 120}, ${margin.top})`
				);

			const legendItems = legend
				.selectAll(".legend-item")
				.data(activeBiasTypes)
				.enter()
				.append("g")
				.attr("class", "legend-item")
				.attr("transform", (d, i) => `translate(0, ${i * 20})`);

			legendItems
				.append("rect")
				.attr("width", 15)
				.attr("height", 15)
				.attr("fill", (d) => color(d));

			legendItems
				.append("text")
				.attr("x", 20)
				.attr("y", 12)
				.text((d) => d)
				.style("font-size", "11px")
				.attr("fill", "#333");
		}
	};

	return (
		<div className="bias-chart-component">
			<div className="chart-controls">
				<fieldset>
					<legend>Encoder View</legend>
					<label>
						<input
							type="radio"
							name="encoderView"
							value="faceted"
							checked={encoderView === "faceted"}
							onChange={(e) => setEncoderView(e.target.value)}
						/>
						By Model
					</label>
					<label>
						<input
							type="radio"
							name="encoderView"
							value="aggregated"
							checked={encoderView === "aggregated"}
							onChange={(e) => setEncoderView(e.target.value)}
						/>
						Average All Models
					</label>
				</fieldset>

				<fieldset>
					<legend>Bias View</legend>
					<label>
						<input
							type="radio"
							name="biasView"
							value="faceted"
							checked={biasView === "faceted"}
							onChange={(e) => setBiasView(e.target.value)}
						/>
						All Bias Types
					</label>
					<label>
						<input
							type="radio"
							name="biasView"
							value="overall"
							checked={biasView === "overall"}
							onChange={(e) => setBiasView(e.target.value)}
						/>
						"Overall" Bias Only
					</label>
				</fieldset>
			</div>

			<div ref={tooltipRef} className="d3-tooltip"></div>
			<div ref={chartContainerRef} className="d3-chart-container"></div>
		</div>
	);
};

export default BiasChart;
