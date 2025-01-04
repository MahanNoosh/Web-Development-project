import { Button, Text, Container, Flex, HStack } from '@chakra-ui/react'
import { React, useState } from 'react'
import { LuPlus } from "react-icons/lu";
import { FiPlusCircle } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { ColorModeButton,useColorModeValue } from './color-mode';


const Navbar = () => {
  const [isHovering, setIsHovering] = useState(false)
  return (
    <Container maxW="1140px" px = {4}>
      <Flex 
        h={16} 
        alignItems={'center'} 
        justifyContent={'space-between'}
          flexDir={{
            base: "column",
            sm: "row"
          }}
      >
        <Link to="/">
        <Text
            bgGradient="to-br" 
            gradientFrom = {useColorModeValue("blue.600", "blue.200")}
            gradientTo= {useColorModeValue("red.600", "red.200")}
            bgClip={"text"}
            fontSize={{ base: "22px", sm: "28px" }}
            fontWeight="bold"
            textAlign="center"
        >
          Product Store
        </Text>
        </Link>
        <HStack gap= {2} alignItems={"center"} >
          <Link to="/create">
            <Button 
              height={10} 
              width={1} 
              variant="ghost"
              _hover={{bg :useColorModeValue("gray.900", "gray.200"), _icon : {color : useColorModeValue("white", "black")}}}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            > 
              {isHovering === true ? <FiPlusCircle /> : <LuPlus />}
            </Button>
          </Link>
          <ColorModeButton/>
        </HStack>
      </Flex>
    </Container>
  )
}

export default Navbar