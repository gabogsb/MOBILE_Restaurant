import { useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { MinusCircle } from '../../Icons/MinusCircle';
import { PlusCircle } from '../../Icons/PlusCircle';
import { CartItem } from '../../types/CartItem';
import { Product } from '../../types/product';
import { api } from '../../utils/api';
import { formatCurrency } from '../../utils/formatCurrency';
import { Button } from '../Button';
import { ConfirmedModal } from '../Modal/ConfirmedModal/ConfirmedModal copy';
import { Text } from '../Text';

import { Item, ProductContainer, Actions, Image, QuantityContainer, ProductDetails, Summary, TotalContainer } from './styles';

interface CartProps {
  cartItems: CartItem[];
  onAdd: (product: Product) => void;
  onDecrement: (product: Product) => void;
  onConfirmOrder: () => void;
  selectedTable: string;
}

export function Cart({ cartItems, onAdd, onDecrement, onConfirmOrder, selectedTable }: CartProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);


  const total = cartItems.reduce(( acc, cartItem ) => {
    return acc + cartItem.quantity * cartItem.product.price;
  },0);

  async function handleConfirmOrder() {

    // const payload = {
    //   table: selectedTable,
    //   products: cartItems.map((cartItem) => ({
    //     product: cartItem.product._id,
    //     quantity: cartItem.quantity,
    //   }))
    // };
    setIsLoading(true);
    await api.post('/orders', {
      table: selectedTable,
      products: cartItems.map((cartItem) => ({
        product: cartItem.product._id,
        quantity: cartItem.quantity,
      })),
    });

    setIsLoading(false);

    setIsModalVisible(true);
  }

  function handleOk() {
    onConfirmOrder();
    setIsModalVisible(false);
  }

  return (
    <>

      <ConfirmedModal
        visible={isModalVisible}
        onOk={handleOk}
      />

      {cartItems.length > 0 && (
        <FlatList
          style={{marginBottom: 10, maxHeight: 150}}
          data={cartItems}
          keyExtractor={cartItem => cartItem.product._id}
          showsVerticalScrollIndicator={false}
          renderItem={({item: cartItem}) => (
            <Item>
              <ProductContainer>
                <Image
                  source={{
                    uri: `http://192.168.0.2:3001/uploads/${cartItem.product.imagePath}`
                  }}
                />

                <QuantityContainer>
                  <Text size={14} color='#666'>{cartItem.quantity}x</Text>
                </QuantityContainer>

                <ProductDetails>
                  <Text weight='600' size={14}>{cartItem.product.name}</Text>
                  <Text size={14} color='#666' style={{marginTop: 4}}>{formatCurrency(cartItem.product.price)}</Text>
                </ProductDetails>
              </ProductContainer>
              <Actions>
                <TouchableOpacity
                  style={{marginRight: 24}}
                  onPress={() => onAdd(cartItem.product)}
                >
                  <PlusCircle/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDecrement(cartItem.product)}>
                  <MinusCircle/>
                </TouchableOpacity>
              </Actions>
            </Item>
          )}
        />
      )}
      <Summary>
        <TotalContainer>
          {cartItems.length > 0 ? (
            <>
              <Text color='#666'>Total</Text>
              <Text size={18} weight='600'>{formatCurrency(total)}</Text>
            </>
          ) : (
            <Text color='#999'>Seu carrinho esta vazio</Text>
          )}
        </TotalContainer>

        <Button onPress={handleConfirmOrder} disabled={cartItems.length === 0} loading={isLoading}>
          Confirmar Pedido
        </Button>
      </Summary>
    </>
  );
}
