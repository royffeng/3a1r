import '../styles/globals.css'
import { AuthProvider } from '../lib/auth'
import { supabase } from '../lib/initSupabase'

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider supabase={supabase}>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
