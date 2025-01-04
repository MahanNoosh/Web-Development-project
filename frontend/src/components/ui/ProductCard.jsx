import { RiDeleteBin2Line } from "react-icons/ri";
import { RiEditBoxLine } from "react-icons/ri";
import { toaster } from "./toaster";
import { Box, Heading, HStack, IconButton, Image, Text, Button, Input, VStack } from "@chakra-ui/react"
import { useColorModeValue } from '@/components/ui/color-mode'
import { useState } from "react";
import { useProductStore } from "@/store/product";
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
} from "@/components/ui/dialog"

const ProductCard = ({product}) => {
    const textColor = useColorModeValue("gray.800", "gray.200")
    const bg = useColorModeValue("white", "gray.800")
    const [updatedProduct, setUpdatedProduct] = useState(product)
    const {deleteProduct, updateProduct} = useProductStore()
    const handleDelete = async(id) => {
        const {success, message} = await deleteProduct(id)
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
    }
    const handleUpdate = async(id, updatedProduct) => {
        const {success, message} = await updateProduct(id, updatedProduct)
        if (success) {
            toaster.create({
                title: "Success",
                duration: 2000,
                type: "success",
                description: "Product updated successfully"
            })
        }
        else {
            toaster.create({
                title: "Error",
                duration: 2000,
                type: "error",
                description: "Error updating product"
            })
        }
    }
    return (
        <Box
            shadow="lg"
            rounded="lg"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{ transform: "Scale(1.05)" }}
            bg={bg}
        >
            <Image src={product.image} alt={product.name} h="48" w="full" objectFit={"cover"} mx="auto" borderRadius={"lg"}/>
            <Box p="4">
                <Heading 
                    as='h3' 
                    size={"xl"} 
                    mb={2} 
                    textAlign="left"
                    bgGradient="to-br" 
                    gradientFrom = {useColorModeValue("red.500", "red.200")}
                    gradientTo= {useColorModeValue("yellow.500", "yellow.200")}
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
                    gradientFrom = {useColorModeValue("blue.600", "blue.200")}
                    gradientTo= {useColorModeValue("purple.600", "purple.200")}
                    bgClip={"text"}
                >
                    {product.price}
                </Text>
                <HStack gap={1} justifyContent="flex-start">
                    <DialogRoot motionPreset={"scale"} size={"sm"}>
                        <DialogTrigger asChild>
                            <IconButton
                                aria-label="Edit product"
                                variant="ghost"
                                size={"xs"}
                                _icon={{color: useColorModeValue("blue.600", "blue.200")}}
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
                                    placeholder='Product Name' 
                                    name='name'
                                    value={updatedProduct.name}
                                    onChange={(e) => setUpdatedProduct({...updatedProduct, name: e.target.value})}
                                />
                                <Input 
                                    placeholder='Price' 
                                    name='price'
                                    type='number'
                                    value={updatedProduct.price}
                                    onChange={(e) => setUpdatedProduct({...updatedProduct, price: e.target.value})}
                                />
                                <Input 
                                    placeholder='Image URL' 
                                    name='image'
                                    value={updatedProduct.image}
                                    onChange={(e) => setUpdatedProduct({...updatedProduct, image: e.target.value})}
                                />
                            </VStack>
                            </DialogBody>
                            <DialogFooter>
                                <DialogActionTrigger asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogActionTrigger>
                                <DialogActionTrigger asChild>
                                    <Button
                                        onClick={()=>handleUpdate(product._id, updatedProduct)}
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
                                aria-label="Delete product"
                                variant="ghost"
                                size={"xs"}
                                _icon={{color: useColorModeValue("red.600", "red.200")}}
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
                                    This action cannot be undone. This will permanently delete this product 
                                    and remove its data from our systems.
                                </p>
                            </DialogBody>
                            <DialogFooter>
                            <DialogActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogActionTrigger>
                            <Button 
                                colorPalette="red"
                                onClick={()=>handleDelete(product._id)}
                            >
                                Delete
                            </Button>
                            </DialogFooter>
                            <DialogCloseTrigger />
                        </DialogContent>
                    </DialogRoot>
                </HStack>
            </Box>
        </Box>
    )
}

export default ProductCard;