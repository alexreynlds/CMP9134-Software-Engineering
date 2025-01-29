'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'
import { theme } from '@/libs/theme'

export function Provider(props) {
  return (
    <ChakraProvider value={theme} >
      <ColorModeProvider {...props} forcedTheme="light" />
    </ChakraProvider >
  )
}
