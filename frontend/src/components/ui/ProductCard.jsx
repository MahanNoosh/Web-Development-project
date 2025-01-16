import { RiDeleteBin2Line, RiEditBoxLine, RiMailFill } from "react-icons/ri";
import { FaGithub, FaLinkedin, FaDiscord } from "react-icons/fa";
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
} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useState, useEffect } from "react";
import { useProductStore } from "@/store/product";
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

const ProductCard = ({ product }) => {
  const noImage =
    "https://thumb.ac-illust.com/b1/b170870007dfa419295d949814474ab2_t.jpeg";
  const loggedinUser = useProfile((state) => state.loggedinUser);
  const textColor = useColorModeValue("gray.800", "gray.200");
  const bg = useColorModeValue("white", "gray.800");
  const [updatedProduct, setUpdatedProduct] = useState(product);
  const { deleteProduct, updateProduct } = useProductStore();
  const [creatorData, setUser] = useState({
    success: false,
    data: {},
  });

  useEffect(() => {
    const fetchCreator = async () => {
      const data = await getCreator(product.creator);
      setUser(data);
    };
    fetchCreator();
  }, [product.creator]);

  const handleDelete = async (id) => {
    const { success, message } = await deleteProduct(id);
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
  const handleUpdate = async (id, updatedProduct) => {
    const { success, message } = await updateProduct(id, updatedProduct);
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
  return (
    <Box
      shadow="lg"
      rounded="lg"
      h={"500px"}
      w={"500px"}
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: "Scale(1.05)" }}
      bg={bg}
    >
      <Image
        src={product.image}
        alt={noImage}
        h="50%"
        w="full"
        objectFit={"cover"}
        mx="auto"
        borderRadius={"lg"}
      />
      <Box p="4">
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
          {product.name}
        </Heading>
        <Text
          fontWeight="bold"
          fontSize={"sm"}
          color={textColor}
          mb={4}
          textAlign="left"
          bgGradient={"to-b"}
          gradientFrom={useColorModeValue("blue.600", "blue.200")}
          gradientTo={useColorModeValue("purple.600", "purple.200")}
          bgClip={"text"}
        >
          {product.price}
        </Text>
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
                aria-label="Edit product"
                variant="ghost"
                size={"xs"}
                _icon={{ color: useColorModeValue("blue.600", "blue.200") }}
              >
                <RiEditBoxLine />
              </IconButton>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Product</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <VStack gap={2}>
                  <Input
                    placeholder="Product Name"
                    name="name"
                    value={updatedProduct.name}
                    onChange={(e) =>
                      setUpdatedProduct({
                        ...updatedProduct,
                        name: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Price"
                    name="price"
                    type="number"
                    value={updatedProduct.price}
                    onChange={(e) =>
                      setUpdatedProduct({
                        ...updatedProduct,
                        price: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Image URL"
                    name="image"
                    value={updatedProduct.image}
                    onChange={(e) =>
                      setUpdatedProduct({
                        ...updatedProduct,
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
                    onClick={() => handleUpdate(product._id, updatedProduct)}
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
                aria-label="Delete product"
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
                  this product and remove its data from our systems.
                </p>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogActionTrigger>
                <Button
                  colorPalette="red"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </Button>
              </DialogFooter>
              <DialogCloseTrigger />
            </DialogContent>
          </DialogRoot>
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

export default ProductCard;
