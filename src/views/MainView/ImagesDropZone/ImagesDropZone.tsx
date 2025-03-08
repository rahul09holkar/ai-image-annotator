import React, { PropsWithChildren, useEffect, useState } from "react";
import "./ImagesDropZone.scss";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { TextButton } from "../../Common/TextButton/TextButton";
import { ImageData, LabelName } from "../../../store/labels/types";
import { connect } from "react-redux";
import {
  addImageData,
  updateActiveImageIndex,
  updateLabelNames,
} from "../../../store/labels/actionCreators";
import { AppState } from "../../../store";
import { ProjectType } from "../../../data/enums/ProjectType";
import { PopupWindowType } from "../../../data/enums/PopupWindowType";
import {
  updateActivePopupType,
  updateProjectData,
} from "../../../store/general/actionCreators";
import { ProjectData } from "../../../store/general/types";
import { ImageDataUtil } from "../../../utils/ImageDataUtil";
import { sortBy } from "lodash";
import { TextareaAutosize } from "@mui/material";

interface IProps {
  updateActiveImageIndexAction: (activeImageIndex: number) => any;
  addImageDataAction: (imageData: ImageData[]) => any;
  updateProjectDataAction: (projectData: ProjectData) => any;
  updateActivePopupTypeAction: (activePopupType: PopupWindowType) => any;
  projectData: ProjectData;
  updateLabelNamesAction: (labels: LabelName[]) => any;
}

