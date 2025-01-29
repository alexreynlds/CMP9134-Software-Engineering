import Layout from "@/components/layout";
import { Container, Flex, Heading, Link } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, []);

  return (
    <Layout>
      {user && (
        <Container bg="lightgray" h="100%" w="100%">
          <Flex
            justifyContent="space-between"
            bg="white"
            p={3}
            borderRadius={15}
          >
            {user && (
              <Heading as="h1" size="2xl">
                Welcome, {user.email}
              </Heading>
            )}
            <Link onClick={handleSignOut}>LOG OUT</Link>
          </Flex>
        </Container>
      )}
    </Layout>
  );
};

export default Page;
