import { View, Text, ScrollView, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MediumText } from '../../components/StyledText';
import { styles } from './styles';
import Header from '../../components/Header';
import { isValidImage, openMediaLibrary } from '../../utils';
import FlashcardInput from '../../components/FlashcardInput';
import DeskItemEditPreview from '../../components/DeskItemEditPreview';
import SlideModal from '../../components/SlideModal';
import OptionsList from '../../components/OptionsList';
import useColorScheme from '../../hooks/useColorScheme';
import { Colors } from '../../constants';

const EditDeskItemA = (props) => {
  const { height } = Dimensions.get('window');
  const colorScheme = useColorScheme();
  const { deskItem, useCase } = props.route.params;
  const type = props.route.params?.type || deskItem?.type

  const [media, setMedia] = useState(deskItem?.media || []);
  const [cards, setCards] = useState(deskItem?.cards || []);
  const [showImageOptionsModal, setShowImageOptionsModal] = useState({ show: false });
  const [cardA, setCardA] = useState('');
  const [cardB, setCardB] = useState('');
  const [isCardAImage, setIsCardAImage] = useState(false);
  const [isCardBImage, setIsCardBImage] = useState(false);

  useEffect(() => {
    isValidImage(cardA, setIsCardAImage);
    isValidImage(cardB, setIsCardBImage);



  }, [cardA, cardB])

  const MAX = 10;


  const onAddCardPress = () => {
    cards.push({
      cardA: {
        data: cardA,
        isImage: isCardAImage
      },
      cardB: {
        data: cardB,
        isImage: isCardBImage
      },

    });
    setCardB('');
    setCardA('');

  }


  const deleteCard = (card) => {
    setCards(cards.filter(item => item != card))
  }
  const deleteMedia = (media) => {
    setMedia(media.filter(item => item != media))

  }

  const onTakePicturePress = (callback) => {

    setShowImageOptionsModal({ show: false });
    props.navigation.navigate('Camera', {
      useCase: type === 'Flashcards' ? 'single photo to use' : 'multiple photos to use',

      canRecord: false,
      callback

    });
  }
  const onLibraryPress = async (callback) => {
    setShowImageOptionsModal({ show: false })

    openMediaLibrary(callback);

  }

  const addImages = (images) => {
    const array = []
    for (let i = 0; i < images.length; i++) {
      if (media.length + array.length < MAX)
        array.push(images[i]);
    }
    setMedia([...media, ...array])

  }
  const canContinue = () => {
    return media.length > 0 || cards.length > 0;
  }
  return (
    <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>

      <Header
        title={useCase == 'new desk item' ? 'New ' + type : 'Edit ' + type}
        headerRight={
          <MediumText
            h4
            disabled={!canContinue()}
            onPress={() => props.navigation.navigate('EditDeskItemB', { ...props.route.params, cards, media })}
            accent={canContinue()}
            darkgray={!canContinue()}>
            {"Next"}
          </MediumText>
        }
      />
      <SlideModal
        onCancel={() => setShowImageOptionsModal({ show: false })}
        showModal={showImageOptionsModal.show}
        height={height - (3 * 50) - 10}

      >
        <OptionsList

          options={['Take Photo', 'Upload Photo']}
          onOptionPress={[
            () => onTakePicturePress(showImageOptionsModal.callback),
            () => onLibraryPress(showImageOptionsModal.callback)]}
          onCancel={() => setShowImageOptionsModal({ show: false })}
        />
      </SlideModal>


      <View style={{ paddingHorizontal: 15 }}>




        {type != "Flashcards" ?
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>

            <MediumText verydarkgray h4>
              {"Media (" + media.length + "/" + MAX + ")"}
            </MediumText>


            <MediumText
              h4
              accent={media.length < MAX}
              darkgray={media.length >= MAX}
              onPress={() => setShowImageOptionsModal({ show: true, callback: addImages })}
              disabled={media.length >= MAX}
            >Add</MediumText>
          </View>

          :

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <MediumText
              verydarkgray
              h4
            >
              {'Cards (' + cards.length + '/' + MAX + ')'}
            </MediumText>



            <MediumText
              accent={cardA && cardB && cards.length < MAX}
              darkgray={!cardA || !cardB || cards.length >= MAX}
              h4
              disabled={cards.length == MAX || !cardB || !cardA}
              onPress={onAddCardPress}>
              {'Add'}

            </MediumText>
          </View>

        }
        {type === "Flashcards" &&
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>


            <FlashcardInput
              isFront
              type={type}
              value={cardA}
              placeholder={'Term'}
              onChangeText={setCardA}
              onChangeImage={setIsCardAImage}
              isImage={isCardAImage}
              onAddImagePress={() => setShowImageOptionsModal({ show: true, callback: setCardA })}

            />

            <FlashcardInput
              type={type}
              placeholder={'Definition'}
              value={cardB}
              onChangeText={setCardB}
              onChangeImage={setIsCardBImage}
              isImage={isCardBImage}
              onAddImagePress={() => setShowImageOptionsModal({ show: true, callback: setCardB })}

            />

          </View>
        }


        <ScrollView contentContainerStyle={{ flexWrap: 'wrap', flexDirection: 'row' }}>
          {media.map((item, index) =>
            <View key={index}>
              <DeskItemEditPreview
                onRemovePress={() => deleteMedia(item)}
                media={item}
                style={{ marginRight: 10, marginTop: 20 }}
                itype={type}
              />


            </View>
          )}
        </ScrollView>

        {type == "Flashcards" &&
          <View>
            {cards.map((item, index) =>

              <DeskItemEditPreview
                type={type}
                item={item}
                onRemovePress={() => deleteCard(item)}
                containerStyle={{ marginTop: 20 }}
                key={index}
              />
            )}
          </View>
        }
      </View>

    </View>
  )
}

export default EditDeskItemA