import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  fullSafeAreaView: {
    flex: 1,
  },
  mapView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: 140,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  item: {
    color: '#2E2E2E',
    // backgroundColor: '#FAFAFA',
    padding: 8,
    marginVertical: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  listItem: {
    color: '#2E2E2E',
    padding: 3,
    marginVertical: 8,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#DCDCDC',
  },

  listItemTopLocaiton: {
    color: '#2E2E2E',
    padding: 2,
    marginVertical: 3,
    marginHorizontal: 2,
    alignItems: 'center', // Centers children horizontally
    justifyContent: 'center', // Centers children vertically
    flexDirection: 'row', // Still keeps the content in a row
    borderRadius: 4,
    borderColor: '#DCDCDC',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  darkNavy: {
    borderColor: '#162C51',
  },
  infoTopLocation: {
    padding: 1,
    width: 120,
    height: 70,
    justifyContent: 'center', // Center content inside this container
    alignItems: 'center',
  },
  imageTopLocation: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    justifyContent: 'center', // Center image content if necessary
    alignItems: 'center',
  },
  titleTopLocation: {
    fontSize: 12,
  },

  info: {
    padding: 15,
    width: 250,
  },

  image: {
    flex: 1,
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  itemCenter: {
    alignItems: 'center',
  },
  reSizeCover: {resizeMode: 'cover'},
  title: {
    fontSize: 18,
  },
  description: {
    fontSize: 12,
    color: '#777',
  },
  textGreen: {
    color: '#22973F',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  venueName: {
    margin: 16,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  buttonDirection: {
    backgroundColor: '#162C51',
    color: 'white',
  },
  categoryItem: {
    color: '#292929',
    backgroundColor: '#E4E4E4',
  },
  amenitiesContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#F5F5F5',
    zIndex: 999,
  },
  ninetySixPercent: {height: '96%'},
  dividerLast: {
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  justifyBetween: {
    justifyContent: 'space-between',
  },
  locationCategoryItem: {
    flex: 1,
    margin: 5,
    height: 100,
    minWidth: 90,
    maxWidth: 130,
  },
  primaryButton: {
    backgroundColor: '#162C51',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  outlinedButton: {
    borderWidth: 1,
    borderColor: '#162C51',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  outlinedButtonText: {
    color: '#162C51',
    fontSize: 16,
    fontWeight: 'bold',
  },
  wordSpecing: {
    flexWrap: 'wrap',
    textAlign: 'center',
    maxWidth: 100,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  compassContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  compassImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  headingValue: {
    fontSize: 18,
    marginTop: 10,
    color: '#555',
  },
  cardinalDirection: {
    fontSize: 18,
    marginTop: 10,
    color: '#555',
  },
  container3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  compass: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    width: 5,
    height: 100,
    backgroundColor: 'red',
  },
  degrees: {
    marginTop: 20,
    fontSize: 18,
  },
  badge: {
    borderWidth: 1,
    borderColor: '#475582',
  },
  colorDarkPeriwinkle: {color: '#475582'},
  bgDarkPeriwinkle: {backgroundColor: '#475582'},
  borderListItemBottom: {borderBottomWidth: 1, borderColor: '#BDBDBD'},
  zoneLogoWrapper: {
    resizeMode: 'cover',
    marginLeft: 4,
  },
  exitButton: {
    backgroundColor: '#BB5148',
    height: 48,
    width: 91,
  },
  startButton: {
    width: '100%',
    backgroundColor: '#475582',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
  },
  disabledColor: {
    backgroundColor: '#BDBDBD',
  },
  fontObRegular: {
    fontFamily: 'OneBangkok-Regular',
  },
});
