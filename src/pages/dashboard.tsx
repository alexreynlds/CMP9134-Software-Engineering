import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/firebase/firebaseConfig'
import { useToast } from '@/hooks/use-toast'
import { useEffect } from 'react'


function Dashboard() {
  const navigate = useNavigate()
  const [user] = useAuthState(auth)
  const { toast } = useToast()

  const logout = async () => {
    await auth.signOut()
    toast({
      title: "Logout Successful!",
      description: "You have successfully logged out"
    })
    navigate('/')
  }

  useEffect(() => {
    console.log("eacwd")
    if (!user) {
      navigate('/')
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="mb-3">Welcome, {user ? user.email : ""}</h1>
      <Button className="rounded-xl " onClick={logout}>LOGOUT</Button>
    </div>
  )
}

export default Dashboard
