import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { auth } from '@/firebase/firebaseConfig'
import { useToast } from '@/hooks/use-toast'


function Login() {
  const router = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const { toast } = useToast()


  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await signInWithEmailAndPassword(email, password);
      if (res.user) {
        toast({
          title: "Login Successful!",
          description: "You have successfully logged"
        })
        router('/dashboard')
      } else {
        toast({
          title: "Login Failed!",
          description: "Ensure your email and password are correct",
          variant: "destructive",
        })
      }
    }
    catch (err) {
      console.log("Invalid Login");
      toast({
        title: "Login Failed!",
        description: "Ensure your email and password are correct",
        variant: "destructive",
      })
    }
  }
  const test1 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Toast!",
      description: "This is a toast message",
    })
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Card className="text-left w-[400px] min-h-[500px] flex flex-col shadow-xl">
        <CardHeader>
          <CardTitle className="text-4xl">Login</CardTitle>
          <CardDescription>Please login with your email and password</CardDescription>
        </CardHeader>
        <form onSubmit={login} className="flex flex-col flex-grow">
          <CardContent className="flex flex-col flex-grow">
            <Label className="text-xl">Email</Label>
            <Input type="email" placeholder="Email" className="mb-3 h-[40px]" onChange={(e) => setEmail(e.target.value)} value={email} />
            <Label className="text-xl">Password</Label>
            <Input type="password" placeholder="Password" className="h-[40px]" onChange={(e) => setPassword(e.target.value)} value={password} />
          </CardContent>
          <CardFooter className="flex flex-col gap-0 mt-auto">
            <Button type="submit" className="mt-5 w-full rounded-xl">SIGN IN</Button>
            <Button variant="outline" onClick={test1} className="mt-5 w-full rounded-xl">SIGN UP</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default Login
