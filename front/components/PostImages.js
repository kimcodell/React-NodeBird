import React, { useCallback, useState } from 'react';
import propTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';

import ImagesZoom from './ImagesZoom';  //그냥 폴더 불러오면 폴더 안의 index를 가져옴.

const PostImages = ({ images }) => {
    const [showImagesZoom, setShowImagesZoom] = useState(false);

    const onZoom = useCallback(() => {
        setShowImagesZoom(true);
    }, []);
    const onClose = useCallback(() => {
        setShowImagesZoom(false)
    }, []);

    if (images.length === 1) {
        return (
            <>
                <img role="presentation" src={images[0].src} alt={images[0].src} onClick={onZoom} />    {/* role 설정하면 click할 수 있어도 스크린리더가 굳이 클릭하지 않도록 */}
                { showImagesZoom && <ImagesZoom images={images} onClose={onClose}/>}
            </>
        );
    }
    if (images.length === 2) {
        return (
            <>
                <img role="presentation" style={{ display: 'inline-block', width: "50%" }} src={images[0].src} alt={images[0].src} onClick={onZoom} />
                <img role="presentation" style={{ display: 'inline-block', width: "50%" }} src={images[1].src} alt={images[1].src} onClick={onZoom} />
                {showImagesZoom && <ImagesZoom images={images} onClose={onClose}/>}
            </>
        );
    }
    return (
        <>
            <img role="presentation" style={{ display: 'inline-block', width: "50%" }} src={images[0].src} alt={images[0].src} onClick={onZoom} />
            <div
                role="presentation"
                style={{ display: 'inline-block', width: '50%', textAlign: 'center', verticalAlign: 'middle' }}
                onClick={onZoom}
            >
                <PlusOutlined/>
                <br/>
                {images.length -1}개의 사진 더보기
            </div>
            { showImagesZoom && <ImagesZoom images={images} onClose={onClose}/>}
        </>
    )
};

PostImages.propTypes = {
    images: propTypes.arrayOf(propTypes.object),
}

export default PostImages;
