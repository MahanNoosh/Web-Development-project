import { useColorModeValue } from "@/components/ui/color-mode";
import { toaster } from "@/components/ui/toaster";
import { useTaskFeed } from "@/store/task";
import { useMyTasks } from "@/store/myTask";
import { useState, useEffect } from "react";
import { useProfile } from "@/store/profile";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "@/styles/style.css"
import { useNavigate } from "react-router-dom";
import {
  TbProgressCheck,
  TbProgress,
  TbProgressX,
  TbProgressAlert,
} from "react-icons/tb";
import { HiCheck, HiX } from "react-icons/hi";
import { FcHighPriority, FcLowPriority, FcMediumPriority } from "react-icons/fc";
import {
  Box,
  Heading,
  HStack,
  Text,
  Button,
  Input,
  VStack,
  Flex,
  Textarea,
  Container
} from "@chakra-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuItemCommand,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { Switch } from "@/components/ui/switch";

const CreatePage = () => {
  const loggedInUser = useProfile((state) => state.loggedinUser);
  const updateUser = useProfile((state) => state.updateUser);
  const getTask = useMyTasks((state) => state.getTask);
  const navigate = useNavigate();
  const updateTask = useTaskFeed((state) => state.updateTask);
  const [newTask, setNewTask] = useState({
      name: "",
      status: "Not started",
      isPublic: false,
      description: "",
      deadline: Date(),
      priority: "High",
      prev: loggedInUser ? loggedInUser.last : null, 
      creator: loggedInUser ? loggedInUser.userid : "",
      duration: "",
      next: null,
      image: "",
  });
  useEffect(() => {
    setNewTask(prevState => ({
      ...prevState,
      prev: loggedInUser ? loggedInUser.last : null,
    }));
  }, [loggedInUser]);
  const { createTask } = useTaskFeed();
  const mode = useColorModeValue("light", "dark");
  const handleAddTask = async () => {
    const { success, message, task } = await createTask(newTask);
    if (success) {
      toaster.create({
        title: "Success",
        duration: 2000,
        type: "success",
        description: message,
      });
      console.log(loggedInUser, task);
      if (loggedInUser.first === null) {
        await updateUser(loggedInUser._id, {...loggedInUser, first: task.data._id, last: task.data._id});
      }
      else{
        const lastTask = await getTask(loggedInUser.last);
        await updateTask(lastTask._id, {task: {...lastTask, next: task.data._id}, user: null});
        await updateUser(loggedInUser._id, {...loggedInUser, last: task.data._id});
      }
      navigate("/mytasks");
    } else {
      toaster.create({
        title: "Error",
        duration: 2000,
        type: "error",
        description: message,
      });
    }
    setNewTask({
      name: "",
      status: "Not started",
      isPublic: false,
      description: "",
      deadline: Date(),
      priority: "High",
      duration: "",
      prev: loggedInUser ? loggedInUser.last : null,
      creator: loggedInUser ? loggedInUser.userid : "",
      next: null,
      image: "",
    });
  };
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
            Create A New Task
          </Text>
        </Heading>
        <Box
          width={{base: "300px", sm: "400px", md: "450px"}}
          p={6}
          bg={useColorModeValue("white", "black")}
          rounded={"lg"}
          shadow={"md"}
        >
          <VStack gap={2}>
            <Input
              placeholder="task Name"
              name="name"
              value={newTask.name}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  name: e.target.value,
                })
              }
            />
            <Input
              placeholder="Image URL"
              name="image"
              value={newTask.image}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  image: e.target.value,
                })
              }
            />
            <Textarea
              resize="none"
              placeholder="Description"
              name="description"
              size="sm"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  description: e.target.value.replace(/\n/g, ""),
                })
              }
            />
            <Flex w={"full"} gap={2} justifyContent={"space-between"}
            alignItems={"left"}
            flexDir={{
              base: "column",
              md: "row",
            }}
            >
              <div className={"border--" + mode}>
                <HStack gap={0}>
                  <Text fontSize={"sm"} pl={2} color="gray.500">
                    Deadline:
                  </Text>
                  <DatePicker
                    className={"custom-datepicker--" + mode}
                    selected={new Date(newTask.deadline)}
                    onChange={(date) =>
                      setNewTask({
                        ...newTask,
                        deadline: new Date(date),
                      })
                    }
                    showTimeSelect
                    dateFormat="dd-MMM yyyy 'at' HH:mm"
                  />
                </HStack>
              </div>
              <div className={"border--" + mode}>
                <HStack gap={0}>
                  <Text fontSize={"sm"} pl={2} color="gray.500">
                    Priority:
                  </Text>
                  <MenuRoot onFocusOutside={() => setOpen(false)}>
                    <MenuTrigger>
                      <Button
                        variant="plain"
                        colorPalette={
                          newTask.priority === "High"
                            ? "red"
                            : newTask.priority === "Medium"
                            ? "yellow"
                            : "green"
                        }
                      >
                        {newTask.priority === "High" ? (
                          <FcHighPriority size={12} />
                        ) : newTask.priority === "Medium" ? (
                          <FcMediumPriority size={12} />
                        ) : (
                          <FcLowPriority size={12} />
                        )}{" "}
                        {newTask.priority}
                      </Button>
                    </MenuTrigger>
                    <MenuContent zIndex="max">
                      <MenuItem
                        value="High"
                        onClick={() =>
                          setNewTask({ ...newTask, priority: "High" })
                        }
                      >
                        High
                      </MenuItem>
                      <MenuItem
                        value="Medium"
                        onClick={() =>
                          setNewTask({ ...newTask, priority: "Medium" })
                        }
                      >
                        Medium
                      </MenuItem>
                      <MenuItem
                        value="Low"
                        onClick={() =>
                          setNewTask({ ...newTask, priority: "Low" })
                        }
                      >
                        Low
                      </MenuItem>
                    </MenuContent>
                  </MenuRoot>
                </HStack>
              </div>
            </Flex>
            <Flex w={"full"} gap={2} justifyContent={"space-between"}
            alignItems={"left"}
            flexDir={{
              base: "column",
              md: "row",
            }}
            >
              <Input
                placeholder="Time needed (in minutes)"
                type="number"
                name="tags"
                value={newTask.duration}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    duration: e.target.value,
                  })
                }
              />
              <div className={"border--" + mode}>
                <HStack gap={0}>
                  <Text pl={2} color="gray.500"
                    fontSize={"sm"}
                  >
                    Status:
                  </Text>
                  <MenuRoot onFocusOutside={() => setOpen(false)}>
                    <MenuTrigger asChild>
                      <Button
                        variant="plain"
                        colorPalette={
                          newTask.status === "Completed"
                            ? "green"
                            : newTask.status === "In progress"
                            ? "orange"
                            : newTask.status === "Overdue"
                            ? "red"
                            : "blue"
                        }
                      >
                        {newTask.status === "Completed" ? (
                          <TbProgressCheck size={12} />
                        ) : newTask.status === "In progress" ? (
                          <TbProgress size={12} />
                        ) : newTask.status === "Overdue" ? (
                          <TbProgressX size={12} />
                        ) : (
                          <TbProgressAlert size={12} />
                        )}{" "}
                        {newTask.status}
                      </Button>
                    </MenuTrigger>
                    <MenuContent zIndex="max">
                      <MenuItem
                        value="Not started"
                        onClick={() =>
                          setNewTask({
                            ...newTask,
                            status: "Not started",
                          })
                        }
                      >
                        Not started
                      </MenuItem>
                      <MenuItem
                        value="In progress"
                        onClick={() =>
                          setNewTask({
                            ...newTask,
                            status: "In progress",
                          })
                        }
                      >
                        In progress
                      </MenuItem>
                      <MenuItem
                        value="Completed"
                        onClick={() =>
                          setNewTask({
                            ...newTask,
                            status: "Completed",
                          })
                        }
                      >
                        Completed
                      </MenuItem>
                      <MenuItem
                        value="Overdue"
                        onClick={() =>
                          setNewTask({ ...newTask, status: "Overdue" })
                        }
                      >
                        Overdue
                      </MenuItem>
                    </MenuContent>
                  </MenuRoot>
                </HStack>
              </div>
            </Flex>
            <Switch
              size={{ base: "sm", md: "md" }}
              checked={newTask.isPublic}
              trackLabel={{
                off: <HiX color={useColorModeValue("black", "white")} size={13} />,
              }}
              thumbLabel={{
                on: <HiCheck color={useColorModeValue("black", "white")} size={13} />,
              }}
              onCheckedChange={({ checked }) => {
                setNewTask({ ...newTask, isPublic: checked });
              }}
            >
              <Text>Share On Home Page</Text>
            </Switch>
            <Button
              type="submit"
              size={{ base: "md", md: "xl" }}
              colorScheme="blue"
              onClick={handleAddTask}
            >
              Create Task
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};
export default CreatePage;
