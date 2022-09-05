import { FC } from 'react';

import Head from "next/head"

import { Box } from "@mui/material";

interface Props {
  children: JSX.Element | JSX.Element[];
  metatitle: string;
}

export const AuthLayout: FC<Props> = ({ children, metatitle }) => {
  return (
    <>
      <Head>
        <title>{ metatitle }</title>
      </Head>

      <main>
        <Box display='flex' justifyContent='center' alignItems='center' height='calc(100vh - 200px)'>
          { children }
        </Box>
      </main>
    </>
  )
}

export default AuthLayout