const ImagesDropZone: React.FC<IProps> = (props: PropsWithChildren<IProps>) => {
  const [preloadedImages, setPreloadedImages] = useState<string[]>([
    "https://adon-dev-user-images.s3.ap-south-1.amazonaws.com/2c12bdf1-81e7-45fd-a5b6-dd6c716d8cd7/2025/3/Back/CAP5732379718673158250.jpg",
    "https://adon-dev-user-images.s3.ap-south-1.amazonaws.com/2c12bdf1-81e7-45fd-a5b6-dd6c716d8cd7/2025/3/Front/CAP6573624519915483063.jpg",
    "https://adon-dev-user-images.s3.ap-south-1.amazonaws.com/2c12bdf1-81e7-45fd-a5b6-dd6c716d8cd7/2025/3/Left/CAP5438785834296558944.jpg",
    "https://adon-dev-user-images.s3.ap-south-1.amazonaws.com/2c12bdf1-81e7-45fd-a5b6-dd6c716d8cd7/2025/3/Right/CAP13681141411786963.jpg",
    "https://adon-dev-user-images.s3.ap-south-1.amazonaws.com/2c12bdf1-81e7-45fd-a5b6-dd6c716d8cd7/2025/3/Top/CAP7000894386094613837.jpg",
  ]);
  const [loading, setIsLoading] = useState<boolean>(false);
  const [imageUrls, setImageUrls] = useState<string>("");
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png"],
    },
  } as DropzoneOptions);

  const preloadImages = async (imageUrls: string[]) => {
    const imageDataArray: File[] = await Promise.all(
      imageUrls.map(async (url, index) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], `image-${index}.jpg`, {
          type: blob.type,
        });

        return file;
      })
    );
    return imageDataArray;
  };
  const startEditorForUrls = () => {
    setIsLoading(true);
    // Split by comma and trim any extra spaces
    const imageArray = imageUrls.split(",").map((url) => url.trim());

    // Validate URLs
    const validImageUrls = imageArray.filter((url) =>
      url.match(/^https:\/\/[^ ]+\.(jpg|jpeg|png|gif)$/i)
    );

    if (imageArray.length > 0) {
      setPreloadedImages(validImageUrls);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (preloadedImages.length > 0) {
      preloadImages(preloadedImages).then((imageDataArray) => {
        props.updateProjectDataAction({
          ...props.projectData,
          type: ProjectType.OBJECT_DETECTION,
        });
        props.updateActiveImageIndexAction(0);

        props.addImageDataAction(
          imageDataArray.map((file: File) =>
            ImageDataUtil.createImageDataFromFileData(file)
          )
        );
        props.updateLabelNamesAction([
          {
            id: "83ffa175-1c1b-43f0-8903-c085d3231b49",
            name: "top_view",
            color: "#FF5733",
          },
          {
            id: "91df2a64-5e8d-4c74-ae2b-b17d1245f8a9",
            name: "A",
            color: "#33FF57",
          },
          {
            id: "b27c4e53-2dbf-48ff-94b3-7a3df8f814d5",
            name: "B",
            color: "#3357FF",
          },
          {
            id: "f84a2e73-6f39-4203-89e2-cb4e26fce4c6",
            name: "C",
            color: "#FF33A8",
          },
          {
            id: "c9823a8d-8e34-4b1b-abe3-5e19f27d2c63",
            name: "1",
            color: "#F4A261",
          },
          {
            id: "a41e37b1-9d62-4f7a-b5df-e9b8ea2d8c27",
            name: "2",
            color: "#E76F51",
          },
          {
            id: "6fbc2f94-4a35-4073-b26e-1a01f6c1eb4d",
            name: "3",
            color: "#2A9D8F",
          },
          {
            id: "e74a6b2d-7e6f-4738-bf91-5f89d3b6d5c1",
            name: "4",
            color: "#E9C46A",
          },
          {
            id: "5f8d1c72-3e29-4859-bf6c-7c8c5e1d4a31",
            name: "G1",
            color: "#264653",
          },
          {
            id: "3b2d8e57-5a49-4e74-a28f-4e32d7b5f9a6",
            name: "G2",
            color: "#D62828",
          },
          {
            id: "af4b1d82-6f3a-4d9e-92c7-8f26e5b7d4a2",
            name: "G3",
            color: "#F77F00",
          },
          {
            id: "d95a3e74-2b8c-4f3d-82a7-3e6d4f2a9b5c",
            name: "G4",
            color: "#3A86FF",
          },
          {
            id: "e24d7b6a-3f2c-4a5d-8e7b-5d9a3c1f6b27",
            name: "G5",
            color: "#8338EC",
          },
          {
            id: "c3b7d5e8-2a4d-6f3c-9b2e-7a5d1f8e4b92",
            name: "G6",
            color: "#FB5607",
          },
          {
            id: "f8e3a5d7-4b6c-2d9a-1f7b-5e4c8b2d3a96",
            name: "G7",
            color: "#FF006E",
          },
        ]);
        // props.updateActivePopupTypeAction(PopupWindowType.INSERT_LABEL_NAMES);
      });
      setIsLoading(false);
    }
  }, [preloadedImages]);

  const startEditor = (projectType: ProjectType) => {
    if (acceptedFiles.length > 0) {
      const files = sortBy(acceptedFiles, (item: File) => item.name);
      props.updateProjectDataAction({
        ...props.projectData,
        type: projectType,
      });
      props.updateActiveImageIndexAction(0);
      props.addImageDataAction(
        files.map((file: File) =>
          ImageDataUtil.createImageDataFromFileData(file)
        )
      );
      props.updateActivePopupTypeAction(PopupWindowType.INSERT_LABEL_NAMES);
    }
  };

  const getDropZoneContent = () => {
    if (acceptedFiles.length === 0)
      return (
        <>
          <input {...getInputProps()} />
          <img draggable={false} alt={"upload"} src={"ico/box-opened.png"} />
          <p className="extraBold">Drop images</p>
          <p>or</p>
          <p className="extraBold">Click here to select them</p>
        </>
      );
    else if (acceptedFiles.length === 1)
      return (
        <>
          <img draggable={false} alt={"uploaded"} src={"ico/box-closed.png"} />
          <p className="extraBold">1 image loaded</p>
        </>
      );
    else
      return (
        <>
          <input {...getInputProps()} />
          <img
            draggable={false}
            key={1}
            alt={"uploaded"}
            src={"ico/box-closed.png"}
          />
          <p key={2} className="extraBold">
            {acceptedFiles.length} images loaded
          </p>
        </>
      );
  };

  const startEditorWithObjectDetection = () =>
    startEditor(ProjectType.OBJECT_DETECTION);
  const startEditorWithImageRecognition = () =>
    startEditor(ProjectType.IMAGE_RECOGNITION);

  return (
    <div className="ImagesDropZone">
      <div
        {...getRootProps({ className: "DropZone" })}
        onClick={(e) => e.stopPropagation()}
      >
        <h1>Add URLs</h1>
        <TextareaAutosize
          aria-label="empty textarea"
          placeholder="Empty"
          style={{ width: "100%", height: "200px" }}
          onChange={(e) => {
            const urls = e.target.value;
            setImageUrls(urls);
          }}
        />
      </div>
      <div {...getRootProps({ className: "DropZone" })}>
        {getDropZoneContent()}
      </div>
      <div
        className="DropZoneButtons"
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        {loading ? (
          <TextButton
            label={"Loading"}
            isDisabled={true}
            onClick={startEditorForUrls}
          />
        ) : (
          <TextButton
            label={"Add URLs"}
            isDisabled={imageUrls === ""}
            onClick={startEditorForUrls}
          />
        )}
        <TextButton
          label={"Go"}
          isDisabled={!acceptedFiles.length}
          onClick={startEditorWithObjectDetection}
        />
        {/* <TextButton
                    label={'Image recognition'}
                    isDisabled={!acceptedFiles.length}
                    onClick={startEditorWithImageRecognition}
                /> */}
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  updateActiveImageIndexAction: updateActiveImageIndex,
  addImageDataAction: addImageData,
  updateProjectDataAction: updateProjectData,
  updateActivePopupTypeAction: updateActivePopupType,
  updateLabelNamesAction: updateLabelNames,
};

const mapStateToProps = (state: AppState) => ({
  projectData: state.general.projectData,
});

export default connect(mapStateToProps, mapDispatchToProps)(ImagesDropZone);
