import type { NextApiRequest, NextApiResponse } from 'next'

import bcrypt from 'bcryptjs'

import { db } from '../../../database'
import { User } from '../../../Models'
import { jwt, validations } from '../../../utils'

type Data =
  | { message: string }
  | {
      token: string
      user: {
        email: string;
        role: string;
        name: string;
      }
    }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

  switch ( req.method ) {
    case 'POST':
        return registerUser( req, res )

    default:
      return res.status(400).json({
        message: 'Bad request'
      })
  }
}

const registerUser = async ( req: NextApiRequest, res: NextApiResponse<Data> ) => {
  const { email = '', password = '', name = '' } = req.body as { email: string, password: string, name: string}

  // Password validation
  if ( password.length < 6 ) {
    return res.status(400).json({
      message: 'Password must have more than 6 characters'
    })
  }

  // Name validation
  if ( name.length < 2 ) {
    return res.status(400).json({
      message: 'Name must have more than 3 characters'
    })
  }


  // Email validation
  if ( !validations.isValidEmail( email ) ) {
    return res.status(400).json({
      message: 'Email is not a valid email'
    })
  }

  await db.connect()
  const user = await User.findOne({ email })

  if ( user ) {
    return res.status(400).json({
      message: 'This user already exists'
    })
  }

  const newUser = new User({
    email: email.toLowerCase(),
    password: bcrypt.hashSync( password ),
    role: 'client',
    name,
  })

  try {
    await newUser.save({ validateBeforeSave: true })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: 'Take a look at server logs'
    })
  }

  const { _id, role } = newUser

  const token = jwt.signToken( _id, email )

  return res.status(200).json({
    token,
    user: {
      email,
      role,
      name
    }
  })

}
