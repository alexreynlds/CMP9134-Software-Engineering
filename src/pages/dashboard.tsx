import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/firebase/firebaseConfig'
import { useToast } from '@/hooks/use-toast'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { FaHeart, FaCog } from "react-icons/fa";
import { AnimatePresence, motion } from 'framer-motion'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
import { Separator } from '@/components/ui/separator'
import { useUpdatePassword } from 'react-firebase-hooks/auth'

function Dashboard() {
  const navigate = useNavigate()
  const [user] = useAuthState(auth)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [updatePassword] = useUpdatePassword(auth)
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [settingsOpen, setSettingsOpen] = useState(false)

  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const [favourites, setFavourites] = useState([])

  const logout = async () => {
    await auth.signOut()
    toast({
      title: "Logout Successful!",
      description: "You have successfully logged out"

    })
    navigate('/')
  }

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen)
  }

  const handleUsernameChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (user) {
      updateDoc(doc(db, "users", user.uid), {
        username: newUsername
      })
    }
    fetchUserData()
  }

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (user) {
      const result = await updatePassword(newPassword)
      if (result) {
        toast({
          title: "Password Updated!",
          description: "You have successfully updated your password"
        })
      }
      else {
        toast({
          title: "Password Update Failed!",
          description: "Ensure your password is at least 6 characters long"
        })
      }
    }
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

  const handleFavourite = (result: any) => async () => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        let userDoc = docSnap.data();
        let updatedFavourites = [];

        if (userDoc.favourites) {
          if (userDoc.favourites.includes(result.id)) {
            updatedFavourites = userDoc.favourites.filter((fav: string) => fav !== result.id);
          } else {
            updatedFavourites = [...userDoc.favourites, result.id];
          }
        } else {
          updatedFavourites = [result.id];
        }
        setFavourites(updatedFavourites);
        await updateDoc(docRef, { favourites: updatedFavourites });
      }
    }
  };

  const fetchUserData = async () => {
    if (user) {
      const docRef = doc(db, "users", user.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setUserProfile(docSnap.data())
        if (docSnap.data().favourites) setFavourites(docSnap.data().favourites)
      } else {
        console.log("User document does not exist!")
      }
    }
  }

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [])

  useEffect(() => {
    fetchUserData()
  }, [user])

  return (
    <div className="items-center text-black justify-center w-1/2 h-4/5 rounded-xl gap-3 relative backdrop-blur-md bg-white/25 flex flex-col  p-3 shadow-xl">
      <div className="flex relative w-full justify-center text-center align-center items-center">
        <h1>Welcome, {userProfile ? userProfile.username ? userProfile.username : userProfile.email : "Loading..."}</h1>
        <text className="absolute right-0 cursor-pointer hover:text-gray-400 flex items-center gap-1" onClick={toggleSettings}><FaCog />account settings</text>
      </div>
      <div className="p-3 w-full h-full rounded-xl  justify-center flex flex-col">
        <div className="w-100 justify-center flex">
          <form className="w-1/3" onSubmit={handleSearch}>
            <div className="flex">
              <Input placeholder="Type to search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="rounded-l-xl" />
              <Button className="rounded-r-xl">Search</Button>
            </div>
          </form>
        </div>
        {/* Search Results */}
        <div className="grid grid-cols-8 my-3 w-fill p-3 gap-3 border-red-100 border-[2px] rounded-xl h-full overflow-auto">
          {searchResults.map((result: any) => (
            <div key={result.id} className={`relative hover:scale-110 hover:rotate-[2deg]`}>
              <a href={result.url} title={result.title}>
                <img src={result.thumbnail} alt={result.title} className="rounded-xl  shadow-lg" />
              </a>
              <Button
                className={`absolute top-0 rounded-tl-xl z-10 bg-white/50 hover:text-red-500 hover:bg-white/50 ${favourites.includes(result.id) ? "text-red-500" : "text-white"}`}
                onClick={handleFavourite(result)}
              >
                <FaHeart />
              </Button>

            </div>
          ))}
        </div>
      </div >
      <Button className="rounded-xl w-1/4 mt-auto" onClick={logout}>LOGOUT</Button>
      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            className="absolute w-1/3  h-full left-full bg-white/25 shadow-lg overflow-hidden rounded-xl ml-3 backdrop-blur-md"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 500, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="p-3 w-[500px] relivate h-full">
              <h2 className="text-xl font-semibold ">Account Settings</h2>
              <Separator className="mb-3 border-black border-2" />
              <p>Change Username</p>
              <div className="flex mb-3">
                <form className="flex w-full" onSubmit={handleUsernameChange}>
                  <Input placeholder="username" className="rounded-l-xl" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
                  <Button className="rounded-r-xl" >Confirm</Button>
                </form>
              </div>
              <p>Change Password</p>
              <div className="flex">
                <form className="flex w-full" onSubmit={handlePasswordChange}>
                  <Input placeholder="password" type="password" className="rounded-l-xl" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  <Button className="rounded-r-xl" >Confirm</Button>
                </form>
              </div>
              <text className="absolute bottom-3">UID: {userProfile.uid}</text>
            </div>
          </motion.div >
        )
        }
      </AnimatePresence >


    </div >
  )
}

export default Dashboard
