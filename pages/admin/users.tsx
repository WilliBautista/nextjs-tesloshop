import { useState, useEffect } from 'react';

import { NextPage } from 'next';

import { PeopleOutline } from '@mui/icons-material'
import { Grid, MenuItem, Select } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import useSWR from 'swr'

import { IUser } from '../../interfaces'
import { AdminLayout } from '../../components/layouts'
import { tesloApi } from '../../api';

const UsersPage: NextPage = () => {
  const { data, error } = useSWR<IUser[]>('/api/admin/users')
  const [users, setUsers] = useState<IUser[]>([])

  useEffect(() => {
    if ( data ) {
      setUsers( data )
    }
  }, [data])

  if ( !data && !error ) return (<></>)

  const onRoleUpdate = async ( userId: string, newRole: string ) => {
    const previewUsers = users.map( user => ({ ...user }))
    const updatedUsers = users.map(user => ({
      ...user,
      role: userId === user._id ? newRole : user.role
    }))

    setUsers(updatedUsers)

    try {
      await tesloApi.put('/admin/users', {
        userId,
        role: newRole,
      })
    } catch (error) {
      setUsers(previewUsers)
      console.log(error)
      alert('Could not update user')
    }
  }

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'name', headerName: 'Full Name', width: 300 },
    {
      field: 'role',
      headerName: 'Role',
      width: 300,
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <Select
            value={ row.role }
            label='Role'
            onChange={ ({ target }) => onRoleUpdate( row.id, target.value )}
            sx={{ width: '300px' }}
          >
            <MenuItem value='admin'>Admin</MenuItem>
            <MenuItem value='client'>Client</MenuItem>
            <MenuItem value='super-user'>Super User</MenuItem>
            <MenuItem value='seo'>SEO</MenuItem>
          </Select>
        )
      }
    }
  ]

  const rows = users.map(user => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role
  }))

  return (
    <AdminLayout
      title='Users'
      subtitle='Manage users'
      icon={ <PeopleOutline /> }
    >
      <Grid container className='fadeIn' sx={{ mt: 2 }}>
        <Grid item xs={12} sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={ rows }
            columns={ columns }
            pageSize={ 10 }
            rowsPerPageOptions={ [10] }
          />
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default UsersPage
