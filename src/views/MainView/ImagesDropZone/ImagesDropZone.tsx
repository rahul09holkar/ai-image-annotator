import React, { PropsWithChildren, useEffect, useState } from "react";
import "./ImagesDropZone.scss";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { TextButton } from "../../Common/TextButton/TextButton";
import { ImageData } from "../../../store/labels/types";
import { connect } from "react-redux";
import {
  addImageData,
  updateActiveImageIndex,
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

interface IProps {
  updateActiveImageIndexAction: (activeImageIndex: number) => any;
  addImageDataAction: (imageData: ImageData[]) => any;
  updateProjectDataAction: (projectData: ProjectData) => any;
  updateActivePopupTypeAction: (activePopupType: PopupWindowType) => any;
  projectData: ProjectData;
}

const ImagesDropZone: React.FC<IProps> = (props: PropsWithChildren<IProps>) => {
  const [preloadedImages] = useState<string[]>([
    "https://adon-dev-user-images.s3.ap-south-1.amazonaws.com/2c12bdf1-81e7-45fd-a5b6-dd6c716d8cd7/2025/3/Back/CAP5732379718673158250.jpg",
    "https://adon-dev-user-images.s3.ap-south-1.amazonaws.com/2c12bdf1-81e7-45fd-a5b6-dd6c716d8cd7/2025/3/Front/CAP6573624519915483063.jpg",
    "https://adon-dev-user-images.s3.ap-south-1.amazonaws.com/2c12bdf1-81e7-45fd-a5b6-dd6c716d8cd7/2025/3/Left/CAP5438785834296558944.jpg",
    "https://adon-dev-user-images.s3.ap-south-1.amazonaws.com/2c12bdf1-81e7-45fd-a5b6-dd6c716d8cd7/2025/3/Right/CAP13681141411786963.jpg",
    "https://adon-dev-user-images.s3.ap-south-1.amazonaws.com/2c12bdf1-81e7-45fd-a5b6-dd6c716d8cd7/2025/3/Top/CAP7000894386094613837.jpg",
  ]);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png"],
    },
  } as DropzoneOptions);

  const preloadImages = async (imageUrls: string[]) => {
    
    const imageDataArray: ImageData[] = await Promise.all(
      imageUrls.map(async (url, index) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], `image-${index}.jpg`, {
          type: blob.type,
        });

        return {
          id: `preloaded-${index}`,
          fileData: file,
          loadStatus: true,
          labelRects: [],
          labelPoints: [],
          labelLines: [],
          labelPolygons: [],
          labelNameIds: [],
          isVisitedByYOLOObjectDetector: false,
          isVisitedBySSDObjectDetector: false,
          isVisitedByPoseDetector: false,
          isVisitedByRoboflowAPI: false,
        };
      })
    );
    return imageDataArray;
  };

  useEffect(() => {
    if (preloadedImages.length > 0) {
      preloadImages(preloadedImages).then((imageDataArray) => {
        props.addImageDataAction(imageDataArray);
        props.updateActiveImageIndexAction(0);
        props.updateProjectDataAction({
          ...props.projectData,
          type: ProjectType.OBJECT_DETECTION,
        });
        startEditor(ProjectType.OBJECT_DETECTION);
      });
    }
  }, []);

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
      <div {...getRootProps({ className: "DropZone" })}>
        {getDropZoneContent()}
      </div>
      <div
        className="DropZoneButtons"
        style={{ alignItems: "center", justifyContent: "center" }}
      >
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
};

const mapStateToProps = (state: AppState) => ({
  projectData: state.general.projectData,
});

export default connect(mapStateToProps, mapDispatchToProps)(ImagesDropZone);
