import React, { useState } from 'react'
import { Box, Container, Heading, Input, Text, VStack, Button } from '@chakra-ui/react'
import { useColorModeValue } from '@/components/ui/color-mode'
import { useProfile } from '@/store/profile'
import { toaster } from '@/components/ui/toaster'
import { Link } from 'react-router-dom'
import {PasswordInput} from '@/components/ui/password-input'

const Login = () => {
    const loggedinUser = useProfile(state => state.loggedinUser);
    const fetchProfile = useProfile(state => state.fetchProfile);
    const loginUser = useProfile(state => state.loginUser);
    const logoutUser = useProfile(state => state.logoutUser);
    const [userData, setUserData] = useState({
      username: "",
      password: "",
    })
    //logoutUser();
    if (!loggedinUser) {
      fetchProfile(); 
    }
    const handleLogin = async () => {
      const { success, message } = await loginUser(userData);
      if (success) {
          toaster.create({
              title: "Success",
              duration: 3000,
              type: "success",
              description: message,
          });
      } else {
          toaster.create({
              title: "Error",
              duration: 3000,
              type: "error",
              description: message,
          });
      }
      setUserData({
          username: "",
          password: "",
      });
  };
  
  return (
    <Container maxW = {"sm"} py={12}>
      <VStack gap = {8}>
        <Text
              bgGradient="to-br" 
              gradientFrom = {useColorModeValue("blue.600", "blue.200")}
              gradientTo= {useColorModeValue("purple.600", "purple.200")}
              bgClip={"text"}
              fontSize={{ base: "22px", sm: "28px" }}
              fontWeight="bold"
              textAlign="center"
          >
            Logged in as {loggedinUser?.username ?? 'Guest'}
          </Text>
        <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
          <Text
              bgGradient="to-br" 
              gradientFrom = {useColorModeValue("blue.600", "blue.200")}
              gradientTo= {useColorModeValue("purple.600", "purple.200")}
              bgClip={"text"}
              fontSize={{ base: "22px", sm: "28px" }}
              fontWeight="bold"
              textAlign="center"
          >
            Login To Your Account
          </Text>
        </Heading>
        <Box w={"full"} p={6} bg = {useColorModeValue("white", "black")} rounded={"lg"} shadow={"md"}> 
          <VStack spacing = {4}>
            <Input 
                placeholder='Username' 
                name='username'
                value={userData.username} 
                onChange={(e) => setUserData({...userData, username: e.target.value})}
            />
            <PasswordInput
                placeholder='Password' 
                name='password'
                value={userData.password} 
                onChange={(e) => setUserData({...userData, password: e.target.value})}
            />
            <Button 
              colorScheme={useColorModeValue("blue", "purple")}
              onClick={handleLogin}
              w = {"full"}
            >
              Login
            </Button>
            <Text 
                fontSize={"xs"} 
                color={"gray.500"}
            >
                No account?{" "}
                <Link to="/signup"> 
                    <Text 
                        as={"span"}
                        fontSize={"xs"} 
                        bgGradient={"to-br"}
                        gradientFrom = {useColorModeValue("blue.600", "blue.200")}
                        gradientTo= {useColorModeValue("cyan.600", "cyan.200")}
                        bgClip={"text"}
                        _hover={{textDecoration : "underline", textDecorationColor : useColorModeValue("blue.600", "blue.200")}}
                    >       
                        Create One
                    </Text>
                </Link>
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}

export default Login