import { useColorModeValue } from '@/components/ui/color-mode'
import { toaster } from "@/components/ui/toaster"
import { useTaskFeed } from '@/store/task'
import { Box, Container, Heading, VStack, Input, Text, Button } from '@chakra-ui/react'
import { useState } from 'react'
import { useProfile } from '@/store/profile'

const CreatePage = () => {
  const loggedInUser = useProfile(state => state.loggedinUser);
  const [newTask, setNewTask] = useState({
    name: "",
    price: "",
    image: "",
    creator: loggedInUser.userid })
  const {createTask} =useTaskFeed()
  const handleAddTask = async() => {
    const {success, message} = await createTask(newTask)
    if (success) {
      toaster.create({
        title: "Success",
        duration: 2000,
        type: "success",
        description: message
      })
    }
    else {
      toaster.create({
        title: "Error",
        duration: 2000,
        type: "error",
        description: message
      })
    }
    setNewTask({
      name: "",
      price: "",
      image: "",
      creator: loggedInUser.userid
    })
  }
  return(
    <Container maxW = {"sm"} py={12}>
      <VStack gap = {8}>
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
            Create A New Task
          </Text>
        </Heading>
        <Box w={"full"} p={6} bg = {useColorModeValue("white", "black")} rounded={"lg"} shadow={"md"}> 
          <VStack spacing = {4}>
            <Input 
                placeholder='Task Name' 
                name='name'
                value={newTask.name} 
                onChange={(e) => setNewTask({...newTask, name: e.target.value})}
            />
            <Input 
                placeholder='Price' 
                name='price'
                type='number'
                value={newTask.price} 
                onChange={(e) => setNewTask({...newTask, price: e.target.value})}
            />
            <Input 
                placeholder='Image URL' 
                name='image'
                value={newTask.image} 
                onChange={(e) => setNewTask({...newTask, image: e.target.value})}
            />
            <Button 
              colorScheme={useColorModeValue("white", "black")}
              onClick={handleAddTask}
              w = {"full"}
            >
              Add Task
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}
export default CreatePage