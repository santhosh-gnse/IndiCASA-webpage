import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const BiasDistributionChart = () => {
	const svgRef = useRef();

	useEffect(() => {
		const data = [
			{ category: "Gender", count: 853, percentage: 33.2, icon: "♀♂" },
			{ category: "Socioeconomic", count: 504, percentage: 19.6, icon: "💰" },
			{ category: "Caste", count: 498, percentage: 19.3, icon: "👥" },
			{ category: "Religion", count: 422, percentage: 16.4, icon: "🕉" },
			{ category: "Disability", count: 298, percentage: 11.6, icon: "♿" },
		];

		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();

		const width = 700;
		const height = 350;
		const radius = Math.min(width, height) / 2 - 40;

		const g = svg
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform", `translate(${width / 2},${height / 2})`);

		// Color scale with vibrant colors
		const color = d3
			.scaleOrdinal()
			.domain(data.map((d) => d.category))
			.range(["#667eea", "#764ba2", "#f59e0b", "#10b981", "#ef4444"]);

		// Pie layout
		const pie = d3
			.pie()
			.value((d) => d.count)
			.sort(null);

		// Arc generator
		const arc = d3
			.arc()
			.innerRadius(radius * 0.5)
			.outerRadius(radius);

		// Arc for hover effect
		const arcHover = d3
			.arc()
			.innerRadius(radius * 0.5)
			.outerRadius(radius * 1.08);

		// Draw pie slices
		const slices = g
			.selectAll(".arc")
			.data(pie(data))
			.enter()
			.append("g")
			.attr("class", "arc");

		slices
			.append("path")
			.attr("d", arc)
			.attr("fill", (d) => color(d.data.category))
			.style("opacity", 0)
			.style("stroke", "#fff")
			.style("stroke-width", "3px")
			.transition()
			.duration(1000)
			.style("opacity", 1)
			.attrTween("d", function (d) {
				const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
				return function (t) {
					return arc(interpolate(t));
				};
			});

		// Add hover effect
		slices
			.selectAll("path")
			.on("mouseover", function (event, d) {
				d3.select(this)
					.transition()
					.duration(200)
					.attr("d", arcHover)
					.style("opacity", 0.9);
			})
			.on("mouseout", function (event, d) {
				d3.select(this)
					.transition()
					.duration(200)
					.attr("d", arc)
					.style("opacity", 1);
			});

		// Add percentage labels on slices
		slices
			.append("text")
			.attr("transform", (d) => {
				const pos = arc.centroid(d);
				return `translate(${pos})`;
			})
			.attr("text-anchor", "middle")
			.style("fill", "#fff")
			.style("font-size", "16px")
			.style("font-weight", "700")
			.style("text-shadow", "0 2px 4px rgba(0,0,0,0.3)")
			.style("opacity", 0)
			.text((d) => `${d.data.percentage}%`)
			.transition()
			.delay(1000)
			.duration(500)
			.style("opacity", 1);

		// Add center label
		g.append("text")
			.attr("text-anchor", "middle")
			.attr("dy", "-0.5em")
			.style("font-size", "32px")
			.style("font-weight", "800")
			.style("fill", "#667eea")
			.text("2,575");

		g.append("text")
			.attr("text-anchor", "middle")
			.attr("dy", "1.2em")
			.style("font-size", "14px")
			.style("font-weight", "600")
			.style("fill", "#6b7280")
			.text("Total Sentences");
	}, []);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: "30px",
			}}>
			<svg ref={svgRef}></svg>
			<div
				style={{
					display: "flex",
					flexWrap: "wrap",
					justifyContent: "center",
					gap: "20px",
					maxWidth: "700px",
				}}>
				{[
					{ category: "Gender", count: 853, color: "#667eea" },
					{ category: "Socioeconomic", count: 504, color: "#764ba2" },
					{ category: "Caste", count: 498, color: "#f59e0b" },
					{ category: "Religion", count: 422, color: "#10b981" },
					{ category: "Disability", count: 298, color: "#ef4444" },
				].map((item, idx) => (
					<div
						key={idx}
						style={{ display: "flex", alignItems: "center", gap: "8px" }}>
						<div
							style={{
								width: "16px",
								height: "16px",
								borderRadius: "4px",
								backgroundColor: item.color,
							}}
						/>
						<span
							style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
							{item.category}
						</span>
						<span style={{ fontSize: "14px", color: "#6b7280" }}>
							({item.count})
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default BiasDistributionChart;
