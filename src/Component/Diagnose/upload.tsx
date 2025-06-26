"use client";
import React, { useState, ChangeEvent } from "react";
import Image from "next/image";
import { Quicksand } from "next/font/google";
import Sample from "../../../public/sample.png";
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
  const [notFound, setNotFound] = useState("");
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
      setPrediction({
        disease: "",
        treatment: "",
      });
      setNotFound("");
      if (!image) return;

      const formData = new FormData();
      formData.append("image", image);

      const res = await fetch("/api/diagnose", {
        method: "POST",
        body: formData,
        cache: "no-store",
      });
      if (!res.ok) throw new Error("An error occured");
      const data = await res.json();

      setLoading(false);
      if (data.prediction.prediction === "unknown") {
        setNotFound(
          "Image not recognized as a plant leaf, upload a clear leaf image"
        );
        return;
      }
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
        <h3 className={quicksand.className} style={{ marginBottom: "0" }}>
          Upload Plant Leaf Image
        </h3>

        <small className={styles.small}>
          Upload leaf of plant similar to sample Image for proper detection
        </small>

        <div style={{ display: "flex" }}>
          <div className={styles["preview-container"]}>
            <p>Sample Image</p>
            <Image src={Sample} height={150} width={150} alt="Sample Imgage" />
          </div>

          <div className={styles["preview-container"]}>
            <p>
              <label className={styles["upload-label"]}>
                Select Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </p>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className={styles["preview-image"]}
              />
            )}
          </div>
        </div>

        <button
          onClick={handleUpload}
          className={styles["upload-btn"]}
          disabled={loading}
        >
          {loading === true ? (
            <div className={styles["typing-indicator"]}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            "Upload"
          )}
        </button>

        {prediction.disease && (
          <div style={{ padding: "0.5rem" }}>
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

        {notFound && <p>{notFound}</p>}
      </div>
    </main>
  );
};

export default ImageUploader;
