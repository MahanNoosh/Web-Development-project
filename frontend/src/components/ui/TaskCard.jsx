import { RiDeleteBin2Line, RiEditBoxLine, RiMailFill } from "react-icons/ri";
import { FaGithub, FaLinkedin, FaDiscord } from "react-icons/fa";
import { TbProgressCheck, TbProgress, TbProgressX, TbProgressAlert } from "react-icons/tb";
import { PiHandsClapping, PiSmileySadBold, PiSmileyBold, PiThumbsUpBold } from "react-icons/pi";
import { AiFillInstagram } from "react-icons/ai";
import { toaster } from "./toaster";
import {
  Box,
  Heading,
  HStack,
  IconButton,
  Image,
  Text,
  Button,
  Input,
  VStack,
  Badge,
  Flex,
} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useState, useEffect } from "react";
import { useTaskFeed } from "@/store/task";
import { getUser as getCreator } from "/src/management/user";
import { useProfile } from "@/store/profile";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogActionTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCardArrow,
  HoverCardContent,
  HoverCardRoot,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const TaskCard = ({ task }) => {
  const loggedinUser = useProfile((state) => state.loggedinUser);
  const bg = useColorModeValue("white", "gray.800");
  const [updatedTask, setUpdatedTask] = useState(task);
  const {deleteTask, updateTask } = useTaskFeed();
  const [creatorData, setUser] = useState({
    success: false,
    data: {},
  });

  useEffect(() => {
    const fetchCreator = async () => {
      const data = await getCreator(task.creator);
      setUser(data);
    };
    fetchCreator();
  }, [task.creator]);


  const handleDelete = async (id) => {
    const { success, message } = await deleteTask(id);
    if (success) {
      toaster.create({
        title: "Success",
        duration: 2000,
        type: "success",
        description: message,
      });
    } else {
      toaster.create({
        title: "Error",
        duration: 2000,
        type: "error",
        description: message,
      });
    }
  };
  const handleUpdate = async (id, updatedtask) => {
    const { success, message } = await updateTask(id, updatedtask);
    if (success) {
      toaster.create({
        title: "Success",
        duration: 2000,
        type: "success",
        description: message,
      });
    } else {
      toaster.create({
        title: "Error",
        duration: 2000,
        type: "error",
        description: message,
      });
    }
  };
  const height = task.image ? "500px" : "175px";
  return (
    <Box
      shadow="lg"
      rounded="lg"
      h={height}
      w={{base:"200px", sm:"300px", md:"400px", lg:"500px", xl:"600px"}}
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: "Scale(1.05)" }}
      bg={bg}
    >
      {task.image && <Image
        src={task.image}
        alt={task.name}
        h="50%"
        w="full"
        objectFit={"cover"}
        mx="auto"
        borderRadius={"lg"}
      />
}
      <Box p="4">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
        <Heading
          as="h3"
          size={"xl"}
          mb={2}
          textAlign="left"
          bgGradient="to-br"
          gradientFrom={useColorModeValue("red.500", "red.200")}
          gradientTo={useColorModeValue("yellow.500", "yellow.200")}
          bgClip={"text"}
        >
          {task.name}
        </Heading>
        <Badge
        size={"xs"}
        colorPalette={task.status === "Completed" ? "green" : task.status === "In progress" ? "orange" : task.status === "Overdue" ? "red" : "blue"}
        >
          {task.status === "Completed" ? <TbProgressCheck size={14}/> : task.status === "In progress" ? <TbProgress size={14}/> : task.status === "Overdue" ? <TbProgressX size={14}/> : <TbProgressAlert size={14}/>}
          <Text fontSize={"10"}> 
            {task.status}
          </Text>
        </Badge>
        </Flex>
        <HStack gap={1} justifyContent="flex-start">
          <DialogRoot motionPreset={"scale"} size={"sm"}>
            <DialogTrigger asChild>
              <IconButton
                display={
                  loggedinUser &&
                  loggedinUser.username === creatorData.data.username
                    ? "flex"
                    : "none"
                }
                aria-label="Edit task"
                variant="ghost"
                size={"xs"}
                _icon={{ color: useColorModeValue("blue.600", "blue.200") }}
              >
                <RiEditBoxLine />
              </IconButton>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update task</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <VStack gap={2}>
                  <Input
                    placeholder="task Name"
                    name="name"
                    value={updatedTask.name}
                    onChange={(e) =>
                      setUpdatedTask({
                        ...updatedTask,
                        name: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Image URL"
                    name="image"
                    value={updatedTask.image}
                    onChange={(e) =>
                      setUpdatedTask({
                        ...updatedTask,
                        image: e.target.value,
                      })
                    }
                  />
                </VStack>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogActionTrigger>
                <DialogActionTrigger asChild>
                  <Button
                    onClick={() => handleUpdate(task._id, updatedTask)}
                  >
                    Save
                  </Button>
                </DialogActionTrigger>
              </DialogFooter>
              <DialogCloseTrigger />
            </DialogContent>
          </DialogRoot>
          <DialogRoot role="alertdialog">
            <DialogTrigger asChild>
              <IconButton
                display={
                  loggedinUser &&
                  loggedinUser.username === creatorData.data.username
                    ? "flex"
                    : "none"
                }
                aria-label="Delete task"
                variant="ghost"
                size={"xs"}
                _icon={{ color: useColorModeValue("red.600", "red.200") }}
              >
                <RiDeleteBin2Line />
              </IconButton>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <p>
                  This action cannot be undone. This will permanently delete
                  this task and remove its data from our systems.
                </p>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogActionTrigger>
                <Button
                  colorPalette="red"
                  onClick={() => handleDelete(task._id)}
                >
                  Delete
                </Button>
              </DialogFooter>
              <DialogCloseTrigger />
            </DialogContent>
          </DialogRoot>
          <Box>
            <IconButton
              aria-label="Motivate creator"
              variant="plain"
              size={"xs"}
              _icon={{ color: useColorModeValue("blue.600", "blue.200") }}
              onClick={() => handleUpdate(task._id, {task, user: loggedinUser.username})}
            >
              {task.status === "Completed" ? <PiHandsClapping/> : task.status === "In progress" ? <PiSmileyBold/> : task.status === "Overdue" ? <PiSmileySadBold/> : <PiThumbsUpBold/>}
              {task.reaction.length}
            </IconButton>
          </Box>
        </HStack>
        <HoverCardRoot openDelay={100} closeDelay={100} size={"xm"}>
          <Text as={"span"} fontWeight="bold" fontSize={"6px"} color="gray.500">
            created by{" "}
          </Text>
          <HoverCardTrigger>
            <Text fontWeight="bold" fontSize={"6px"} color="gray.500">
              {creatorData.data.username}
            </Text>
          </HoverCardTrigger>
          <HoverCardContent>
            <HoverCardArrow />
            <Box p={2}>
              <HStack gap={2}>
                {creatorData.success && creatorData.data.github && (
                  <a
                    href={creatorData.data.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub size={20} />
                  </a>
                )}

                {creatorData.success && creatorData.data.linkedin && (
                  <a
                    href={creatorData.data.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedin size={22} />
                  </a>
                )}

                {creatorData.success && creatorData.data.instagram && (
                  <a
                    href={
                      "https://www.instagram.com/" + creatorData.data.instagram
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <AiFillInstagram size={25} />
                  </a>
                )}
                {creatorData.success && creatorData.data.email && (
                  <a
                    href={"mailto:" + creatorData.data.email}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <RiMailFill size={23} />
                  </a>
                )}

                {creatorData.success && creatorData.data.discord && (
                  <a
                    href={
                      "https://discord.com/users/" + creatorData.data.discord
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaDiscord size={23} />
                  </a>
                )}
                {!creatorData.success && <Text>Deleted user</Text>}
              </HStack>
            </Box>
          </HoverCardContent>
        </HoverCardRoot>
      </Box>
    </Box>
  );
};

export default TaskCard;
