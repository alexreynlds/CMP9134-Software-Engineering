import { Box, Container, Image } from "@chakra-ui/react";

const Layout = ({ children, center = false }) => {
  return (
    <Box position="relative">
      <Image
        src="turgle.jpg"
        position="absolute"
        w="100%"
        h="100%"
        filter="blur(10px)"
      />
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
    </Box>
  );
};

export default Layout;
