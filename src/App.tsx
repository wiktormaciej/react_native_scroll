import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import InfiniteScroll from './InfiniteScroll';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <InfiniteScroll />
      </SafeAreaView>
    </>
  );
};

export default App;
