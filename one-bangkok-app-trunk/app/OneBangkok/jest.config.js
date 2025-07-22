module.exports = {
    preset: "react-native",
    transform: {
      "^.+\\.js$": "babel-jest"
    },
    transformIgnorePatterns: [
      "node_modules/(?!react-native|react-navigation)/"
    ],
    setupFilesAfterEnv: [
      "<rootDir>/__tests__/setupTests.tsx"
    ]
};
