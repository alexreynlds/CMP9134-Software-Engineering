import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
} from "@chakra-ui/react";

const containerRecipe = defineRecipe({
  variants: {
    normal: {
      true: {
        bg: "gray.100",
      },
    },
  },
});

const buttonRecipe = defineRecipe({
  baseStyle: {
    color: "blue",
  },
  variants: {
    size: {
      xl: {
        fontSize: "sm",
        py: 3,
      },
    },
  },
});

const customConfig = defineConfig({
  theme: {
    colors: {
      brand: {
        500: "tomato",
      },
    },
    recipes: {
      button: buttonRecipe,
      container: containerRecipe,
    },
  },
});

export const theme = createSystem(defaultConfig, customConfig);
