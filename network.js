<!--Kyle Furtado-->
<!--Major Assignment 3-->
<!--11/11/2023-->

function simulate(data,svg)
{
    const width = parseInt(svg.attr("viewBox").split(' ')[2])
    const height = parseInt(svg.attr("viewBox").split(' ')[3])
    const main_group = svg.append("g")
        .attr("transform", "translate(0, 50)")

   //calculate degree of the nodes:
    let node_degree={}; //initiate an object
   d3.map(data.links, (d)=>{
       if(d.source in node_degree)
       {
           node_degree[d.source]++
       }
       else{
           node_degree[d.source]=0
       }
       if(d.target in node_degree)
       {
           node_degree[d.target]++
       }
       else{
           node_degree[d.target]=0
       }
   })

    const scale_radius = d3.scaleLinear()
        .domain(d3.extent(Object.values(node_degree)))
        .range([3,12])

    let color = d3.scaleOrdinal(d3.schemeCategory10);

    const link_elements = main_group.append("g")
        .attr('transform',`translate(${width/2},${height/2})`)
        .selectAll(".line")
        .data(data.links)
        .enter()
        .append("line")

    const node_elements = main_group.append("g")
        .attr('transform', `translate(${width / 2},${height / 2})`)
        .selectAll(".circle")
        .data(data.nodes)
        .enter()
        .append('g')

    node_elements.append("circle")
        .attr("r",  function (d,i){
            if(node_degree[d.id]!==undefined) {
                return scale_radius(node_degree[d.id])
            }
            else{
                return scale_radius(0)
            }
        })
        .attr("fill",  function (d,i){
            return color(d.Country)
        })

    let ForceSimulation = d3.forceSimulation(data.nodes)
        .force("collide", d3.forceCollide().radius(function(d,i){
                return scale_radius(node_degree[d.id])*1.2}))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force("charge", d3.forceManyBody())
        .force("link",d3.forceLink(data.links)
            .id(function(d){
                return d.id
            })
        )
        .on("tick", ticked);

    function ticked()
    {
        node_elements
            .attr('transform', (d)=>`translate(${d.x},${d.y})`)
            link_elements
                .attr("x1",d=>d.source.x)
                .attr("x2",d=>d.target.x)
                .attr("y1",d=>d.source.y)
                .attr("y2",d=>d.target.y)
    }

    svg.call(d3.zoom()
        .extent([[0, 0], [width, height]])
        .scaleExtent([1, 8])
        .on("zoom", zoomed));

    function zoomed({transform}) {
        main_group.attr("transform", transform);
    }




}
