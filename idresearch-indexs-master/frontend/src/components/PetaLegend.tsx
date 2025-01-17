const PetaLegend = () => {
  return (
    <div className="leaflet-bottom leaflet-left ml-[30rem] drop-shadow-md mb-2">
      <div className="leaflet-control w-full md:hidden">
        <div
          className="map-legend flex-row items-center px-4 py-1 w-full  text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
          role="alert"
        >
          <p className="">Total Research Color Levels</p>

          <table className="md:hidden">
            <tr>
              <td>
                <div className="h-0.5 w-4 bg-green-800 bg-opacity-60 mr-2"></div>
              </td>
              <td>ZEE</td>
            </tr>
            <tr>
              <td>
                <div className="h-0.5 w-4 bg-orange-500 bg-opacity-60 mr-2"></div>
              </td>
              <td>Tertorial</td>
            </tr>
            <tr>
              <td>
                <div className="h-4 w-4 bg-[#fc0328] bg-opacity-60 mr-2"></div>
              </td>
              <td>0</td>
            </tr>
            <tr>
              <td>
                <div className="h-4 w-4 bg-[#ead287] bg-opacity-60 mr-2"></div>
              </td>
              <td>0 - 100</td>
            </tr>
            <tr>
              <td>
                <div className="h-4 w-4 bg-[#a103fc] bg-opacity-60 mr-2"></div>
              </td>
              <td>100 - 5000</td>
            </tr>
            <tr>
              <td>
                <div className="h-4 w-4 bg-[#1403fc] bg-opacity-60 mr-2"></div>
              </td>
              <td>5000 - 10000</td>
            </tr>
            <tr>
              <td>
                <div className="h-4 w-4 bg-[#03fc5e] bg-opacity-60 mr-2"></div>
              </td>
              <td> &gt; 10000</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
};
export default PetaLegend;
