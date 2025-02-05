import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'


function NotFound() {
  const navigate = useNavigate()

  const returnHome = () => {
    navigate('/')
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="mb-3">Page Not Found</h1>
      <Button className="rounded-xl " onClick={returnHome}>Return to home page</Button>
    </div>
  )
}

export default NotFound
