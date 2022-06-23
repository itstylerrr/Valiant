const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const { Chart } = require('chart.js');

const configOptions = new Chart().config;

module.exports = {
	/**
	 * 
	 * @param {configOptions} options 
	 * Generate the Chart Configuration
	 */
	generateChartConfig(options) {
		return options;
	},
};