import { Auth, Button, ThemeSupa } from '@supabase/auth-ui-react'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useState } from 'react'

const Profile = () => {
  /*
  const session = useSession()
  const supabase = useSupabaseClient()
  */
  const supabaseClient = useSupabaseClient()
  const user = useUser()

  return (
    <div className="container">
      {!user ? (
        <Auth supabaseClient={supabaseClient} providers={['google', 'spotify']} appearance={{ theme: ThemeSupa }} theme="light" />
      ) : (
        <>
          <p>Account page will go here.</p>
          <button onClick={ () => supabaseClient.auth.signOut() }>Sign out</button>
        </>
      )}
    </div>
  )
}

export default Profile