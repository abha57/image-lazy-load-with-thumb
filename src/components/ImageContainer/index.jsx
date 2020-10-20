import React, { createRef, useEffect, useState } from "react";
import "./style.scss";

const ImageContainer = (props) => {
  const { images } = props;
  const [observer, setIntersectionObserver] = useState(null);
  const [loadedImages, setLoadedImages] = useState([]);
  const [highRefs, setHighRefs] = useState([]);
  const [thumbRefs, setThumbRefs] = useState([]);

  // these are high resolution refs.
  useEffect(() => {
    setHighRefs((newRefs) =>
      new Array(images.length)
        .fill()
        .map((_, index) => newRefs[index] || createRef())
    );
  }, [images]);

  // // these are thumb refs
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
          // the individual entry or dom element, our observer observes.
          if (entry.isIntersecting) {
             // we will be using dataset properties for passing the image sources.
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
        observer.observe(ref.current);  // adding ref to observer.
      });
    }
  }, [thumbRefs, observer]);

  useEffect(() => {
    if (highRefs.length > 0) {
      highRefs.map((ref) => {
        observer.observe(ref.current);  // adding ref to observer.
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
      {images.map((image, index) => (
          <div className="image-container">
            <div className="aspect-ratio-box" key={image.alt}>
              {/* // we will be loading two images initially. */}
              <img
                ref={highRefs[index]}
                className="high-res"
                key={`${image.alt}-highRes`}
                alt={image.alt}
                onLoad={setVisiblilty(highRefs[index], index)}
                data-highres={image.highResSrc}
              />
              {/* // we will hide this thumb image when actual image loads. */}
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
          </div>
        ))

      }
    </>
  );
};

export default ImageContainer;
