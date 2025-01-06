import React from 'react'
import { useState } from 'react'
import { Box, Container, Heading, Input, Text, VStack, Button, HStack } from '@chakra-ui/react'
import { useColorModeValue } from '@/components/ui/color-mode'
import { PasswordInput } from '@/components/ui/password-input'
import { Switch } from "@/components/ui/switch"
import { toaster } from '@/components/ui/toaster'
import { useUserData } from '@/store/user'

const Signup = () => {
    const [userData, setUserData] = useState({
        name: "",
        username: "",
        password: "",
        email: "",
        phone: "",
        discord: "",
        linkedin: "",
        github: "",
    })
    const [tempData, setTempData] = useState({
        confirmPassword: "",
        hasMoreInfo: false,
    })
    const { createUser } = useUserData()

    const handleSignUp = async () => {
        if (userData.password !== tempData.confirmPassword) {
            toaster.create({
                title: "Error",
                duration: 3000,
                type: "error",
                description: "Passwords do not match"
            })
            return
        }
        const { success, message } = await createUser(userData)
        if (success) {
            toaster.create({
                title: "Success",
                duration: 3000,
                type: "success",
                description: message
            })
        } else {
            toaster.create({
                title: "Error",
                duration: 3000,
                type: "error",
                description: message
            })
        }
        setUserData({
            name: "",
            username: "",
            password: "",
            email: "",
            phone: "",
            discord: "",
            linkedin: "",
            github: "",
        })
        setTempData({
            confirmPassword: "",
            hasMoreInfo: false
        })
    }

    return (
        <Container maxW={"sm"} py={12}>
            <VStack gap={8}>
                <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
                    <Text
                        bgGradient="to-br"
                        gradientFrom={useColorModeValue("blue.600", "blue.200")}
                        gradientTo={useColorModeValue("purple.600", "purple.200")}
                        bgClip={"text"}
                        fontSize={{ base: "22px", sm: "28px" }}
                        fontWeight="bold"
                        textAlign="center"
                    >
                        Create An Account
                    </Text>
                </Heading>
                <Box w={"full"} p={6} bg={useColorModeValue("white", "black")} rounded={"lg"} shadow={"md"}>
                    <SignupForm
                        userData={userData}
                        setUserData={setUserData}
                        tempData={tempData}
                        setTempData={setTempData}
                        handleSignUp={handleSignUp}
                    />
                </Box>
            </VStack>
        </Container>
    )
}

const SignupForm = ({ userData, setUserData, tempData, setTempData, handleSignUp }) => {
    return (
        <VStack>
            <Input
                placeholder='Full Name'
                name='name'
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            />
            <Input
                placeholder='Username'
                name='username'
                value={userData.username}
                onChange={(e) => setUserData({ ...userData, username:  e.target.value.trim() })}
            />
            <PasswordInput
                placeholder='Password'
                name='password'
                value={userData.password}
                onChange={(e) => setUserData({ ...userData, password: e.target.value.trim()})}
            />
            <Input
                placeholder='Confirm Password'
                name='password'
                type='password'
                value={tempData.confirmPassword}
                onChange={(e) => setTempData({ ...tempData, confirmPassword: e.target.value.trim()})}
            />
            <Input
                placeholder='Email Address'
                name='email'
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value.trim() })}
            />
            <HStack>
                <Text fontSize={"xs"}>
                    Open optional contact information
                </Text>
                <Switch
                    size={"sm"}
                    onChange={(e) => setTempData({ ...tempData, hasMoreInfo: e.target.checked })}
                />
            </HStack>
            {tempData.hasMoreInfo && (
                <OptionalContactInfo userData={userData} setUserData={setUserData} />
            )}
            <Button
                onClick={handleSignUp}
                w={"full"}
            >
                Sign Up
            </Button>
        </VStack>
    )
}

const OptionalContactInfo = ({ userData, setUserData }) => {
    return (
        <VStack w={"full"}>
            <Input
                placeholder='LinkedIn URL'
                name='address'
                value={userData.linkedin}
                onChange={(e) => setUserData({ ...userData, linkedin: e.target.value.trim() })}
            />
            <Input
                placeholder='Github URL'
                name='github'
                value={userData.github}
                onChange={(e) => setUserData({ ...userData, github: e.target.value.trim() })}
            />
            <Input
                placeholder='Discord ID'
                name='discord'
                value={userData.discord}
                onChange={(e) => setUserData({ ...userData, discord: e.target.value.trim() })}
            />
            <Input
                placeholder='Phone Number'
                name='phone'
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value.trim() })}
            />
        </VStack>
    )
}

export default Signup