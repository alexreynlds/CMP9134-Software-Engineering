import Layout from "@/components/layout";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Container,
  Heading,
  Input,
  Flex,
  Button,
  Text,
  Separator,
  Link,
  FormControl,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import NextLink from "next/link";
import { useState } from "react";
import { auth } from "@/firebase/config";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

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

  return (
    <Layout center={true}>
      <Container
        boxShadow="2xl"
        borderRadius={15}
        p={{ base: 5, md: 10 }}
        w={{ base: "90vw", md: "500px" }}
        h={{ base: "65vh", md: "600px" }}
        display="flex"
        flexDir="column"
      >
        <Heading as="h1" size="6xl" textDecor="underline" mb={"25px"}>
          Sign In
        </Heading>
        <Flex flexDir="column" flexGrow={1}>
          <Input
            placeholder="email"
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
            onClick={handleLogin}
          >
            SIGN UP
          </Button>
        </Flex>
      </Container>
    </Layout>
  );
};

export default Page;
