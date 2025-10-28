import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./TSNEVisualization.css";

const TSNEVisualization = ({ data }) => {
	const svgRef = useRef();
	const containerRef = useRef();
	const [selectedBias, setSelectedBias] = useState("Caste");
	const [selectedModel, setSelectedModel] = useState("Bare");
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	// Get available bias types from data
	const biasTypes = Object.keys(data);

	// Handle responsive resizing - more compact
	useEffect(() => {
		const updateDimensions = () => {
			if (containerRef.current) {
				const { width } = containerRef.current.getBoundingClientRect();
				// Reduced max height for more compact display
				const height = Math.min(width * 0.6, 450);
				setDimensions({ width, height });
			}
		};

		updateDimensions();
		window.addEventListener("resize", updateDimensions);
		return () => window.removeEventListener("resize", updateDimensions);
	}, []);

	useEffect(() => {
		if (!data[selectedBias]?.[selectedModel] || dimensions.width === 0) return;

		const plotData = data[selectedBias][selectedModel];
		const svg = d3.select(svgRef.current);

		// Clear previous content
		svg.selectAll("*").remove();

		// Set up dimensions
		const margin = { top: 40, right: 40, bottom: 60, left: 60 };
		const width = dimensions.width - margin.left - margin.right;
		const height = dimensions.height - margin.top - margin.bottom;

		// Create main group
		const g = svg
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		// Set up scales with padding
		const xExtent = d3.extent(plotData, (d) => d.x);
		const yExtent = d3.extent(plotData, (d) => d.y);
		const xPadding = (xExtent[1] - xExtent[0]) * 0.1;
		const yPadding = (yExtent[1] - yExtent[0]) * 0.1;

		const xScale = d3
			.scaleLinear()
			.domain([xExtent[0] - xPadding, xExtent[1] + xPadding])
			.range([0, width])
			.nice();

		const yScale = d3
			.scaleLinear()
			.domain([yExtent[0] - yPadding, yExtent[1] + yPadding])
			.range([height, 0])
			.nice();

		// Color scale
		const colorScale = d3
			.scaleOrdinal()
			.domain(["Stereotype", "Anti-stereotype"])
			.range(["#ef4444", "#3b82f6"]);

		// Add subtle grid lines
		g.append("g")
			.attr("class", "grid-lines")
			.attr("transform", `translate(0,${height})`)
			.call(d3.axisBottom(xScale).tickSize(-height).tickFormat("").ticks(6))
			.call((g) => g.select(".domain").remove())
			.call((g) =>
				g
					.selectAll(".tick line")
					.attr("stroke", "#e5e7eb")
					.attr("stroke-opacity", 0.7)
			);

		g.append("g")
			.attr("class", "grid-lines")
			.call(d3.axisLeft(yScale).tickSize(-width).tickFormat("").ticks(6))
			.call((g) => g.select(".domain").remove())
			.call((g) =>
				g
					.selectAll(".tick line")
					.attr("stroke", "#e5e7eb")
					.attr("stroke-opacity", 0.7)
			);

		// Add axes
		g.append("g")
			.attr("class", "x-axis")
			.attr("transform", `translate(0,${height})`)
			.call(d3.axisBottom(xScale).ticks(6))
			.call((g) => g.select(".domain").attr("stroke", "#9ca3af"));

		g.append("g")
			.attr("class", "y-axis")
			.call(d3.axisLeft(yScale).ticks(6))
			.call((g) => g.select(".domain").attr("stroke", "#9ca3af")); // Style axis ticks
		svg.selectAll(".tick line").attr("stroke", "#9ca3af");
		svg
			.selectAll(".tick text")
			.attr("fill", "#6b7280")
			.attr("font-size", "11px")
			.style(
				"font-family",
				"Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
			);

		// Add axis labels
		g.append("text")
			.attr("class", "axis-label")
			.attr("text-anchor", "middle")
			.attr("x", width / 2)
			.attr("y", height + 45)
			.style("fill", "#1f2937")
			.style("font-size", "13px")
			.style("font-weight", "600")
			.style(
				"font-family",
				"Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
			)
			.text("t-SNE Dimension 1");

		g.append("text")
			.attr("class", "axis-label")
			.attr("text-anchor", "middle")
			.attr("transform", `translate(-45,${height / 2}) rotate(-90)`)
			.style("fill", "#1f2937")
			.style("font-size", "13px")
			.style("font-weight", "600")
			.style(
				"font-family",
				"Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
			)
			.text("t-SNE Dimension 2");

		// Create tooltip
		const tooltip = d3
			.select("body")
			.append("div")
			.attr("class", "tsne-tooltip")
			.style("opacity", 0)
			.style("position", "absolute")
			.style("pointer-events", "none");

		// Add points with animation
		const points = g
			.selectAll(".data-point")
			.data(plotData)
			.enter()
			.append("circle")
			.attr("class", "data-point")
			.attr("cx", (d) => xScale(d.x))
			.attr("cy", (d) => yScale(d.y))
			.attr("r", 0)
			.attr("fill", (d) => colorScale(d.type))
			.attr("stroke", "#fff")
			.attr("stroke-width", 1.5)
			.style("opacity", 0.8)
			.style("cursor", "pointer");

		// Animate points appearing
		points
			.transition()
			.duration(800)
			.delay((d, i) => i * 2)
			.attr("r", 6)
			.style("opacity", 0.8);

		// Add hover interactions
		points
			.on("mouseover", function (event, d) {
				d3.select(this)
					.transition()
					.duration(200)
					.attr("r", 9)
					.attr("stroke-width", 2.5)
					.style("opacity", 1);

				tooltip
					.style("opacity", 1)
					.html(
						`
						<div class="tooltip-header" style="color: ${colorScale(
							d.type
						)}; font-weight: 700; margin-bottom: 6px; font-size: 13px;">
							${d.type}
						</div>
						<div class="tooltip-text" style="color: #1f2937; line-height: 1.6; font-size: 13px;">
							"${d.text}"
						</div>
					`
					)
					.style("left", event.pageX + 15 + "px")
					.style("top", event.pageY - 10 + "px");
			})
			.on("mousemove", function (event) {
				tooltip
					.style("left", event.pageX + 15 + "px")
					.style("top", event.pageY - 10 + "px");
			})
			.on("mouseout", function (event, d) {
				d3.select(this)
					.transition()
					.duration(200)
					.attr("r", 6)
					.attr("stroke-width", 1.5)
					.style("opacity", 0.8);

				tooltip.transition().duration(200).style("opacity", 0);
			});

		// Cleanup tooltip on unmount
		return () => {
			tooltip.remove();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, selectedBias, selectedModel, dimensions]);

	return (
		<div className="tsne-visualization-wrapper">
			<div className="tsne-controls-panel">
				<div className="control-group">
					<label className="control-label">Bias Type</label>
					<div className="button-group">
						{biasTypes.map((bias) => (
							<button
								key={bias}
								className={`control-button ${
									selectedBias === bias ? "active" : ""
								}`}
								onClick={() => setSelectedBias(bias)}>
								{bias}
							</button>
						))}
					</div>
				</div>

				<div className="control-group">
					<label className="control-label">Model Type</label>
					<div className="button-group">
						<button
							className={`control-button ${
								selectedModel === "Bare" ? "active" : ""
							}`}
							onClick={() => setSelectedModel("Bare")}>
							Bare Model
						</button>
						<button
							className={`control-button ${
								selectedModel === "Finetuned" ? "active" : ""
							}`}
							onClick={() => setSelectedModel("Finetuned")}>
							Finetuned Model
						</button>
					</div>
				</div>
			</div>

			<div className="tsne-chart-container" ref={containerRef}>
				<div className="chart-title">
					{selectedBias} Bias - {selectedModel} Model
				</div>
				<svg
					ref={svgRef}
					width={dimensions.width}
					height={dimensions.height}
					className="tsne-svg"
				/>
				<div className="tsne-legend">
					<div className="legend-item">
						<div
							className="legend-circle"
							style={{ backgroundColor: "#ef4444" }}></div>
						<span>Stereotype</span>
					</div>
					<div className="legend-item">
						<div
							className="legend-circle"
							style={{ backgroundColor: "#3b82f6" }}></div>
						<span>Anti-stereotype</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TSNEVisualization;
