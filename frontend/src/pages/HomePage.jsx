import { Container, VStack, Text} from '@chakra-ui/react'
import { useColorModeValue } from '@/components/ui/color-mode'
import { SimpleGrid } from "@chakra-ui/react"
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProductStore } from '@/store/product'
import ProductCard from '@/components/ui/ProductCard'

const HomePage = () => {
  const {fetchProducts, products} = useProductStore()
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts]);
  console.log(products);
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
          Current Products
        </Text>
        <SimpleGrid 
          columns={{base : 1, sm : 2, md : 3, lg : 4}}
          gap={10}
          w={"full"}
        >  
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </SimpleGrid>
        {products.length === 0 && (
          <Text
          fontSize={{ base: "md", sm: "lg" }}
          >
            No product found, {" "}
            <Link to="/create">
              <Text
                as={"span"}
                fontSize={{ base: "md", sm: "lg" }}
                bgGradient={"to-br"}
                gradientFrom = {useColorModeValue("blue.600", "blue.200")}
                gradientTo= {useColorModeValue("cyan.600", "cyan.200")}
                _hover={{textDecoration : "underline", textDecorationColor : useColorModeValue("blue.600", "blue.200")}}
                bgClip={"text"}
              >
                add a product
              </Text>
            </Link>
         </Text>
        )}
      </VStack>
    </Container>
  )
}

export default HomePage