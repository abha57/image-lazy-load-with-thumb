import React, { createRef, useEffect, useState } from "react";
import "./style.scss";

const ImageContainer = (props) => {
  const initPolyfill = () => {
    if (!("loading" in HTMLImageElement.prototype)) {
      return true;
    }
    return false;
  };

  const { images } = props;
  const [observer, setIntersectionObserver] = useState(null);
  const [refs, setRefs] = useState([]);
  const [isPolyfillNeeded] = useState(initPolyfill);
  const [loadedImages, setLoadedImages] = useState([]);
  const [highRefs, setHighRefs] = useState([]);

  useEffect(() => {
    setHighRefs((newRefs) =>
      new Array(images.length)
        .fill()
        .map((_, index) => newRefs[index] || createRef())
    );
  }, [images]);

  useEffect(() => {
    setLoadedImages(
      images.map((image, index) => ({
        loaded: false,
        id: image.id
      }))
    );
  }, [images]);

  useEffect(() => {
    if (isPolyfillNeeded) {
      const observer = new IntersectionObserver((entries, self) => {
        entries.map((entry) => {
          if (entry.isIntersecting) {
            entry.target.src = entry.target.dataSet.thumb;
            self.unobserve(entry.target);
          }
        });
      }, {});
      setIntersectionObserver(observer);
    }
  }, [isPolyfillNeeded]);

  useEffect(() => {
    if (isPolyfillNeeded && images.length > 0) {
      setRefs((newRef) =>
        new Array(images.length)
          .fill()
          .map((_, index) => newRef[index] || createRef())
      );
    }
  }, [isPolyfillNeeded, images]);

  useEffect(() => {
    if (isPolyfillNeeded && images.length > 0) {
      images.map((image) => {
        observer.observe(image);
      });
    }
  }, [images, observer, isPolyfillNeeded]);

  const setVisiblilty = (ref, index) => () => {
    if (ref && ref.current) {
        ref.current.style.opacity = 1;
    }
    if (loadedImages.length > 0) {
      loadedImages[index].loaded = true;
      setLoadedImages([...loadedImages]);

    }
  };

  return (
    <>
      {/* {isPolyfillNeeded && (
    <div className='images-container'>
      <image />
    </div>
  )} */}
      {!isPolyfillNeeded &&
        images.map((image, index) => (
          <div className="image-container">
            <div className="aspect-ratio-box" key={image.alt}>
              <img
                ref={highRefs[index]}
                className="high-res"
                key={`${image.alt}-highRes-${index}`}
                alt={image.alt}
                loading="lazy"
                src={image.highResSrc}
                onLoad={setVisiblilty(highRefs[index], index)}
              />

              {loadedImages && loadedImages[index] && !loadedImages[index].loaded && (
                <img
                  className="thumb-image"
                  key={`${image.alt}-thumb`}
                  alt={image.alt}
                  loading="lazy"
                  src={image.thumbSrc}
                />
               )}
            </div>
          </div>
        ))}
    </>
  );
};

export default ImageContainer;
