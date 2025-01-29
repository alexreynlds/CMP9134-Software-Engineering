import Layout from "@/components/layout";
import {
  PasswordInput,
  PasswordStrengthMeter,
} from "@/components/ui/password-input";
import {
  Container,
  Heading,
  Input,
  Flex,
  Button,
  Text,
  Separator,
  Link,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import NextLink from "next/link";
import { useState, useEffect } from "react";
import { auth } from "@/firebase/config";
import {
  useSignInWithEmailAndPassword,
  useCreateUserWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const Page = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);

  const [isFlipped, setIsFlipped] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  function handleFlip() {
    setIsFlipped(!isFlipped);
    setEmail("");
    setPassword("");
    setPassword1("");
  }

  const handleEmailChange = (e) => {
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (e.target?.value && e.target.value.match(isValidEmail)) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    const upper = /[A-Z]/,
      lower = /[a-z]/;

    let passwordStrength = 0;

    if (e.target.value.length >= 5) passwordStrength += 1;
    if (e.target.value.length >= 10) passwordStrength += 1;
    if (e.target.value.match(format)) passwordStrength += 1;
    if (e.target.value.match(upper) && e.target.value.match(lower))
      passwordStrength += 1;

    setPasswordStrength(passwordStrength);
    setPassword(e.target.value);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    let errorMessages = [];

    if (!validEmail) errorMessages.push("Invalid Email");
    if (!passwordsMatch) errorMessages.push("Passwords Must Match");
    if (passwordStrength < 3) errorMessages.push("Password Too Weak");

    if (errorMessages.length > 0) {
      toaster.create({
        title: "Account Creation Failed",
        description: errorMessages.join(" & "),
        type: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      createUserWithEmailAndPassword(email, password);
      toaster.create({
        title: "Account Creation Successful",
        description: "You can now login",
        type: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      toaster.create({
        title: "Account Creation Failed",
        description: "Incorrect email or password.",
        type: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await signInWithEmailAndPassword(email, password);
      if (res.user) {
        toaster.create({
          title: "Login Successful",
          description: "You are now logged in.",
          type: "success",
          duration: 5000,
          isClosable: true,
        });
      }
      router.push("/home");
    } catch (err) {
      toaster.create({
        title: "Login Failed",
        description: "Incorrect email or password.",
        type: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    console.log(validEmail);
    if (password === password1) {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }
  }, [password, password1, email]);

  return (
    <Layout center={true}>
      <motion.div
        className="card"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
        }}
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
          <Container
            boxShadow="2xl"
            borderRadius={15}
            p={{ base: 5, md: 10 }}
            w={{ base: "90vw", md: "500px" }}
            h={{ base: "65vh", md: "700px" }}
            display="flex"
            flexDir="column"
            bg="white"
          >
            <Heading as="h1" size="6xl" textDecor="underline" mb={"25px"}>
              Sign In
            </Heading>
            <Flex flexDir="column" flexGrow={1}>
              <Input
                placeholder="email"
                type="email"
                size="2xl"
                mb={5}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <PasswordInput
                placeholder="Password"
                size="2xl"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <Link
                as={NextLink}
                href="/"
                color="blue"
                mt="4px"
                _hover={{ color: "darkblue" }}
              >
                Forgotten Password?
              </Link>
              <Button
                colorPalette="blue"
                mt="auto"
                color="black"
                size="xl"
                alignSelf="flex-end"
                w="100%"
                onClick={handleLogin}
              >
                SIGN IN
              </Button>
              <Flex
                my={3}
                w="100%"
                alignContent="center"
                alignItems="center"
                gap={3}
              >
                <Separator variant="solid" w="100%" />
                <Text color="gray">OR</Text>
                <Separator variant="solid" w="100%" />
              </Flex>
              <Button
                colorPalette="yellow"
                size="xl"
                alignSelf="flex-end"
                w="100%"
                onClick={handleFlip}
              >
                SIGN UP
              </Button>
            </Flex>
          </Container>
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
          <Container
            boxShadow="2xl"
            borderRadius={15}
            p={{ base: 5, md: 10 }}
            w={{ base: "90vw", md: "500px" }}
            h={{ base: "65vh", md: "700px" }}
            display="flex"
            flexDir="column"
            bg="white"
          >
            <Heading as="h1" size="6xl" textDecor="underline" mb={"25px"}>
              SIGN UP
            </Heading>
            <Flex flexDir="column" flexGrow={1}>
              <Input
                placeholder="email"
                size="2xl"
                mb={5}
                value={email}
                onChange={(e) => {
                  handleEmailChange(e);
                }}
              />
              <Input
                placeholder="password"
                size="2xl"
                mb={5}
                value={password}
                onChange={(e) => {
                  handlePasswordChange(e);
                }}
              />
              <PasswordStrengthMeter value={passwordStrength} />
              <Input
                placeholder="confirm password"
                size="2xl"
                value={password1}
                onChange={(e) => {
                  setPassword1(e.target.value);
                }}
              />
              {!passwordsMatch && <Text color="red">Passwords must match</Text>}
              <Button
                colorPalette="blue"
                mt="auto"
                color="black"
                size="xl"
                alignSelf="flex-end"
                w="100%"
                onClick={handleSignup}
              >
                SIGN UP
              </Button>
              <Flex
                my={3}
                w="100%"
                alignContent="center"
                alignItems="center"
                gap={3}
              >
                <Separator variant="solid" w="100%" />
                <Text color="gray">OR</Text>
                <Separator variant="solid" w="100%" />
              </Flex>
              <Button
                colorPalette="yellow"
                size="xl"
                alignSelf="flex-end"
                w="100%"
                onClick={handleFlip}
              >
                SIGN IN
              </Button>
            </Flex>
          </Container>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Page;
