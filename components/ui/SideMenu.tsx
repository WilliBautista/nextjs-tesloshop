import { useContext, useState } from 'react';

import { useRouter } from 'next/router';

import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined, DashboardOutlined } from '@mui/icons-material';

import { UiContext, AuthContext } from '../../context';

export const SideMenu = () => {

  const router = useRouter()

  const { isMenuOpen, toggleSideMenu } = useContext( UiContext )
  const { isLoggedIn, user, logoutUser } = useContext( AuthContext )

  const [searchTerm, setSearchTerm] = useState('')

  const onSearchTerm = () => {
    if ( searchTerm.length === 0 ) return
    navigateTo(`/search/${ searchTerm }`)
  }

  const navigateTo = ( url: string ) => {
    toggleSideMenu()
    router.push(url)
  }

  return (
    <Drawer
      open={ isMenuOpen }
      anchor='right'
      sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
      onClose={ () => toggleSideMenu() }
    >
      <Box sx={{ width: 250, paddingTop: 5 }}>
        <List>
          <ListItem>
            <Input
              autoFocus
              value={ searchTerm }
              type='text'
              placeholder="Search..."
              onChange={ e => setSearchTerm( e.target.value )  }
              onKeyUp={ e => e.key === 'Enter' ? onSearchTerm() : null }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={ onSearchTerm }>
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
          </ListItem>

          {
            isLoggedIn && (
              <>
                <ListItem button>
                  <ListItemIcon>
                    <AccountCircleOutlined/>
                  </ListItemIcon>
                  <ListItemText primary={'Profile'} />
                </ListItem>

                <ListItem button onClick={ () => navigateTo('/orders/history')}>
                  <ListItemIcon>
                    <ConfirmationNumberOutlined/>
                  </ListItemIcon>
                  <ListItemText primary={'My Orders'} />
                </ListItem>
              </>
            )
          }

          <ListItem button sx={{ display: { xs: '', sm: 'none' } }} onClick={ () => navigateTo('/category/men') }>
            <ListItemIcon>
              <MaleOutlined />
            </ListItemIcon>
            <ListItemText primary={'Men'} />
          </ListItem>

          <ListItem button sx={{ display: { xs: '', sm: 'none' } }} onClick={ () => navigateTo('/category/women') }>
            <ListItemIcon>
              <FemaleOutlined />
            </ListItemIcon>
            <ListItemText primary={'Women'} />
          </ListItem>

          <ListItem button sx={{ display: { xs: '', sm: 'none' } }} onClick={ () => navigateTo('/category/kids') }>
            <ListItemIcon>
              <EscalatorWarningOutlined />
            </ListItemIcon>
            <ListItemText primary={'Kids'} />
          </ListItem>

          {
            isLoggedIn
              ? <ListItem button onClick={ logoutUser }>
                  <ListItemIcon>
                    <LoginOutlined/>
                  </ListItemIcon>
                  <ListItemText primary={'Logout'} />
                </ListItem>
              : <ListItem button onClick={ () => navigateTo(`/auth/login?destination=${ router.asPath }`) }>
                  <ListItemIcon>
                    <VpnKeyOutlined/>
                  </ListItemIcon>
                  <ListItemText primary={'Login'} />
                </ListItem>
          }


          {/* Admin */}
          {
            (user?.role === 'admin') && (
              <>
                <Divider />
                  <ListSubheader>Admin Panel</ListSubheader>

                  <ListItem button onClick={ () => navigateTo('/admin') }>
                    <ListItemIcon>
                      <DashboardOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Dashboard'} />
                  </ListItem>
                  <ListItem button onClick={ () => navigateTo('/admin/products') }>
                    <ListItemIcon>
                      <CategoryOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Products'} />
                  </ListItem>
                  <ListItem button onClick={ () => navigateTo('/admin/orders') }>
                    <ListItemIcon>
                      <ConfirmationNumberOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Orders'} />
                  </ListItem>

                  <ListItem button onClick={ () => navigateTo('/admin/users') }>
                    <ListItemIcon>
                      <AdminPanelSettings/>
                    </ListItemIcon>
                    <ListItemText primary={'Users'} />
                  </ListItem>
              </>
            )
          }
        </List>
      </Box>
    </Drawer>
  )
}
