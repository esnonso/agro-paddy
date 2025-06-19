"use client";
import React, { useState, ChangeEvent } from "react";
import { Quicksand } from "next/font/google";
import styles from "./upload.module.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

type Prediction = {
  disease: string;
  treatment: string;
};

const ImageUploader: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<Prediction>({
    disease: "",
    treatment: "",
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setPreview(null);
      alert("Please select a valid image file");
    }
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      if (!image) return;

      const formData = new FormData();
      formData.append("image", image);

      const res = await fetch("/api/diagnose", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("An error occured");
      const data = await res.json();

      setLoading(false);
      setPrediction({
        disease: data.prediction.prediction,
        treatment: data.prediction.prescription,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles["image-uploader"]}>
        <h2 className={quicksand.className}>Upload Image</h2>
        {loading && <p>Loading...</p>}
        <label className={styles["upload-label"]}>
          Select Image
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        {preview && (
          <div className={styles["preview-container"]}>
            <img
              src={preview}
              alt="Preview"
              className={styles["preview-image"]}
            />
          </div>
        )}

        <button onClick={handleUpload} className={styles["upload-btn"]}>
          Upload{" "}
        </button>

        {prediction.disease && (
          <div>
            <p>
              <b>Disease spotted: </b> <br />
              {prediction.disease.replaceAll("_", " ")}
            </p>
            <p>
              <b>Treatment: </b> <br />
              {prediction.treatment}
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default ImageUploader;
