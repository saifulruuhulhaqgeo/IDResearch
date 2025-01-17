import axios from 'axios';
import {deleteUser} from 'firebase/auth';
import {useCallback, useEffect, useMemo, useState} from 'react';
import DataTable, {TableColumn} from 'react-data-table-component';
import Swal from 'sweetalert2';
import {JsxElement} from 'typescript';
import {formatDecimal} from '../../common/IndonesianFormat';
import {ResearchData, Topic} from '../../common/TypesModel';
import LoadingModal from '../../components/LoadingModal';
import Sidebar from '../../components/Sidebar';
import {
  changeRole,
  getAllUser,
  setUserIsPremium,
} from '../../repositories/Auth';
import {deleteTopik, getAllTableTopic} from '../../repositories/Research';

type User = {
  ID: string;
  FullName: string;
  Email: string;
  Role: string;
  PremiumMember: boolean;
};

const Users = () => {
  const [loadingModal, setLoadingModal] = useState(false);
  const [data, setData] = useState([]);

  const fetchUserData = () => {
    setLoadingModal(true);
    getAllUser()
      .then((response) => {
        setData(response.data.data);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire('Terjadi error', '', 'error');
      })
      .finally(() => setLoadingModal(false));
  };

  useEffect(() => {
    fetchUserData();
  }, [0]);

  const changeRoleUser = (userId: string, role: string) => {
    setLoadingModal(true);
    changeRole(userId, role)
      .then(() => {
        fetchUserData();
        Swal.fire('Berhasil mengubah role', '', 'success');
      })
      .catch((err) => {
        console.log(err);
        Swal.fire('terjadi error', '', 'error');
      })
      .finally(() => setLoadingModal(false));
  };

  const columns = [
    {
      name: 'Nama',
      selector: (row) => row.FullName,
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row) => row.Email,
      sortable: true,
    },
    {
      name: 'Admin',
      selector: (row) =>
        row.Email !== 'alfiankan19@gmail.com' ? (
          <>
            <label className="inline-flex relative items-center cursor-pointer">
              <input
                type="checkbox"
                checked={row.Role === 'ADM'}
                onClick={() => {
                  console.log('change role', row.ID);
                  changeRoleUser(row.ID, row.Role === 'ADM' ? 'USR' : 'ADM');
                }}
                id="default-toggle"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                {row.Role === 'ADM'
                  ? 'Change to non admin'
                  : 'Change to admin'}
              </span>
            </label>
          </>
        ) : (
          'Super Admin'
        ),
      sortable: true,
    },

    {
      name: 'Premium',
      selector: (row) => (
        <>
          <label className="inline-flex relative items-center cursor-pointer">
            <input
              type="checkbox"
              checked={row.PremiumMember}
              onClick={() => {
                console.log('change role', row.ID);

                setUserIsPremium(row.Email, !row.PremiumMember)
                  .then((res) => {
                    Swal.fire('Berhasil', 'Berhasil mengubah user', 'success');
                  })
                  .catch(() => {
                    Swal.fire('Gagal', 'Gagal mengubah user', 'error');
                  })
                  .finally(() => {
                    fetchUserData();
                  });
              }}
              id="default-toggle"
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </>
      ),
      sortable: true,
    },
  ] as TableColumn<User>[];

  return (
    <div className="flex">
      <div className="flex-none h-screen">
        <Sidebar />
      </div>
      <div className="felx-auto mt-20 w-full">
        <div className="p-4 w-full">
          <DataTable
            columns={columns}
            data={data}
            pagination
            fixedHeader
            fixedHeaderScrollHeight="100vh"
            striped
          />
        </div>
      </div>
      <LoadingModal modalOpen={loadingModal} />
    </div>
  );
};

export default Users;
