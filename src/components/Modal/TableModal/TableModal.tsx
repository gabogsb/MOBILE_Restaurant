import { useState } from 'react';
import { Modal, TouchableOpacity, Platform } from 'react-native';
import { Button } from '../../Button';
import { Close } from '../../Icons/Close';
import { Text } from '../../Text';

import { Overlay, ModalBody, ModalHeader, ModalForm, Input } from './styles';

interface TableModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (table: string) => void;
}

export function TableModal({ visible, onClose, onSave }: TableModalProps) {

  const [Table, setTable] = useState('');

  function handleSave() {
    setTable('');
    onSave(Table);
    onClose();
  }

  return (

    <Modal
      visible={visible}
      transparent
      animationType='fade'
    >
      <Overlay behavior={Platform.OS === 'android' ? 'height' : 'padding'}>
        <ModalBody>
          <ModalHeader>
            <Text weight="600">Informe a mesa</Text>

            <TouchableOpacity onPress={onClose}>
              <Close
                color="#666"
              />
            </TouchableOpacity>
          </ModalHeader>
          <ModalForm>
            <Input
              placeholder='Numero da mesa'
              placeholderTextColor="#666"
              keyboardType='number-pad'
              onChangeText={value => setTable(value)}
            />
            <Button onPress={handleSave} disabled={Table.length === 0}>
              Salvar
            </Button>
          </ModalForm>
        </ModalBody>
      </Overlay>
    </Modal>

  );

}
