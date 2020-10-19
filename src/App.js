import React from "react";
import ImageContainer from "./components/ImageContainer";
import { images } from "./images.json";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <ImageContainer images={images} />
    </div>
  );
}
