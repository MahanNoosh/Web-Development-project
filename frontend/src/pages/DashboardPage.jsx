import React, { useEffect } from "react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useProfile } from "@/store/profile";
import { useState } from "react";
import { checkPassword } from "@/management/user";
import {
  Container,
  Input,
  Text,
  Box,
  VStack,
  Button,
  Heading,
  Flex,
  useDialog,
} from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
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
import { toaster } from "@/components/ui/toaster";
import { useNavigate } from "react-router-dom";
import { validateContactForm, validatePasswordForm } from "./SignUpPage";
import { Checkbox } from "@/components/ui/checkbox";

const Dashboard = () => {
  const logoutUser = useProfile((state) => state.logoutUser);
  const updateUser = useProfile((state) => state.updateUser);
  const deleteUser = useProfile((state) => state.deleteUser);
  const loggedinUser = useProfile((state) => state.loggedinUser);
  const fetchProfile = useProfile((state) => state.fetchProfile);
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    userid: "",
    password: "",
    email: "",
    instagram: "",
    discord: "",
    linkedin: "",
    github: "",
  });

  useEffect(() => {
    if (loggedinUser) {
      setUserData({
        name: loggedinUser.name ?? "",
        username: loggedinUser.username ?? "",
        userid: loggedinUser.userid,
        password: loggedinUser.password,
        email: loggedinUser.email ?? "",
        instagram: loggedinUser.instagram ?? "",
        discord: loggedinUser.discord ?? "",
        linkedin: loggedinUser.linkedin ?? "",
        github: loggedinUser.github ?? "",
      });
    }
  }, [loggedinUser]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const [tempData, setTempData] = useState({
    confirmPassword: "",
    newPassword: "",
    currentPassword: "",
    termsAccepted: false,
    authorized: false,
  });

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    const { success, message } = await checkPassword({
      password1: tempData.currentPassword,
      password2: userData.password,
    });
    if (success) {
      const { success: deleted, message: DeleteMessage } = await deleteUser(
        loggedinUser._id
      );
      if (deleted) {
        toaster.create({
          title: "Success",
          duration: 3000,
          type: "success",
          description: DeleteMessage,
        });
        navigate("/login");
      } else {
        toaster.create({
          title: "Error",
          duration: 3000,
          type: "error",
          description: DeleteMessage,
        });
      }
    } else {
      toaster.create({
        title: "Error",
        duration: 3000,
        type: "error",
        description: message,
      });
      setTempData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        termsAccepted: false,
        authorized: false,
      });
      return;
    }
    if (!success) {
      toaster.create({
        title: "Error",
        duration: 3000,
        type: "error",
        description: message,
      });
    }
  };

  const handleEdit = async () => {
    if (userData.password === "") {
      userData.password = loggedinUser.password;
      handleEdit();
    }
    if (!validateContactForm(userData, tempData)) return;
    const { success, message } = await updateUser(loggedinUser._id, userData);
    if (success) {
      toaster.create({
        title: "Success",
        duration: 3000,
        type: "success",
        description: message,
      });
      fetchProfile();
    } else {
      toaster.create({
        title: "Error",
        duration: 3000,
        type: "error",
        description: message,
      });
    }
  };

  const changePasswordHelper = async () => {
    if (
      !tempData.currentPassword ||
      !tempData.newPassword ||
      !tempData.confirmPassword
    ) {
      toaster.create({
        title: "Error",
        duration: 3000,
        type: "error",
        description: "All fields are required",
      });
      return;
    }
    const { success, message } = await checkPassword({
      password1: tempData.currentPassword,
      password2: userData.password,
    });

    if (success) {
      if (
        !validatePasswordForm(
          { password: tempData.newPassword },
          { confirmPassword: tempData.confirmPassword }
        )
      ) {
        setTempData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          authorized: false,
        });
        return;
      }
      setTempData({ ...tempData, authorized: true });
    } else {
      toaster.create({
        title: "Error",
        duration: 3000,
        type: "error",
        description: message,
      });
      setTempData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        termsAccepted: false,
        authorized: false,
      });
      return;
    }
  };

  useEffect(() => {
    if (tempData.authorized) {
      handleChangePassword();
      setTempData((prevData) => ({ ...prevData, authorized: false }));
    }
  }, [tempData.authorized]);

  const navigate = useNavigate();
  const handleChangePassword = async () => {
    if (tempData.authorized) {
      const { success, message } = await updateUser(loggedinUser._id, {
        ...userData,
        password: tempData.newPassword,
      });
      if (success) {
        toaster.create({
          title: "Success",
          duration: 3000,
          type: "success",
          description: message,
        });
        navigate("/login");
        await logoutUser();
        fetchProfile(); // Fetch the updated profile to reflect changes in the UI
      } else {
        toaster.create({
          title: "Error",
          duration: 3000,
          type: "error",
          description: message,
        });
      }
    }
    setTempData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      authorized: false,
    });
  };

  return (
    <Container maxW={"xl"} py={12}>
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
            Dashboard
          </Text>
        </Heading>
        <Box
          width={{ base: "300px", sm: "500px", md: "600px" }}
          p={6}
          bg={useColorModeValue("white", "black")}
          rounded={"lg"}
          shadow={"md"}
        >
          <VStack>
            <Input
              disabled={true}
              size={{ base: "md", md: "xl" }}
              name="name"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
            />
            <Input
              disabled={true}
              size={{ base: "md", md: "xl" }}
              name="username"
              value={userData.username}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  username: e.target.value.trim(),
                })
              }
            />
            <Input
              size={{ base: "md", md: "xl" }}
              placeholder="Email Address"
              name="email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value.trim() })
              }
            />
            <OptionalContactInfo
              userData={userData}
              setUserData={setUserData}
            />
            <Checkbox
              size={{ base: "xs", md: "md" }}
              checked={tempData.termsAccepted}
              onCheckedChange={({ checked }) =>
                setTempData({ ...tempData, termsAccepted: checked })
              }
            >
              <Text fontSize={{ base: "10px", md: "13px" }}>
                I confirm the information is accurate and understand the legal
                consequences of providing false details.
              </Text>
            </Checkbox>
            <Button onClick={handleEdit} w={"full"}>
              update
            </Button>
          </VStack>
        </Box>
        <Box
          width={{ base: "300px", sm: "500px", md: "600px" }}
          p={6}
          bg={useColorModeValue("white", "black")}
          rounded={"lg"}
          shadow={"md"}
        >
          <Flex justifyContent={"space-between"}>
            <DialogRoot
              role="alertdialog"
              motionPreset={"slideInBottom"}
              size={"sm"}
            >
              <DialogTrigger asChild>
                <Button variant={"outline"}>Logout</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <p>you will have to login again to access your account</p>
                </DialogBody>
                <DialogFooter>
                  <DialogActionTrigger asChild>
                    <Button>Cancel</Button>
                  </DialogActionTrigger>
                  <Button variant="subtle" onClick={handleLogout}>
                    Logout
                  </Button>
                </DialogFooter>
                <DialogCloseTrigger />
              </DialogContent>
            </DialogRoot>
            <DialogRoot motionPreset={"scale"} size={"sm"}>
              <DialogTrigger asChild>
                <Button variant={"outline"}>change password</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <VStack gap={2}>
                    <PasswordInput
                      size={{ base: "md", md: "xl" }}
                      placeholder="Current Password"
                      name="password"
                      value={tempData.currentPassword}
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          currentPassword: e.target.value.trim(),
                        })
                      }
                    />
                    <PasswordInput
                      size={{ base: "md", md: "xl" }}
                      placeholder="New Password"
                      name="password"
                      value={tempData.newPassword}
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          newPassword: e.target.value.trim(),
                        })
                      }
                    />
                    <Input
                      size={{ base: "md", md: "xl" }}
                      placeholder="Confirm Password"
                      name="password"
                      type="password"
                      value={tempData.confirmPassword}
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          confirmPassword: e.target.value.trim(),
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
                    <Button onClick={changePasswordHelper}>Save</Button>
                  </DialogActionTrigger>
                </DialogFooter>
                <DialogCloseTrigger />
              </DialogContent>
            </DialogRoot>
            <DialogRoot role="alertdialog">
              <DialogTrigger asChild>
                <Button variant={"outline"} colorPalette={"red"}>Delete Acocount</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <VStack gap={5}>
                    <p>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our systems.
                    </p>
                    <PasswordInput
                      size={{ base: "md", md: "xl" }}
                      placeholder="Enter Your Password"
                      name="password"
                      value={tempData.currentPassword}
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          currentPassword: e.target.value.trim(),
                        })
                      }
                    />
                  </VStack>
                </DialogBody>
                <DialogFooter>
                  <DialogActionTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogActionTrigger>
                  <Button onClick={handleDeleteAccount} colorPalette="red">
                    Delete account
                  </Button>
                </DialogFooter>
                <DialogCloseTrigger />
              </DialogContent>
            </DialogRoot>
          </Flex>
        </Box>
      </VStack>
    </Container>
  );
};

const OptionalContactInfo = ({ userData, setUserData }) => {
  return (
    <VStack w={"full"}>
      <Input
        size={{ base: "md", md: "xl" }}
        placeholder="LinkedIn URL"
        name="address"
        value={userData.linkedin}
        onChange={(e) =>
          setUserData({ ...userData, linkedin: e.target.value.trim() })
        }
      />
      <Input
        size={{ base: "md", md: "xl" }}
        placeholder="Github URL"
        name="github"
        value={userData.github}
        onChange={(e) =>
          setUserData({ ...userData, github: e.target.value.trim() })
        }
      />
      <Input
        size={{ base: "md", md: "xl" }}
        placeholder="Discord UserID (Not Username)"
        name="discord"
        value={userData.discord}
        onChange={(e) =>
          setUserData({ ...userData, discord: e.target.value.trim() })
        }
      />
      <Input
        size={{ base: "md", md: "xl" }}
        placeholder="instagram ID"
        name="instagram"
        value={userData.instagram}
        onChange={(e) =>
          setUserData({ ...userData, instagram: e.target.value.trim() })
        }
      />
    </VStack>
  );
};

export default Dashboard;
