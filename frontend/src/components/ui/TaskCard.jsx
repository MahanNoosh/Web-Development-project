import { RiDeleteBin2Line, RiEditBoxLine, RiMailFill } from "react-icons/ri";
import { FaGithub, FaLinkedin, FaDiscord } from "react-icons/fa";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "@/styles/style.css"

import {
  TbProgressCheck,
  TbProgress,
  TbProgressX,
  TbProgressAlert,
} from "react-icons/tb";
import { HiCheck, HiX } from "react-icons/hi";
import { FcHighPriority, FcLowPriority, FcMediumPriority } from "react-icons/fc";
import {
  PiHandsClapping,
  PiSmileySadBold,
  PiSmileyBold,
  PiThumbsUpBold,
} from "react-icons/pi";
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
  AspectRatio,
  Float,
  Textarea,
} from "@chakra-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuItemCommand,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { useColorModeValue } from "@/components/ui/color-mode";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { useTaskFeed } from "@/store/task";
import { getUser as getCreator } from "/src/management/user";
import { useProfile } from "@/store/profile";
import { useMyTasks } from "@/store/myTask";
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
  const updateUser = useProfile((state) => state.updateUser);
  const bg = useColorModeValue("white", "gray.800");
  const mode = useColorModeValue("light", "dark");
  const [updatedTask, setUpdatedTask] = useState(task);
  const { deleteTask, updateTask } = useTaskFeed();
  const { updateMyTasks } = useMyTasks();
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
    const { success, message,isEmpty, head, tail } = await deleteTask(id);
    if (success) {
      toaster.create({
        title: "Success",
        duration: 2000,
        type: "success",
        description: message,
      });
      if(isEmpty){
        await updateUser(loggedinUser._id, {...loggedinUser, first: null, last: null});
      }else{
        if(head){
          await updateUser(loggedinUser._id, {...loggedinUser, first: head._id});
        }
        if(tail){
          await updateUser(loggedinUser._id, {...loggedinUser, last: tail._id});
        }
      }
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
    const { success, message, task } = await updateTask(id, updatedtask);
    if (success) {
      toaster.create({
        title: "Success",
        duration: 2000,
        type: "success",
        description: message,
      });
      console.log(task);
      await updateMyTasks(task);
    } else {
      toaster.create({
        title: "Error",
        duration: 2000,
        type: "error",
        description: message,
      });
    }
  };
  return (
    <Box
      shadow="lg"
      rounded="lg"
      h={
        task.image
          ? { base: "350px", md: "425px", lg: "500px", xl: "600px" }
          : { base: "175px", md: "200px", lg: "225px", xl: "250px" }
      }
      w={{ base: "300px", md: "400px", lg: "500px", xl: "600px" }}
      overflow="hidden"
      position={"relative"}
      transition="all 0.3s"
      _hover={{ transform: "Scale(1.05)" }}
      bg={bg}
    >
      {task.image && (
        <AspectRatio ratio={16 / 9}>
          <Image
            src={task.image}
            alt={task.name}
            objectFit={"cover"}
            mx="auto"
            borderRadius={"lg"}
          />
        </AspectRatio>
      )}
      <Box p="5">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading
            as="h3"
            size={{ base: "md", md: "lg", lg: "xl" }}
            textAlign="left"
            bgGradient="to-br"
            gradientFrom={useColorModeValue("red.500", "red.200")}
            gradientTo={useColorModeValue("yellow.500", "yellow.200")}
            bgClip={"text"}
          >
            {task.name}
          </Heading>
          <Badge
            variant="subtle"
            size={"xs"}
            colorPalette={
              task.status === "Completed"
                ? "green"
                : task.status === "In progress"
                ? "orange"
                : task.status === "Overdue"
                ? "red"
                : "blue"
            }
          >
            {task.status === "Completed" ? (
              <TbProgressCheck size={12} />
            ) : task.status === "In progress" ? (
              <TbProgress size={12} />
            ) : task.status === "Overdue" ? (
              <TbProgressX size={12} />
            ) : (
              <TbProgressAlert size={12} />
            )}
            <Text fontSize={"9px"}>{task.status}</Text>
          </Badge>
        </Flex>
        <Text
          mt={2}
          fontSize={{
            base: "8px",
            sm: "10px",
            md: "12px",
            lg: "14px",
            xl: "16px",
          }}
          color="gray.500"
          textAlign="left"
        >
          {task.description}
        </Text>
        <div className={"description-blocker--"+mode}/>
        <Float placement={"bottom-start"} offsetX={10} offsetY={9}>
          <IconButton
            aria-label="Motivate creator"
            variant=""
            size={"xs"}
            _icon={{ color: useColorModeValue("blue.600", "blue.200") }}
            onClick={() =>
              handleUpdate(task._id, { updatedTask, user: loggedinUser.userid })
            }
          >
            {task.status === "Completed" ? (
              <PiHandsClapping />
            ) : task.status === "In progress" ? (
              <PiSmileyBold />
            ) : task.status === "Overdue" ? (
              <PiSmileySadBold />
            ) : (
              <PiThumbsUpBold />
            )}
            {task.reaction && task.reaction.length}
          </IconButton>
        </Float>
        <Float placement={"bottom-end"} offsetX={8} offsetY={10}>
          <HStack gap={0}>
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
                  variant="plain"
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
                    <Textarea
                    resize= "none"
                    placeholder="Description"
                    name="description"
                    size="sm"
                    value={updatedTask.description}
                    onChange={(e) =>
                      setUpdatedTask({
                        ...updatedTask,
                        description: e.target.value.replace(/\n/g, ""),
                      })
                    }
                    />
                    <Flex w={"full"} gap={2} justifyContent={"space-between"}>
                    <div className={"border--"+mode}>
                    <HStack gap={0}>
                      <Text
                        pl={2}
                        color="gray.500"
                      >
                        Deadline:
                      </Text>
                     <DatePicker className={"custom-datepicker--"+mode} selected={new Date(updatedTask.deadline)} onChange={(date) => setUpdatedTask({...updatedTask, deadline: new Date(date)})} showTimeSelect dateFormat="dd-MMM yyyy 'at' HH:mm" />
                      </HStack>
                    </div >
                    <div className={"border--"+mode}>
                    <HStack gap={0}>
                      <Text
                        pl={2}
                        color="gray.500"
                      >
                        Priority:
                      </Text>
                    <MenuRoot onFocusOutside={() => setOpen(false)}>
                      <MenuTrigger >
                        <Button
                          variant="plain"
                          colorPalette={
                            updatedTask.priority === "High"
                              ? "red"
                              : updatedTask.priority === "Medium"
                              ? "yellow"
                              : "green"
                          }
                        >
                          {updatedTask.priority === "High" ? (
                            <FcHighPriority size={12}/>
                          ) : updatedTask.priority === "Medium" ? (
                            <FcMediumPriority size={12} />
                          ):(
                            <FcLowPriority size={12} />
                          )
                          }{" "}
                          {updatedTask.priority}
                        </Button>
                        </MenuTrigger>
                      <MenuContent zIndex="max">
                        <MenuItem value="High" onClick={() => setUpdatedTask({ ...updatedTask, priority: "High" })}>
                          High
                        </MenuItem>
                        <MenuItem value="Medium" onClick={() => setUpdatedTask({ ...updatedTask, priority: "Medium" })}>
                          Medium
                        </MenuItem>
                        <MenuItem value="Low" onClick={() => setUpdatedTask({ ...updatedTask, priority: "Low" })}>
                          Low
                        </MenuItem>
                      </MenuContent>
                    </MenuRoot>
                    </HStack>
                    </div>
                    </Flex>
                    <Flex w={"full"} gap={2} justifyContent={"space-between"}>
                    <Input
                      placeholder="Time needed (in minutes)"
                      type="number"
                      name="tags"
                      value={updatedTask.duration}
                    />
                    <div className={"border--"+mode}>
                    <HStack gap={0}>
                      <Text
                        pl={2}
                        color="gray.500"
                      >
                        Status:
                      </Text>
                    <MenuRoot onFocusOutside={() => setOpen(false)}>
                      <MenuTrigger asChild>
                        <Button
                          variant="plain"
                          colorPalette={
                            updatedTask.status === "Completed"
                              ? "green"
                              : updatedTask.status === "In progress"
                              ? "orange"
                              : updatedTask.status === "Overdue"
                              ? "red"
                              : "blue"
                          }
                        >
                          {updatedTask.status === "Completed" ? (
                            <TbProgressCheck size={12} />
                          ) : updatedTask.status === "In progress" ? (
                            <TbProgress size={12} />
                          ) : updatedTask.status === "Overdue" ? (
                            <TbProgressX size={12} />
                          ) : (
                            <TbProgressAlert size={12} />
                          )}{" "}
                          {updatedTask.status}
                        </Button>
                      </MenuTrigger>
                      <MenuContent zIndex="max">
                        <MenuItem value="Not started" onClick={() => setUpdatedTask({ ...updatedTask, status: "Not started" })}>
                          Not started
                        </MenuItem>
                        <MenuItem value="In progress" onClick={() => setUpdatedTask({ ...updatedTask, status: "In progress" })}>
                          In progress
                        </MenuItem>
                        <MenuItem value="Completed" onClick={() => setUpdatedTask({ ...updatedTask, status: "Completed" })}>
                          Completed
                        </MenuItem>
                        <MenuItem value="Overdue" onClick={() => setUpdatedTask({ ...updatedTask, status: "Overdue" })}>
                          Overdue
                        </MenuItem>
                      </MenuContent>
                    </MenuRoot>
                    </HStack>
                    </div>
                    </Flex>
                    <Switch
                      size={{ base: "sm", md: "md" }}
                      checked={updatedTask.isPublic}
                      trackLabel={{
                        //on: <LuEye color="black"/>,
                        off: <HiX color="white" size={13} />,
                      }}
                      thumbLabel={{
                        on: <HiCheck color="white" size={13} />,
                        //off: <LuEyeOff color="black" />,
                      }}
                      onCheckedChange={({ checked }) => {
                        setUpdatedTask({ ...updatedTask, isPublic: checked });
                      }}
                    >
                      <Text>Share On Home Page</Text>
                    </Switch>
                  </VStack>
                </DialogBody>
                <DialogFooter>
                  <DialogActionTrigger asChild>
                    <Button variant="outline" onClick={() => setUpdatedTask( task )}>Cancel</Button>
                  </DialogActionTrigger>
                  <DialogActionTrigger asChild>
                    <Button
                      onClick={() =>
                        handleUpdate(task._id, {
                          task: updatedTask,
                          user: null,
                        })
                      }
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
                  variant="plain"
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
          </HStack>
        </Float>
        <Float placement={"bottom-end"} offsetX={8} offsetY={4}>
          <HoverCardRoot
            openDelay={100}
            closeDelay={100}
            size={"xm"}
            positioning={{ placement: "top" }}
          >
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
                        "https://www.instagram.com/" +
                        creatorData.data.instagram
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
        </Float>
      </Box>
    </Box>
  );
};

export default TaskCard;
