import { View, StyleSheet, Platform } from "react-native";
import React from "react";
import { CollapsibleHeaderScrollView } from "react-native-collapsible-header-views";
import Header from "../../components/Header";
import { SimpleGrid } from "react-native-super-grid";
import BigButton from "../../components/BigButton";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, sizes, hexTransparencies } from '../../config'

interface ButtonData {
  title: string;
  nav: string;
  icon: JSX.Element;
}

const DiscoverScreen = () => {
  const DiscoverScreenButtons = () => {
    const buttons: ButtonData[] = [
      {
        title: "Categories",
        nav: "Categories",
        icon: <MaterialIcons name="category" size={24} color={colors.cyan} />,
      },
    ];

    return (
      <View>
        <SimpleGrid
          data={buttons}
          listKey="buttonsList"
          renderItem={({ item, index }) => (
            <View key={index}>
              <BigButton title={item.title} nav={item.nav} icon={item.icon} />
            </View>
          )}
        />
      </View>
    );
  };

  const components = [<DiscoverScreenButtons />];

  return (
    <CollapsibleHeaderScrollView
      CollapsibleHeaderComponent={<Header title="Filmer" />}
      headerHeight={60}
      showsVerticalScrollIndicator={false}
      statusBarHeight={Platform.OS === "ios" ? 20 : 0}
      headerContainerBackgroundColor={colors.dark1}
      style={screen.container}
    >
      {components.map((item, index) => {
        return <View style={{ marginBottom: 15 }}>{item}</View>;
      })}
    </CollapsibleHeaderScrollView>
  );
};

const screen = StyleSheet.create({
  container: {
    backgroundColor: colors.dark1,
    paddingHorizontal: 15,
    paddingTop: 16,
  },
});

const showMoreGenres = StyleSheet.create({
  container: {
    backgroundColor: `${colors.dark0}${hexTransparencies[80]}`,
    marginHorizontal: 15,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: sizes.radiusBig,
  },
  text: {
    color: `${colors.light1}${hexTransparencies[80]}`,
  },
});

const genreSection = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.dark0,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.dark2,
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 12,
    color: colors.light1,
  },
});

export default DiscoverScreen;
