import { useColorModeValue } from '@/components/ui/color-mode'
import { toaster } from "@/components/ui/toaster"
import { useProductStore } from '@/store/product'
import { Box, Container, Heading, VStack, Input, Text, Button } from '@chakra-ui/react'
import { useState } from 'react'

const CreatePage = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
  })
  const {createProduct} =useProductStore()
  const handleAddProduct = async() => {
    const {success, message} = await createProduct(newProduct)
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
    setNewProduct({
      name: "",
      price: "",
      image: "",
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
            Create A New Product
          </Text>
        </Heading>
        <Box w={"full"} p={6} bg = {useColorModeValue("white", "black")} rounded={"lg"} shadow={"md"}> 
          <VStack spacing = {4}>
            <Input 
                placeholder='Product Name' 
                name='name'
                value={newProduct.name} 
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            />
            <Input 
                placeholder='Price' 
                name='price'
                type='number'
                value={newProduct.price} 
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
            />
            <Input 
                placeholder='Image URL' 
                name='image'
                value={newProduct.image} 
                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
            />
            <Button 
              colorScheme={useColorModeValue("white", "black")}
              onClick={handleAddProduct}
              w = {"full"}
            >
              Add Product
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}
export default CreatePage