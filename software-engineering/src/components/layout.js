import { Container } from "@chakra-ui/react";

const Layout = ({ children, center = false }) => {
  return (
    <Container
      display="flex"
      flexDir="column"
      alignItems={center ? "center" : "flex-start"}
      justifyContent={center ? "center" : "flex-start"}
      gap={5}
      // my={5}
      h="100vh"
    >
      {children}
    </Container>
  );
};

export default Layout;
