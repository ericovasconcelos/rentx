import React, { useRef, useState } from 'react';
import { FlatList, ViewToken } from 'react-native';
import { Bullet } from '../Bullet';

import {
    Container,
    ImageIndexes,
    CarImageWrapper,
    CarImage
} from './styles';

interface Props {
    imagesUrl: string[];
}

interface ImageSlideProps {
    viewableItems: ViewToken[];
    changed: ViewToken[];
}

export function ImageSlider({ imagesUrl }: Props) {
    const [imageIndex, setImageIndex] = useState(0);

    const handleViewableItemsChanged = useRef((item: ImageSlideProps) => {
        const index = item.viewableItems[0].index!;
        setImageIndex(index);
    });

    return (
        <Container>
            <ImageIndexes>
                {
                    imagesUrl.map((_, index) => (
                        <Bullet
                        key={String(index)}
                        active={index === imageIndex}
                        />
                    ))
                }
            </ImageIndexes>

            <CarImageWrapper>
                <FlatList
                    data={imagesUrl}
                    keyExtractor={key => key}
                    renderItem={({ item }) => (
                        <CarImageWrapper>
                            <CarImage source={{ uri: item }} resizeMode="contain" />
                        </CarImageWrapper>
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    onViewableItemsChanged={handleViewableItemsChanged.current}
                />
            </CarImageWrapper>

        </Container>
    );
}