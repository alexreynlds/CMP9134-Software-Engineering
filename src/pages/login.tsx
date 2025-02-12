import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useSignInWithEmailAndPassword,
  useCreateUserWithEmailAndPassword
} from "react-firebase-hooks/auth";
import { auth } from '@/firebase/firebaseConfig'
import { db } from '@/firebase/firebaseConfig'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import { Separator } from '@/components/ui/separator'
import { getDoc, doc, setDoc } from 'firebase/firestore'
import { Checkbox } from '@/components/ui/checkbox'
import { useEffect } from 'react'

function Login() {
  const router = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [passwordConf, setPasswordConf] = useState('')
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const [rememberMe, setRememberMe] = useState(false)
  const { toast } = useToast()

  const [isFlipped, setIsFlipped] = useState(false)

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await signInWithEmailAndPassword(email, password);
      if (res.user) {
        toast({
          title: "Login Successful!",
          description: "You have successfully logged"
        })

        const docRef = doc(db, "users", res.user.uid);
        if (!(await getDoc(docRef)).exists()) {
          await setDoc(doc(db, "users", res.user.uid), {
            uid: res.user.uid,
            email: res.user.email,
          });
        }

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
          localStorage.setItem("rememberedPassword", password);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
          localStorage.removeItem("rememberMe");
        }

        router("/dashboard")

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

  const signup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (signUpPassword !== passwordConf) {
      toast({
        title: "Signup Failed!",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }
    try {
      const res = await createUserWithEmailAndPassword(signUpEmail, signUpPassword);
      if (res.user) {
        toast({
          title: "Signup Successful!",
          description: "You can now login with your account",
        })
      }
    } catch (err) {
      console.log("Invalid Signup");
      toast({
        title: "Signup Failed!",
        description: "Ensure your email and password are correct",
        variant: "destructive",
      })
    }
  }

  const handleFlip = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsFlipped(!isFlipped)
  }

  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    const storedPassword = localStorage.getItem("rememberedPassword");
    const storedRememberMe = localStorage.getItem("rememberMe");

    if (storedEmail && storedPassword && storedRememberMe === "true") {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setRememberMe(true);
    }
  }, []);


  return (
    <div className="flex flex-col items-center justify-center h-full">
      <motion.div
        className="card w-[400px] h-[600px] relative [transform-style:preserve-3d] [backface-visibility:hidden]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="card-front"
          style={{
            position: "absolute",
            backfaceVisibility: "hidden",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card className="text-left w-[400px] min-h-[500px] flex flex-col shadow-xl bg-white/100 backdrop-blur-sm">
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

                <div className="flex gap-3 mt-3 items-center">
                  <Checkbox
                    checked={rememberMe}
                    onCheckedChange={() => setRememberMe(!rememberMe)}
                  />
                  <text>Remember Me</text>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-0 mt-auto h-auto pb-0">
                <Button type="submit" className="mt-5 w-full rounded-xl">SIGN IN</Button>
              </CardFooter>
            </form>
            <div className="flex w-full items-center gap-3 my-3">
              <Separator className="flex flex-grow w-auto" />
              <text className="font-bold">OR</text>
              <Separator className="flex flex-grow w-auto" />
            </div>
            <CardFooter className="flex flex-col gap-0 h-auto">
              <form onSubmit={handleFlip} className="w-full">
                <Button type="submit" variant="outline" className=" w-full rounded-xl">
                  SIGN UP
                </Button>
              </form>
            </CardFooter>
          </Card>
        </motion.div>
        <motion.div
          className="card-back"
          style={{
            position: "absolute",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card className="text-left w-[400px] min-h-[500px] flex flex-col shadow-xl bg-white/100 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-4xl">SIGNUP</CardTitle>
              <CardDescription>Please login with your email and password</CardDescription>
            </CardHeader>

            <form onSubmit={signup} className="flex flex-col flex-grow">
              <CardContent className="flex flex-col flex-grow gap-3">
                <div>
                  <Label className="text-xl">Email</Label>
                  <Input type="email" placeholder="Email" className="h-[40px]" onChange={(e) => setSignUpEmail(e.target.value)} value={signUpEmail} />
                </div>
                <div>
                  <Label className="text-xl">Password</Label>
                  <Input type="text" placeholder="Password" className="h-[40px]" onChange={(e) => setSignUpPassword(e.target.value)} value={signUpPassword} />
                </div>
                <div>
                  <Label className="text-xl">Confirm Password</Label>
                  <Input type="text" placeholder="Password" className="h-[40px]" onChange={(e) => setPasswordConf(e.target.value)} value={passwordConf} />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-0 mt-auto h-auto pb-0">
                <Button type="submit" className="mt-5 w-full rounded-xl">SIGN UP</Button>
              </CardFooter>
            </form>
            <div className="flex w-full items-center gap-3 my-3">
              <Separator className="flex flex-grow w-auto" />
              <text className="font-bold">OR</text>
              <Separator className="flex flex-grow w-auto" />
            </div>
            <CardFooter className="flex flex-col gap-0 h-auto">
              <form onSubmit={handleFlip} className="w-full">
                <Button type="submit" variant="outline" className=" w-full rounded-xl">SIGN IN</Button>
              </form>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div >
  )
}

export default Login
