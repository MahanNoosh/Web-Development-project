import React from "react";
import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Input,
  Text,
  VStack,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { PasswordInput } from "@/components/ui/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";
import { createUser } from "@/management/user";
import { useNavigate } from "react-router-dom";

const Signup = () => {
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
    first: null,
    last: null,
  });
  const [tempData, setTempData] = useState({
    confirmPassword: "",
    termsAccepted: false,
    hasMoreInfo: false,
  });

  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!validatePasswordForm(userData, tempData)) return;
    if (!validateContactForm(userData, tempData)) return;
    const { success, message } = await createUser(userData);
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
    resetForm();
    navigate("/login");
  };

  function resetForm() {
    setUserData({
      name: "",
      username: "",
      userid: "",
      password: "",
      email: "",
      discord: "",
      linkedin: "",
      github: "",
      instagram: "",
      first: null,
      last: null,
    });
    setTempData({
      confirmPassword: "",
      termsAccepted: false,
    });
  }

  return (
    <Container maxW={{ base: "sm", md: "lg" }} py={12}>
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
        <Box
          w={"full"}
          p={6}
          bg={useColorModeValue("white", "black")}
          rounded={"lg"}
          shadow={"md"}
        >
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
  );
};

const SignupForm = ({
  userData,
  setUserData,
  tempData,
  setTempData,
  handleSignUp,
}) => {
  return (
    <VStack>
      <Input
        size={{ base: "md", md: "xl" }}
        placeholder="Full Name"
        name="name"
        value={userData.name}
        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
      />
      <Input
        size={{ base: "md", md: "xl" }}
        placeholder="Username"
        name="username"
        value={userData.username}
        onChange={(e) =>
          setUserData({
            ...userData,
            username: e.target.value.trim(),
            userid: e.target.value.trim(),
          })
        }
      />
      <PasswordInput
        size={{ base: "md", md: "xl" }}
        placeholder="Password"
        name="password"
        value={userData.password}
        onChange={(e) =>
          setUserData({ ...userData, password: e.target.value.trim() })
        }
      />
      <Input
        size={{ base: "md", md: "xl" }}
        placeholder="Confirm Password"
        name="password"
        type="password"
        value={tempData.confirmPassword}
        onChange={(e) =>
          setTempData({ ...tempData, confirmPassword: e.target.value.trim() })
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
      <Switch
        size={{ base: "xs", md: "md" }}
        checked={tempData.hasMoreInfo}
        onCheckedChange={({ checked }) => {
          setTempData({ ...tempData, hasMoreInfo: checked });
          if (!checked) {
            setUserData((prevData) => ({
              ...prevData,
              discord: "",
              linkedin: "",
              github: "",
              instagram: "",
            }));
          }
        }}
      >
        <Text fontSize={{ base: "xs", md: "md" }} color={"gray.500"}>
          Optional details
        </Text>
      </Switch>
      {tempData.hasMoreInfo && (
        <OptionalContactInfo userData={userData} setUserData={setUserData} />
      )}
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
      <Button onClick={handleSignUp} w={"full"}>
        Sign Up
      </Button>
    </VStack>
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
        placeholder="Instagram ID"
        name="instagram"
        value={userData.instagram}
        onChange={(e) =>
          setUserData({ ...userData, instagram: e.target.value.trim() })
        }
      />
    </VStack>
  );
};

export const validateContactForm = (userData, tempData) => {
  if (!tempData.termsAccepted) {
    showError("You must agree to the terms and conditions");
    return false;
  }
  if (!validateName(userData.name)) {
    showError("Invalid name");
    return false;
  }
  if (!validateUsername(userData.username)) {
    showError("Invalid username");
    return false;
  }

  if (!validateEmail(userData.email)) {
    showError("Invalid email");
    return false;
  }
  if (userData.discord && !validateDiscord(userData.discord)) {
    showError("Invalid discord User ID");
    return false;
  }
  if (userData.linkedin && !validateLinkedin(userData.linkedin)) {
    showError("Invalid linkedin URL");
    return false;
  }
  if (userData.github && !validateGithub(userData.github)) {
    showError("Invalid github URL");
    return false;
  }
  if (userData.instagram && !validateInstagram(userData.instagram)) {
    showError("Invalid instagram ID");
    return false;
  }
  return true;
};

export const validatePasswordForm = (userData, tempData) => {
  if (userData.password !== tempData.confirmPassword) {
    showError("Passwords do not match");
    return false;
  }
  if (!validatePassword(userData.password)) {
    showError(
      "Invalid password format (at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character)"
    );
    return false;
  }
  return true;
};

const showError = (description) => {
  toaster.create({
    title: "Error",
    duration: 5000,
    type: "error",
    description,
  });
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
  const re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;
  return re.test(String(password));
}

function validateUsername(username) {
  const re = /^[a-zA-Z0-9]{6,50}$/;
  return re.test(String(username));
}

function validateName(name) {
  const re = /^[a-zA-Z ]+$/;
  return re.test(String(name));
}

function validateDiscord(discord) {
  const re = /^[0-9]+$/;
  return re.test(String(discord));
}
function validateInstagram(instagram) {
  const re = /^[a-zA-Z0-9_-]+$/;
  return re.test(String(instagram));
}

function validateLinkedin(linkedin) {
  const re = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/;
  return re.test(String(linkedin));
}

function validateGithub(github) {
  const re = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+$/;
  return re.test(String(github));
}

export default Signup;
