import moment from 'moment';
import React, {useEffect, useState} from 'react';
import DataTable, {TableColumn} from 'react-data-table-component';
import ScraperStatsChart from '../components/ScraperStatsChart';
import Sidebar from '../components/Sidebar';

const Scraper = () => {
  const [cardStats, setCardStats] = useState({} as any);
  useEffect(() => {}, [0]);

  return (
    <div className="flex">
      <div className="flex-none h-screen">
        <Sidebar />
      </div>
      <div className="felx-auto mt-20 w-full">
        <div className="p-4">
          <ScraperStatsChart />
        </div>
      </div>
    </div>
  );
};

export default Scraper;
