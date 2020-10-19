import React, { createRef, useEffect, useState } from "react";
import "./style.scss";

const ImageContainer = (props) => {
  const initPolyfill = () => {
    if (!("loading" in HTMLImageElement.prototype)) {
      return true;
    }
    return true; //false
  };

  const { images } = props;
  const [observer, setIntersectionObserver] = useState(null);
  // const [isPolyfillNeeded] = useState(initPolyfill);
  const [loadedImages, setLoadedImages] = useState([]);
  const [highRefs, setHighRefs] = useState([]);
  const [thumbRefs, setThumbRefs] = useState([]); // isPolyfillNeeded

  useEffect(() => {
    setHighRefs((newRefs) =>
      new Array(images.length)
        .fill()
        .map((_, index) => newRefs[index] || createRef())
    );
  }, [images]);

  useEffect(() => {
      setThumbRefs((newRefs) =>
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
      const observer = new IntersectionObserver((entries, self) => {
        entries.map((entry) => {
          if (entry.isIntersecting) {
            entry.target.src = entry.target.dataset.highres || entry.target.dataset.thumb;
            self.unobserve(entry.target);
          }
        });
      }, {});
      setIntersectionObserver(observer);
    
  }, []);

  useEffect(() => {
    if (thumbRefs.length > 0) {
      thumbRefs.map((ref) => {
        observer.observe(ref.current);
      });
    }
  }, [thumbRefs, observer]);

  useEffect(() => {
    if (highRefs.length > 0) {
      highRefs.map((ref) => {
        observer.observe(ref.current);
      });
    }
  }, [highRefs, observer]);

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
      <div className='images-container'>
      {images.map((image, index) => (
          <div className="image-container">
            <div className="aspect-ratio-box" key={image.alt}>
              <img
                ref={highRefs[index]}
                className="high-res"
                key={`${image.alt}-highRes`}
                alt={image.alt}
                onLoad={setVisiblilty(highRefs[index], index)}
                data-highres={image.highResSrc}
              />
              {loadedImages && loadedImages[index] && !loadedImages[index].loaded && (
                <img
                  ref={thumbRefs[index]}
                  className="thumb-image"
                  key={`${image.alt}-thumb`}
                  alt={image.alt}
                  data-thumb={image.thumbSrc}
                />
               )}
            </div>
            <div className='static'>
              This section is to check for the layout shifts when images load.
            </div>
          </div>
        ))

      }

      
      
    </div>
    </>
  );
};

export default ImageContainer;
