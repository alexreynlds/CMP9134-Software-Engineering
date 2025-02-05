import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/firebase/firebaseConfig'
import { useToast } from '@/hooks/use-toast'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'

function Dashboard() {
  const navigate = useNavigate()
  const [user] = useAuthState(auth)
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const logout = async () => {
    await auth.signOut()
    toast({
      title: "Logout Successful!",
      description: "You have successfully logged out"

    })
    navigate('/')
  }


  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast({
      title: "Search",
      description: `Searching for ${searchQuery}`
    })
    fetch(`https://api.openverse.org/v1/images/?q=${searchQuery}`).then(res => res.json()).then(data => {
      setSearchResults(data.results)
    })
  }

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [])

  return (
    <div className="flex flex-col items-center text-black justify-center w-1/2 h-2/3 rounded-xl backdrop-blur-md bg-white/25 flex flex-col  p-3 shadow-xl">
      <h1 className="mb-3 text-black">Welcome, {user ? user.email : ""}</h1>
      <form className="w-1/3 mb-3" onSubmit={handleSearch}>
        <div className="flex">
          <Input placeholder="Type to search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="rounded-l-xl" />
          <Button className="rounded-r-xl">Search</Button>
        </div>
      </form>
      <div className="grid grid-cols-8 w-fill p-3 gap-3 border-red-100 border-[2px] rounded-xl">
        {searchResults.map((result: any) => (
          <div key={result.id}>
            <a href={result.url} title={result.title}>
              <img src={result.thumbnail} alt={result.title} className="rounded-xl" />
            </a>
          </div>
        ))}
      </div>
      <Button className="rounded-xl w-1/4 mt-auto" onClick={logout}>LOGOUT</Button>
    </div>
  )
}

export default Dashboard
