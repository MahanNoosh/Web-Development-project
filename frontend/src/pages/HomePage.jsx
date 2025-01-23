import { Container, VStack, Text} from '@chakra-ui/react'
import { useColorModeValue } from '@/components/ui/color-mode'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTaskFeed } from '@/store/task'
import TaskCard from '@/components/ui/TaskCard'
import { useProfile } from '@/store/profile'

const HomePage = () => {
  const loggedinUser = useProfile((state) => state.loggedinUser)
  const {fetchTasks, tasks} = useTaskFeed()
  useEffect(() => {
    fetchTasks()
  }, [fetchTasks]);
  return (
    <Container maxWidth={"1140px"} py ={12}>
      <VStack gap ={8}>
        <Text
          fontSize={{ base: "2xl", sm: "3xl"}}
          fontWeight={"bold"}
          bgGradient={"to-br"}
          gradientFrom = {useColorModeValue("blue.600", "blue.200")}
          gradientTo= {useColorModeValue("red.600", "red.200")}
          bgClip={"text"}
          textAlign={"center"}
        >
          Current Tasks
        </Text>
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        {tasks.length === 0 && (
          <Text
          fontSize={{ base: "md", sm: "lg" }}
          >
            No Task found, {" "}
            <Link to={loggedinUser ? "/create" : "/login"}>
              <Text
                as={"span"}
                fontSize={{ base: "md", sm: "lg" }}
                bgGradient={"to-br"}
                gradientFrom = {useColorModeValue("blue.600", "blue.200")}
                gradientTo= {useColorModeValue("cyan.600", "cyan.200")}
                _hover={{textDecoration : "underline", textDecorationColor : useColorModeValue("blue.600", "blue.200")}}
                bgClip={"text"}
              >
                add a Task
              </Text>
            </Link>
         </Text>
        )}
      </VStack>
    </Container>
  )
}

export default HomePage