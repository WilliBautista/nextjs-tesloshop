import { useContext, useState } from 'react';

import NextLink from 'next/link'
import { useRouter } from 'next/router';

import { AppBar, Badge, Box, Button, IconButton, Input, Link, Toolbar, Typography, InputAdornment } from '@mui/material';
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material'

import { UiContext, CartContext } from '../../context';

export const Navbar = () => {

  const { pathname, push } = useRouter()
  const { toggleSideMenu } = useContext( UiContext )
  const { numberOfItems } = useContext( CartContext )

  const [searchTerm, setSearchTerm] = useState('')
  const [searchActive, setSearchActive] = useState(false)

  const onSearchTerm = () => {
    if ( searchTerm.length === 0 ) return
    push(`/search/${ searchTerm }`)
    setSearchActive(false)
  }

  return (
    <AppBar>
      <Toolbar>
        <NextLink href='/' passHref>
            <Link display='flex' alignItems='center'>
              <Typography variant='h6'>Teslo | </Typography>
              <Typography sx={{ ml: 0.5 }}>Shop</Typography>
            </Link>
        </NextLink>

        <Box flex={ 1 } />

        <Box className='fadeIn' sx={{ display: searchActive ? 'none' : { xs: 'none', sm: 'flex' } }}>
          <NextLink href='/category/men' passHref>
            <Link>
              <Button color={ (pathname === '/category/men') ? 'primary' : 'info'  }>Men</Button>
            </Link>
          </NextLink>
          <NextLink href='/category/women' passHref>
            <Link>
              <Button color={ (pathname === '/category/women') ? 'primary' : 'info'  }>Women</Button>
            </Link>
          </NextLink>
          <NextLink href='/category/kids' passHref>
            <Link>
              <Button color={ (pathname === '/category/kids') ? 'primary' : 'info'  }>Kids</Button>
            </Link>
          </NextLink>
        </Box>

        <Box flex={ 1 } />

        {
          searchActive
            ? <Input
                autoFocus
                value={ searchTerm }
                type='text'
                placeholder="Search..."
                className='fadeIn'
                onChange={ e => setSearchTerm( e.target.value )  }
                onKeyUp={ e => e.key === 'Enter' ? onSearchTerm() : null }
                sx={{ display: { xs: 'none', sm: 'flex' } }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={ () => setSearchActive(false) }>
                      <ClearOutlined />
                    </IconButton>
                  </InputAdornment>
                }
              />
            : <IconButton
                sx={{ display: { xs: 'none', sm: 'flex' } }}
                onClick={ () => setSearchActive(true) }
                className='fadeIn'
              >
                <SearchOutlined />
              </IconButton>
        }

        {/* Mobile */}
        <IconButton
          sx={{ display: { xs: 'flex', sm: 'none' } }}
          onClick={ toggleSideMenu }
        >
          <SearchOutlined />
        </IconButton>

        <NextLink href='/cart' passHref>
          <Link>
            <IconButton>
              <Badge badgeContent={ numberOfItems > 9 ? '+9' : numberOfItems } color='secondary'>
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>

        <Button onClick={ () => toggleSideMenu() }>
          Menu
        </Button>

      </Toolbar>
    </AppBar>
  )
}

export default Navbar
