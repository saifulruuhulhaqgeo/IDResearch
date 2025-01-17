import axios from 'axios';
import {useCallback, useEffect, useMemo, useState} from 'react';
import DataTable, {TableColumn} from 'react-data-table-component';
import Swal from 'sweetalert2';
import {JsxElement} from 'typescript';
import {formatDecimal} from '../../common/IndonesianFormat';
import {ResearchData} from '../../common/TypesModel';
import LoadingModal from '../../components/LoadingModal';
import Sidebar from '../../components/Sidebar';
import {
  deleteLiteratures,
  getAllLiteratures,
} from '../../repositories/Research';

const Literatures = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [keyword, setKeyword] = useState('');
  const [loadingModal, setLoadingModal] = useState(false);

  const fetchTable = async (page: number, size = perPage) => {
    setLoading(true);

    getAllLiteratures(page, size, keyword)
      .then((response) => {
        setData(response?.data?.data?.lists);
        setTotalRows(response?.data?.data?.total_found);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire(
          'Oops..',
          'Terjadi error, silahkan refresh halaman atau tunggu beberapa saat lagi',
          'warning',
        );
      })
      .finally(() => {
        setLoading(false);
      });

    setLoading(false);
  };

  useEffect(() => {
    fetchTable(1);
  }, [0, keyword]);

  const deleteLiterature = (id: string) => {
    setLoadingModal(true);

    deleteLiteratures(id)
      .then(() => {
        Swal.fire('Berhasil menghapus!', '', 'success');
      })
      .catch((err) => {
        console.log(err);
        Swal.fire('Gagal menghapus!', '', 'error');
      })
      .finally(() => {
        setLoadingModal(false);
        fetchTable(currentPage);
      });
  };

  const columns = [
    {
      name: 'Judul',
      selector: (row) => row.title,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Author',
      selector: (row) => row.author,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Tahun',
      selector: (row) => row.year,
      sortable: true,
      maxWidth: '5px',
    },
    {
      name: 'Links',
      selector: (row) => (
        <a className="hover:text-blue-500" href={row.links[0]} target="_blank">
          {' '}
          {row.links[0]}
        </a>
      ),
      sortable: true,
    },
    {
      name: 'Topik',
      selector: (row) => row.topic_name,
      sortable: true,
    },
    {
      name: 'Daerah',
      selector: (row) => row.daerah_label,
      sortable: true,
    },
    {
      name: 'Sumber',
      selector: (row) => row.source,
      sortable: true,
    },
    {
      name: 'Menu',
      selector: (row) => (
        <button
          onClick={() => {
            Swal.fire({
              title: 'Are you sure ?',
              showCancelButton: true,
              confirmButtonText: 'Delete',
              confirmButtonColor: 'red',
            }).then((result) => {
              if (result.isConfirmed) {
                deleteLiterature(row.id);
              }
            });
          }}
          className="bg-red-700 hover:bg-red-900 text-white py-1.5 px-4 rounded-md"
        >
          Delete
        </button>
      ),
      sortable: true,
    },
  ] as TableColumn<ResearchData>[];

  const handlePageChange = (page: number) => {
    fetchTable(page);
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage: number, page: number) => {
    fetchTable(page, newPerPage);
    setPerPage(newPerPage);
  };

  return (
    <div className="flex">
      <div className="flex-none h-screen">
        <Sidebar />
      </div>
      <div className="felx-auto mt-20">
        <div className="py-2 px-4 font-bold text-lg">
          Literatures {formatDecimal(totalRows.toString())} data
        </div>

        <div className="relative w-64 mx-4">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="search"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                console.log('cari', e.currentTarget.value);
                setKeyword(e.currentTarget.value);
              }
            }}
            id="default-search"
            className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Cari .."
            required
          />
        </div>
        <div className="p-4">
          <DataTable
            columns={columns}
            data={data}
            progressPending={loading}
            pagination
            fixedHeader
            fixedHeaderScrollHeight="100vh"
            paginationServer
            striped
            paginationRowsPerPageOptions={[5, 10, 20, 30, 50, 100]}
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            paginationComponentOptions={{
              rowsPerPageText: 'Per baris:',
              rangeSeparatorText: 'dari',
              noRowsPerPage: false,
              selectAllRowsItem: false,
              selectAllRowsItemText: 'Semua',
            }}
          />
        </div>
      </div>
      <LoadingModal modalOpen={loadingModal} />
    </div>
  );
};

export default Literatures;
