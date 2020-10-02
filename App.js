import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const ITEM_HEIGHT = 44;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  list: {
    flex: 1,
  },
  item: {
    padding: 10,
    fontSize: 18,
    lineHeight: 18,
    height: ITEM_HEIGHT,
    borderColor: 'red',
    borderWidth: 1,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: 'black',
    height: ITEM_HEIGHT,
  },
  button: {
    height: ITEM_HEIGHT,
  },
});

const FlatListBasics = () => {
  const {text, setText, data, listRef, saveItem} = useListState();

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type here!"
      />
      <FlatList
        style={styles.list}
        ref={listRef}
        data={data}
        renderItem={({item, index}) => (
          <Text style={styles.item}>
            {index + 1}: {item.text}
          </Text>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button style={styles.button} title="Add Item" onPress={saveItem} />
    </View>
  );
};

const useListState = () => {
  const [data, setData] = useState([]);
  const [text, setText] = useState('');
  const listRef = useRef();

  /**
   * Save cuurrently entered text as a new item
   */
  const saveItem = useCallback(async () => {
    const newData = data.concat([{text}]);
    setData(newData);
    setText('');
    listRef.current.scrollToEnd();
    const jsonValue = JSON.stringify(newData);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  }, [data, text]);

  /**
   * Effect runing one time (initially) to read previosly stored data
   */
  useEffect(() => {
    const readInitialItemsFromStorage = async () => {
      let items = [];
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue) {
        items = JSON.parse(jsonValue);
      }
      setData(items);
    };
    readInitialItemsFromStorage();
  }, []);

  return {
    data,
    saveItem,
    text,
    setText,
    listRef,
  };
};

const STORAGE_KEY = '@the_storage';

export default FlatListBasics;
