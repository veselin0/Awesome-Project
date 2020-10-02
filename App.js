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
  const {
    text,
    setText,
    list,
    listRef,
    saveItem,
    deleteItem,
    clearAll,
  } = useListState();

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
        data={list}
        renderItem={({item, index}) => (
          <Text style={styles.item}>
            {index + 1}: {item.text}
          </Text>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button style={styles.button} title="Add Item" onPress={saveItem} />
      <Button style={styles.button} title="Delete Item" onPress={deleteItem} />
      <Button style={styles.button} title="Clear All" onPress={clearAll} />
    </View>
  );
};

const useListState = () => {
  const [list, setList] = useState([]);
  const [text, setText] = useState('');
  const listRef = useRef();

  const saveList = useCallback(async (newList) => {
    setList(newList);
    setText('');
    listRef.current.scrollToEnd();
    await saveToStorage(newList);
  }, []);

  /**
   * Save cuurrently entered text as a new item
   */
  const saveItem = useCallback(() => {
    const newList = list.concat([{text}]);
    saveList(newList);
  }, [list, saveList, text]);

  /**
   * Delete an item from the list and save the entire list again
   */
  const deleteItem = useCallback(
    (itemToRemove) => {
      const newList = list.filter((item) => item !== itemToRemove);
      saveList(newList);
    },
    [list, saveList],
  );

  // const clearItems = useCallback(() => {
  //   // Code to clear storage and remove this comment
  // }, []);

  const clearAll = async () => {
    try {
      saveList();
    } catch (e) {
      // clear error
    }
  };

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
      setList(items);
    };
    readInitialItemsFromStorage();
  }, []);

  return {
    list,
    saveItem,
    deleteItem,
    clearAll,
    text,
    setText,
    listRef,
  };
};

const saveToStorage = (list) => {
  const jsonValue = JSON.stringify(list);
  return AsyncStorage.setItem(STORAGE_KEY, jsonValue);
};

const STORAGE_KEY = '@the_storage';

export default FlatListBasics;
