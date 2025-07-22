import { MarkerView } from "@rnmapbox/maps";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
} from "react-native";

export default ShopsMarker = ({ selected = () => {} }) => {
  const styles = StyleSheet.create({
    text: {
      textAlign: "center",
    },
    image: {
      width: 20,
      height: 20,
      alignSelf: "center",
    },
    view: {
      backgroundColor: "white",
      borderRadius: 30,
      padding: 4,
      borderColor: "#ccc",
      borderWidth: 2,
    },
  });

  const shops = [
    {
      title: "Shop One",
      coord: [100.54643, 13.72707],
      logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAACtNJREFUeF7tXGuQHFUV/k7vJiEBASGxRASFZHo2QImFIJTyBoGdnkAQEwXBkiSyZnoW1CKiQBVbKoKhJGUyPWEpQBAogwRTyU7P8kjkIREJIFJUgOlJeAQBSwRLQpIKmekjvezGFLX33u6eXjpsbv/te17fd899nHu7CfpJFQFK1bo2Dk1Ayp1AE6AJSBmBlM3rDNAEpIxAyuZ1BmgCUkYgZfM6AzQBKSOQsnmdAR93Al5aMH3vbWO3zQFQAHBQyvF8NOYJ64nZQZNvzlzc/04rRlvKAM/JnQvQYgB7teLEx1aW8TaBZ2WK1eVxY4hNgFfO/xzMV8Y1PJrkmOjybKFyTZyYYhFQK1vHEeOROAZHrQzzaWax+kDU+GIR4DnWegAHRzU2mtsz8FTWdo+MGmNkAl5Y3Hmy4RurohraFdr7Ph/V0V19MkqskQmol62rmXF5FCO7UNurTduNNC9GJsBzrD8DOHYXAjVKqI+YtntCFIFIBDzYc2L7/pN23wKgXWSkyWMnTi0ue2u498ygetl6TyY/BrzfQXb1nyL9nmOxLEDTdoUxPdd7+n7tjfbXJfKNTMEdS4RhbXil3PEgelgm/9qbm8af1PNQIywJkQgI4UDdtF1TZLxVAAK9rRDQagcI0wEZdFzWrjw6MgQ41hXv995fSJTfatruhaL39XLnMczGY6L3BHgZ283KnG+FgAECy9Y6MCaLbLBBR2fnVtZIMlA6BEfdE0TLACd3H0CnSQCck7Hdm4UElHIzmeguCcAPmLYr1N9qBgTy9VJ+FROfLIyBMDNTcO8WdyL5IoRA/Rm7kks8A7inx6hPeuK/APYQ9h7fmJrt7ntB2HtKuXkgmi8Onm7KFCrfG9EMcKzfAviuMAbg0qzt/lr0fp2TO8MH9Ut8fDfz5lF7UU+PH4aE0BnwwqLckYZBT0iUvmXa7kSZ0XopX2JiW9LmStN2rx5JAmpOvofAV4lt0ELTrlwier/WmbHHGGwOOqIh7EiGf0Rmbv/TiRJQd3I/ZND1YqXcZ9rVM+Xg5VYANE2S/hdkCu4dI0mAV85fCOZbJBmwPGu70xU+PAXgCGEb5kvMYnVh0gQsY5DQMSL8JFNwf6Ug4BmAviAMnnB8tuAGk5zwaXUSrpXypxDxSkkGPG3aFTG4H0zkC8D4gcTNpabtzkiUAK9kvQXCPiKlvu8f29Hdv1oB3n8A7C1qY6D9wCn28ldHkoB1zplTfDTr4t6Lt82iu6/Ch68DuKcVHUOyoeaA+g2dh3DTWCtxqqHagLx6/YzxW8Zt3izTIdsEDcm1mgGDa/lgMyiMffzWCRMO+NHdwYZz2GftTafvM2Zr+7CbzSGBJnN2arHqqbIgFAGek+sC6AbJuPmXrO1+VWZs3WLrMN/Hs5I2L5u2qzxRa5WAwH7Nsd4g4NMSXw4xbfd5RRYE7ztEbQiQLskjZYBXyt8J4vOEDhFdZxYqP5Y6XLYsMCpiHXjILLgnqXpMEgR4jvVXAEeLh0LunGJX75XGU7J6QbhIMgzdZhZd4XI3GgGOFdRP9hOyzTxddSxXd6wCA06rDidBQM2x7iJgpjCjCV3ZgnujjIB62TqfGbdL2rxk2q7yzEQ5BD2/+IzPt/ltL8mckRXgto/dJetaEC4TBs34WbboStbnH0gmQYDnWNcBuFQSk7KsvL43f2Czwa/IcGm0Nz5zSNd9b8jaKAmol3IXMNHvxEqoZtoV4Vi4nYCy9XswviUZxmaZhUqwS5U+SRBQc/JFAi8SdgbgjqztXhDCF+nIwIxzs0V3SUsEeGWrDMZciZJbTNudrXK25lirCfiKqJ1v+Kd0zO3/k0pPEgTUnfw0Bq8Q2+KHTbt6osqXmmPdTsD5wqEZKGVst7s1AhwrOGg+VTz+Y3am6Ap3ltszwLH+AWB/oZ6mPyVzcX9w1jzyGbAwfzi18d8lhkKtyGpl6yJi9Er0KIuLyiFIVb4FoFyyJTV2J6Vn8DJZsCkUPrKDnSGhEEtr6flIoEdNgGNtAjBB5GkYR0NM5BtN291T1fuTIiCMHjbos9m5lddkPr3eO23Cuw0/wEf0bDJtV1g9DklAbgNAB4gsbNm8bY/D590vcwJeKfc1EN3fao+rL+ycxG3Gv2R6to1r7HvonPvelrUZrGhulI7NZJyYKfTJjh+h3BEzNphF93NSO6pe5zm5NQAdJWzHfIJZrEovaYUoXgEhLjbVy9YMZvxBDhzOyhRcyQQbHMooD4YA8HzTrgqXzYEP9UXW6WxAtmF7zLRd4cIjVAbUndwSBn1TFDQD92Ztt1P0vtY7bSI1eC3An1KQ/ahpu8fJ2oS5kRHmRMpzrKAkcpjCn9fa2rceOrlrZVD7H/bxFAsUAHeatitcJYUioObkv0Pg22TOMiCsoXuOFZQfLFWmDbyXlDQ8J/8bgC8Oo4cZV2SL7i+HaxviUOj/YkT3mIXKN4bT45XzS8F8jhSXJPYBr5StT25lSMfUQSceJ+Zr2reNfbi52+axDbQdZvhGcLT3xTCg7dBmJRFufG9sY1UwlnuLcufAoODiayaKHiKsBvndwcnUQAmaGl8GUxeA46PoAWMNMV0Gbq5tGLv5bfTeCQxcTsCXVHr83dr27Ji9Qj7XqJQE771yvg/M+TBtdZvtCNxt2q6w3jTUSrkMDRoOLiOfAzBeAxwKgS1sUEa1jA01BwyZ8xwrKF4FRSz9qBAYiTPhgaFIcaVD5dcu8j5UbSzSELQjcKpiWBiQifl6pmAZKL7kFUYPgGWM4DMhKIuB0tUK8CARPQnmeSHtCpuFqQzsKBxqDkiQgHcINDtjV5YGOutO7ioG9cQJmsA/zdjVawcXCd8Hc3BlJs4ctb32P7jiCm72xf7mbWclILgldiu3G5dlu/r+vSPg62/IZ5pNXhB6rwBUQeg2C+6LO+oJLv62NdrnE/DtMDUuAKvYN4ofvskXbByNJl/DzLNkl69EnWZnIWAjAW/4wIvvlzFcGFimWhEMrNW5cTZoYFgK6ifBofkYAK+DsIFB9zMaf+wo3FuTZcw656wDfGpMJ6ZOHviMigM9QY9+GeBXwFhJaFuWKfbJbnmgtji/P3ycDbBlAAfzB/4oC4apExDVgTjDT5oynmMFV2uEQ13U+BOfA6I6kCaYcWxrAuKglqCMJiBBMOOo0gTEQS1BGU1AgmDGUaUJiINagjKagATBjKNKExAHtQRlNAEJghlHlSYgDmoJymgCEgQzjipNQBzUEpTRBCQIZhxVmoA4qCUoowlIEMw4qjQBcVBLUEYTkCCYcVRpAuKglqCMJiBBMOOo0gTEQS1BGU1AgmDGUaUJiINagjKagATBjKNqZyAg+F/+J+I4vwvIvGPabqRrjTHuBeWkf73aBUCWhfg303aVX87sqCA6AeX8/CRuEY9SopQ/+fhw3JEJGLxMG/yaUvjXwFEKriqsRls7TZ7cVdmgathSBgTCXil3C4iEf8iN4sCoactYZBbdUF9xtkzAM9edtvv4CWOCf4hOHTUAthbI46btHhNHReQhaMjI+t5T92o2xt0Z4V5/HP92fhnCki2bts1R/a5BFEhsAoYUBl9QGs2284gQfC0f/BNUeYd+50dV6mHw+85nGdTHTWNJR/cK2e/wlaG2TIDSgm4gRUATkHIH0QRoAlJGIGXzOgM0ASkjkLJ5nQGagJQRSNm8zgBNQMoIpGxeZ4AmIGUEUjb/P+8RyJ1WcR7dAAAAAElFTkSuQmCC",
    },
    {
      title: "Shop Two",
      coord: [100.54623, 13.7271],
      logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAAAtNJREFUeF7tm1Fu01AQRW1UtgBqt4LMCtot8EE+uogGEUS7CD7KB1toV0DEVqjKFqgwylcLafL05tgaxT79ba7Hc8+buY1Vt40/qQ60qdUt3ggg+RAIQADJDiSXdwIEkOxAcnknQADJDiSXdwIEkOxAcnknQADJDiSXdwIEkOxAcnkn4NABXK8v++QeUssvuiU6xEi86VwAAnACUh1ILu4KEoAhTM6AIUzca5rGFQQNpPJ0ALSBuevxCpq7gbR/AVAHoV4A0EAqRwC+fL86Pmr7n/QmDln/0Lcn528v7qI9IABf159P+6a9iRafgq5t+rP33YfbaC8IwPX66mPT9Kto8Wno2tWiu/gU7QUCuNyc/tNo8Ynobhfd8izaCwWw2f/H0eIT0d0tuuVJtJcwgG8/Vq9+/zm6jxaeku7li4fX796sfkV6CgMwgB/tJkEcBmAAPz3v8SAGAAzgJwjCQUwAGMCPBMJBHAJgAG/HbTSIQwAM4G0A0SAOATCAn/uDMxbEQQAG8DMIQkEcBWAAbxMIBXE1AAN49/fdSBBXAzCAdwOIBHE1AAN43xOf+iAOADCA9yCoDuIIAAN4N4HqII4AmPX7AKVHzrX/qCWAkqOVvxdApWFDf1wAQztaeT0BVBo29McFMLSjldcTQKVhQ39cAEM7Wnm90QH8fz+l11Rrb6iy3+JrsrT+2P1Vfw8QwL8OUMACKIycE5BskAAEsN+BsU9IKZTHrj/29c2A5AkTgABKSyZ3BbqCkk+oAASQuwJKC2rsEzr29Q3h5AkTgABKSyZ3BbqCkk/owQNg55ur6eNiAUAGAoAGUrkAqINQLwBoIJULgDoI9QKABlK5AKiDUD95ANCf2cvxs6DZOwgNEAA0kMoFQB2EegFAA6lcANRBqBcANJDKBUAdhHoBQAOpXADUQagXADSQygVAHYR6AUADqVwA1EGoFwA0kMoFQB2E+r8y7LxwLq4jkQAAAABJRU5ErkJggg==",
    },
  ];

  return shops.map((s, i) => (
    <MarkerView coordinate={s.coord} allowOverlap={true} key={i}>
      <TouchableHighlight
        onPress={() => selected(s)}
        style={{ borderRadius: 30 }}
      >
        <View style={styles.view}>
          <Image source={{ uri: s.logo }} style={styles.image} />
        </View>
      </TouchableHighlight>
    </MarkerView>
  ));
};

