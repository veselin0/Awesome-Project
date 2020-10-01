import React, {useState, useRef, useEffect} from 'react';
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
  const {text, setText, listRef, data, setData} = useListState();

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
            {index + 1}: {item.key}
          </Text>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button
        style={styles.button}
        title="Add Item"
        onPress={() => {
          setData([...data, {key: text}]);
          listRef.current.scrollToEnd();
        }}
      />
    </View>
  );
};

const useListState = () => {
  const [data, setData] = useState([]);
  const [text, setText] = useState('');
  const listRef = useRef();

  /*
    Use AsyncStorage setItem and getItem to read and write local changes
    to phone memory in the effect hook bellow

    const storedItems = await AsyncStorage ...
    console.log({ storedItems });
    setData(storedItems || []);
   */
  AsyncStorage.getItem('LIST_DATA');

  useEffect(() => {
    const readStoredItems = async () => {};
    readStoredItems();
  }, []);

  return {
    data,
    setData,
    text,
    setText,
    listRef,
  };
};

export default FlatListBasics;
