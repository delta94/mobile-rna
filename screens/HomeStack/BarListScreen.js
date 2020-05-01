import {default as React, useState, useEffect} from 'react'
import {
  StyleSheet,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Slider,
  Dimensions,
} from 'react-native'
import {Layout, Text, Icon, Spinner, List} from '@ui-kitten/components'

import {default as theme} from '../../constants/Theme'
import {useQuery} from 'react-query'
import {searchForBars} from '../../actions/bars'

export default function BarListScreen({route, navigation}) {
  const {query} = route.params

  const [distance, setDistance] = useState(1)
  const [searchDistance, setSearchDistance] = useState(1)

  const [tags, setTags] = useState(query)
  const {error, status, data: bars} = useQuery(
    ['bars', tags, searchDistance],
    searchForBars,
  )

  useEffect(() => {
    setTags(query)
  }, [query])

  if (status === 'error') {
    throw error
  }

  const handleTagPress = removedTag => {
    if (tags.length > 1) {
      setTags(current => current.filter(tag => tag !== removedTag))
    } else {
      navigation.goBack()
    }
  }

  return (
    <Layout style={styles.container}>
      <Layout style={styles.search}>
        <View style={styles.sliderContainer}>
          <Text category="label">Distance</Text>
          <Slider
            style={{width: 200, height: 40}}
            minimumTrackTintColor={theme['color-primary-300']}
            maximumTrackTintColor="#000000"
            thumbTintColor={theme['color-primary-500']}
            minimumValue={0.5}
            maximumValue={25}
            step={0.5}
            value={distance}
            onValueChange={setDistance}
            onSlidingComplete={setSearchDistance}
          />
          <Text category="label">{distance} Km</Text>
        </View>
        <View style={styles.tagContainer}>
          {tags.map(tag => (
            <TouchableHighlight
              key={tag}
              style={styles.tag}
              underlayColor={theme['color-primary-200']}
              onPress={() => handleTagPress(tag)}
            >
              <>
                <Text style={styles.lightText}>{tag}</Text>
                <Icon
                  name="close-circle-outline"
                  fill={theme['color-primary-200']}
                  style={styles.closeIcon}
                />
              </>
            </TouchableHighlight>
          ))}
        </View>
      </Layout>
      {status === 'loading' ? (
        <Spinner status="primary" size="giant" />
      ) : (
        <List data={bars} renderItem={BarCard} />
      )}
    </Layout>
  )
}

BarListScreen.navigationOptions = {
  header: null,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: theme['color-basic-200'],
    paddingVertical: 0,
  },
  search: {
    backgroundColor: theme['color-basic-200'],
    marginBottom: 15,
  },
  results: {
    flex: 0.7,
    justifyContent: 'flex-start',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  closeIcon: {
    height: 15,
    width: 15,
    marginLeft: 7,
    marginBottom: -2,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme['color-primary-500'],
    marginRight: 10,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  lightText: {
    color: theme['color-basic-100'],
  },
})

const BarCard = ({item: bar}) => {
  const {
    hitMetadata: {distance},
  } = bar

  const {width} = Dimensions.get('window')
  const infoWidth = width - 30 - 115 - 30
  // Object {
  //   "Karaoke": true,
  //   "Loud": true,
  //   "barAddress": "",
  //   "barCoverImage": "generic_bar_01.png",
  //   "barDescription": "",
  //   "barEmail": "",
  //   "barName": "O'Keefe's Bar & Grill",
  //   "barOpeningHours": "",
  //   "barPhone": "",
  //   "barURL": "",
  //   "imUrl": "https://firebasestorage.googleapis.com/v0/b/barhopper-269017.appspot.com/o/images%2Fgeneric_bar_01.png?alt=media&token=1f485973-314c-4533-93fe-14f6d91c77fe",
  // }
  return (
    <TouchableOpacity style={cardStyles.card}>
      {/* Image */}
      <View style={cardStyles.card}>
        <View>
          <Image style={cardStyles.image} source={{uri: bar.imUrl}} />
        </View>
        <View stytle={cardStyles.info}>
          {/* Header */}
          <View style={cardStyles.header}>
            <Text category="label" style={{fontWeight: 'bold', fontSize: 12}}>
              {bar.barName}
            </Text>
            <Text category="label">{distance.toFixed(2)} km</Text>
          </View>
          <View style={cardStyles.redbar}></View>
          {/* Description */}
          <Text
            category="p2"
            appearance="hint"
            style={[cardStyles.details, {width: infoWidth}]}
            numberOfLines={3}
          >
            Lorem Ipsum Bar Details and All That Jazzzz, Lorem Ipsum Bar Details
            and All That Jazzzz, Lorem Ipsum Bar Details and All That Jazzzz,
            Lorem Ipsum Bar Details and All That Jazzzz, Lorem Ipsum Bar Details
            and All That JazzzzLorem Ipsum Bar Details and All That Jazzzz
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const cardStyles = StyleSheet.create({
  card: {
    height: 115,
    borderRadius: 10,
    flexDirection: 'row',
    padding: 0,
    backgroundColor: theme['color-basic-100'],
    marginBottom: 10,
    flex: 1,
  },
  image: {
    height: 115,
    width: 115,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginRight: 15,
  },
  info: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    height: 115,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
  },
  header: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  redbar: {
    height: 1,
    width: 30,
    borderBottomColor: theme['color-primary-500'],
    borderBottomWidth: 3,
    marginBottom: 10,
  },
  lightText: {
    color: theme['color-basic-100'],
  },
})