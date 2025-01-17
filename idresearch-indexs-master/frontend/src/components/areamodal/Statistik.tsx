import {AreaModalParam} from '../../common/TypesModel';
import TopicChart from '../TopicChart';

const Statistik = ({areaParam = {} as AreaModalParam}) => {
  return (
    <>
      <TopicChart
        areaCode={areaParam?.areaCode}
        daerahLabel={areaParam?.areaLabel}
      />
    </>
  );
};

export default Statistik;
