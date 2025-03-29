import { auth, provider, db } from '../firebase'
import { signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc } from 'firebase/firestore'
import GoogleLogo from '../assets/google-logo'

// ...existing code...

const Auth = () => {
  // ...existing code...

  return (
    <div className='w-screen h-screen flex flex-row'>
      <div className='w-1/2 h-full bg-green-400 flex items-center justify-center'>
        <div className='text-7xl text-white font-bold tracking-wider'>
          DaySync
        </div>
      </div>
      <div className='w-1/2 h-full flex flex-col items-center justify-center'>
        <div className='text-6xl font-semibold mb-6'>
          Sign In
        </div>
        <div className='text-gray-500 mb-10'>
          Sign in to access your account
        </div>
        <div 
          className='flex flex-row items-center py-4 px-6 rounded-lg border-2 bg-white cursor-pointer hover:bg-gray-100' 
          onClick={signInToGoogle}
        >
          <div className='mr-3'>
            <GoogleLogo />
          </div>
          <div className='text-lg'>
            Sign in with Google
          </div>
        </div>
      </div>
    </div>
  )
}

// ...existing code...
