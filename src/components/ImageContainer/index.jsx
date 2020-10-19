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
    setLoadedImages((im) =>
      new Array(images.length).fill({
        loaded: false
      })
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

  // const onImageLoad = (index) => () => {
  //   loadedImages[index].loaded = true;
  //   console.log("image loaded", index);
  //   console.log("loadedImages", loadedImages);
  //   setLoadedImages([...loadedImages]);
  // };

  const setVisiblilty = (ref, index) => () => {
    // console.log("ref=====", ref.current);
    if (ref && ref.current) {
      // debugger;
      ref.current.style.visibility = "visible";
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
              {/* {loadedImages[index] && ( */}
              <img
                ref={highRefs[index]}
                className="high-res"
                key={`${image.alt}-highRes-${index}`}
                alt={image.alt}
                loading="lazy"
                src={image.highResSrc}
                onLoad={setVisiblilty(highRefs[index], index)}
              />

              {!loadedImages[index] && (
                <img
                  className="thumb-image"
                  key={`${image.alt}-thumb`}
                  alt={image.alt}
                  loading="lazy"
                  // onLoad={onImageLoad(index)}
                  src={image.thumbSrc}
                  // data-highRes={}
                />
              )}
            </div>
          </div>
        ))}
    </>
  );
};

export default ImageContainer;
