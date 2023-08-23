import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { publicActions } from 'viem';
import designTokens from '../../assets/designTokens.json';
import AllAttributes from '../../components/AllAttributes';
import { useAccountStore } from '../../stores/accountStore';
import { useSettingsStore } from '../../stores/settings';

const Home = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ ...styles.container, paddingTop: Math.max(insets.top, 40) }} >
      {/* <BlockNumber /> */}
      {/* <MyAttributes /> */}
      <AllAttributes />
    </View>
  )
}

const BlockNumber = () => {
  const [blockNumber, setBlockNumber] = useState<BigInt>();

  const { getSigner } = useAccountStore();
  const { developerMode } = useSettingsStore();

  useEffect(() => {

    setInterval(() => {
      getSigner(developerMode).extend(publicActions).getBlockNumber().then(setBlockNumber)
    }, 1000);

    // return clearInterval(blockUpdater);
  }, [developerMode])

  return (
    <View style={{
      ...styles.card,
      backgroundColor: designTokens.colors.brown,
      width: '99%',
      marginBottom: 8
    }} >
      <Text style={styles.cardHeading}>{blockNumber?.toLocaleString() || 0}</Text>
      <Text style={styles.cardSubHeading}>{getSigner(developerMode).chain?.name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: designTokens.colors.background.level1,
    color: designTokens.colors.text.primary,
    width: '100%',
    paddingTop: 10,
    paddingHorizontal: 20
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
  },
  hero: {
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  input: {
    height: 40,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: designTokens.colors.text.secondary,
    color: designTokens.colors.text.primary,
    borderRadius: 20,
    padding: 12,
  },
  heading: {
    fontFamily: designTokens.typography.bold,
    color: designTokens.colors.text.primary,
    fontSize: 20
  },
  grid: {
    width: '100%',
    minHeight: '100%'
  },
  card: {
    width: '49%',
    height: 100,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 2,
    borderRadius: 20,
    fontFamily: designTokens.typography.regular,
  },
  cardHeading: {
    fontSize: 20
  },
  cardSubHeading: {
    fontSize: 10,
    color: designTokens.colors.text.inverse,
  }
});

export default Home;