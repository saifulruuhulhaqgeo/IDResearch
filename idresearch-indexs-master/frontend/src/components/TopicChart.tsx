import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import {useEffect, useState} from 'react';
import {Topic} from '../common/TypesModel';
import {getAllTopic} from '../repositories/Research';
import remove from 'lodash/remove';
import sortBy from 'lodash/sortBy';

am4core.useTheme(am4themes_animated);

const TopicChart = ({areaCode = 0, daerahLabel = ''}) => {
  const [loading, setLoading] = useState(false);

  const renderChart = () => {
    let chart = am4core.create('chartdivtopik', am4charts.XYChart);

    chart.data = [];
    var topicAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    topicAxis.dataFields.category = 'name';
    topicAxis.renderer.grid.template.location = 0;
    topicAxis.renderer.minGridDistance = 20;
    topicAxis.renderer.labels.template.rotation = -90;

    topicAxis.renderer.inside = true;
    topicAxis.renderer.labels.template.valign = 'middle';
    topicAxis.renderer.labels.template.truncate = false;
    topicAxis.renderer.labels.template.hideOversized = false;
    topicAxis.renderer.labels.template.verticalCenter = 'middle';

    chart.yAxes.push(new am4charts.ValueAxis());

    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'total_informations';
    series.dataFields.categoryX = 'name';

    series.name = 'Total scraped';
    series.tooltipText = '{name}: [b]{valueY}[/]';
    series.strokeWidth = 2;
    series.stacked = true;
    series.fillOpacity = 0.5;

    chart.cursor = new am4charts.XYCursor();

    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart.scrollbarX = scrollbarX;

    scrollbarX.scrollbarChart.xAxes.getIndex(
      0,
    )!!.renderer.labels.template.disabled = true;
    scrollbarX.scrollbarChart.xAxes.getIndex(
      0,
    )!!.renderer.grid.template.disabled = true;
    return chart;
  };
  const [errMessage, setErrMessage] = useState('');

  useEffect(() => {
    let chart = renderChart();

    setLoading(true);
    getAllTopic(areaCode)
      .then((response) => {
        console.log(response?.data);

        let dataTopic = response?.data?.data;
        remove(dataTopic, {id: '00000000-0000-0000-0000-000000000000'});
        remove(dataTopic, {name: 'unknown'});
        dataTopic = sortBy(
          dataTopic,
          ['total_informations'],
          ['desc'],
        ).reverse();

        chart.data = dataTopic;

        chart.validateData();
      })
      .catch((err) => {
        console.log(err);
        setErrMessage(err?.response?.data);
      })
      .finally(() => setLoading(false));
  }, [0, areaCode]);

  return (
    <>
      <h3 className="font-bold text-2xl ml-4">
        Total data in topics {daerahLabel}
      </h3>
      <div className="flex items-center">
        <div className="flex-auto"></div>
        <div
          role="status"
          className={`${loading ? 'block' : 'hidden'} ml-4 flex-none`}
        >
          <svg
            aria-hidden="true"
            className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
        <div className="flex-auto"></div>
      </div>
      <p className="text-red-500">{errMessage}</p>
      <div id="chartdivtopik" style={{width: '100%', height: '300px'}}></div>
    </>
  );
};

export default TopicChart;
