/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {FFmpegKit, FFprobeKit, FFmpegSession} from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';
import Video from 'react-native-video';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: 'black',
    flex: 1,
  };

  const [videoWartermark, setVideoWartermark] = useState('');

  const getDestinationPath = async (fileName: string) => {
    const destinationPath = RNFS.CachesDirectoryPath + `/${fileName}`;
    const exists = await RNFS.exists(destinationPath);
    if (exists) {
      await RNFS.unlink(destinationPath);
    }
    return destinationPath;
  };

  const addVideoLogo = async () => {
    const videoUrl =
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4';
    let thumbnailName = 'thumbnail-' + new Date().getTime() + '.mp4';
    let destinationPath = await getDestinationPath(thumbnailName);
    let logo =
      'https://firebasestorage.googleapis.com/v0/b/appkousei.appspot.com/o/images%2Fic_shareabill.png?alt=media&token=6bbaef3e-105d-45df-b6a2-e173a860c822';

    let overlayCommand = `-filter_complex overlay=x=(main_w-overlay_w)/2:y=(main_h-overlay_h)/2`;
    let ffmpegCommand = `-i ${videoUrl} -v quiet -i ${logo}  ${overlayCommand} -preset ultrafast ${destinationPath}`;

    try {
      await FFmpegKit.execute(ffmpegCommand);
      console.log('destinationPath::::', destinationPath);
      if (destinationPath) {
        setVideoWartermark(destinationPath);
      }

      return destinationPath;
    } catch (error) {
      console.log('error::', error);
      throw error;
    }
  };

  useEffect(() => {
    addVideoLogo();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Video
          // Can be a URL or a local file.
          source={{uri: videoWartermark}}
          repeat
          controls
          // Store reference
          // Callback when remote video is buffering
          // Callback when video cannot be loaded
          style={{width: Dimensions.get('window').width, height: 400}}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
