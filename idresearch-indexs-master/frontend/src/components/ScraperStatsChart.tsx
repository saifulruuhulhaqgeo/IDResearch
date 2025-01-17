import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import {useEffect, useState} from 'react';
import {getAllTopic} from '../repositories/Research';
import moment from 'moment';
import DataTable, {TableColumn} from 'react-data-table-component';

const client = new WebSocket('wss://explore.idresearch.net/ws/scraper/stats');

//am4core.useTheme(am4themes_animated);

const ScraperStatsChart = () => {
  const [loading, setLoading] = useState(false);
  const [scrapers, setScrapers] = useState([]);
  const [total, setTotal] = useState(0);

  const renderChart = () => {
    let chart = am4core.create('chartdivscraper', am4charts.XYChart);
    chart.paddingRight = 20;

    chart.data = [];
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.baseInterval = {
      timeUnit: 'minute',
      count: 1,
    };
    dateAxis.tooltipDateFormat = 'HH:mm, d MMMM';

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    //valueAxis.disabled = true;
    valueAxis.title.text = 'Scraped Data';

    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = 'CollectedAt';
    series.dataFields.valueY = 'Total';
    series.tooltipText = 'Total: [bold]{valueY} [/]';
    series.fillOpacity = 0.3;
    series.strokeWidth = 2;
    //series.tensionX = 0.5;

    chart.cursor = new am4charts.XYCursor();
    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart.scrollbarX = scrollbarX;

    dateAxis.start = 0.8;
    dateAxis.keepSelection = true;
    return chart;
  };

  useEffect(() => {
    let chart = renderChart();
    let cache: Array<any> = [];

    client.onopen = () => {
      console.log('WebSocket Client Connected');
      alert('realtime koneksi terputus, refresh halaman ini');
    };
    client.onmessage = (message: any) => {
      const rawData = JSON.parse(message.data).data;

      setScrapers(rawData.Scrapers);
      let formatedData: Array<any> = [];
      rawData.Series.forEach((v: any) => {
        formatedData.push({
          CollectedAt: moment(v.CollectedAt).toDate(),
          Total: Number(v.Value),
        });
      });
      console.log(rawData.Series[rawData.Series.length - 1]);
      setTotal(rawData.Series[rawData.Series.length - 1].Value);
      console.log(formatedData !== cache, formatedData.length, cache.length);
      if (formatedData.length !== cache.length) {
        cache = formatedData;
        chart.data = formatedData;
        chart.validateData();
      }
    };
  }, [0]);

  return (
    <>
      <h3 className="font-bold text-2xl ml-4">
        Total data scraped x time ( {total} )
      </h3>
      <div id="chartdivscraper" style={{width: '100%', height: '300px'}}></div>

      <div className="p-4">
        <DataTable
          columns={
            [
              {
                name: 'Label',
                selector: (row) => row.label,
                sortable: true,
              },
              {
                name: 'IP',
                selector: (row) => row.agent_ip,
                sortable: true,
              },
              {
                name: 'Last ingest time',
                selector: (row) =>
                  moment(row.last_ingest_time).format('DD/MM/YYYY HH:mm:ss'),
                sortable: true,
              },
            ] as TableColumn<any>[]
          }
          data={scrapers}
          pagination
          fixedHeader
          fixedHeaderScrollHeight="100vh"
          striped
        />
      </div>
    </>
  );
};

export default ScraperStatsChart;
