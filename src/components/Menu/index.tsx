import { FlatList } from 'react-native';
import { Text } from '../Text';

import { useState } from 'react';
import { ProductContainer, ProductImage , ProductDetails, Separator, AddToCartButton } from './styles';
import { formatCurrency } from '../../utils/formatCurrency';
import { PlusCircle } from '../Icons/PlusCircle';
import { ProductModal } from '../Modal/ProductModal/ProductModal';
import { Product } from '../../types/product';


interface MenuProps {
  onAddToCart: (product: Product) => void;
  products: Product[];
}


export function Menu({ onAddToCart, products }: MenuProps) {

  const [isModalVisble, setisModalVisble] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<null | Product>(null);

  function handleOpenModal(product: Product) {
    setisModalVisble(true);
    setSelectedProduct(product);
  }

  return (
    <>

      <ProductModal
        visible={isModalVisble}
        onClose={() => setisModalVisble(false)}
        product={selectedProduct}
        onAddToCart={onAddToCart}
      />

      <FlatList
        data={products}
        style={{marginTop: 32}}
        contentContainerStyle= {{ paddingHorizontal: 24 }}
        keyExtractor={product => product._id}
        ItemSeparatorComponent={ Separator }
        renderItem={({item: product}) => (
          <ProductContainer onPress={() => handleOpenModal(product)}>
            <ProductImage
              source={{
                uri: `http://192.168.0.2:3001/uploads/${product.imagePath}`,
              }}/>
            <ProductDetails>
              <Text weight="600" >{product.name}</Text>
              <Text size={14} color="#666" style={{ marginVertical: 8 }} >{product.description}</Text>
              <Text size={14} weight="600" color="#333">{formatCurrency(product.price)}</Text>
            </ProductDetails>

            <AddToCartButton onPress={() => onAddToCart(product)}>
              <PlusCircle/>
            </AddToCartButton>

          </ProductContainer>
        )}/>

    </>
  );
}
