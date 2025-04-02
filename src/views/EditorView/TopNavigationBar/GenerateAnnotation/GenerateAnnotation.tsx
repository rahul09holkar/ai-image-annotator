import { connect } from "react-redux";
import { AppState } from "src/store";
import { useState } from "react";
// import { updateImageData, updateLabelNames } from "../../../store/labels/actionCreators";
import {
  updateImageData,
  updateLabelNames,
  updateActiveLabelType,
} from "../../../../store/labels/actionCreators";
import { ImageData, LabelName } from "src/store/labels/types";
import { LabelType } from "../../../../data/enums/LabelType";
import { LabelsSelector } from "../../../../store/selectors/LabelsSelector";

interface Props {
  updateImageDataAction: (imageData: ImageData[]) => void;
  updateLabelNamesAction: (labels: LabelName[]) => void;
  updateActiveLabelTypeAction: (activeLabelType: LabelType) => any;
}
const GenerateAnnotation: React.FC<Props> = ({
  updateImageDataAction,
  updateLabelNamesAction,
  updateActiveLabelTypeAction,
}) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const style: React.CSSProperties = {
    top: 35,
    cursor: "pointer",
  };
  const savedStyle: React.CSSProperties = {
    top: 35,
    cursor: "pointer",
    color: "#5cb85c",
    fontWeight: "bold",
  };

  const processAnnotationsData = (annotationsData: any) => {
    if (
      !annotationsData ||
      !annotationsData.annotations ||
      !annotationsData.categories
    ) {
      console.error("Invalid annotations data");
      return;
    }
    const generateUUID = () =>
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });

    // Extract label names
    const labelNames: LabelName[] = annotationsData.categories.map(
      (category: any) => ({
        id: category.id,
        name: category.name,
        color: "#33FF57",
      })
    );
    const imagesData: ImageData[] = LabelsSelector.getImagesData();

    // Extract image data
    const customimageData = annotationsData.annotations.map(
      (annotation: any) => ({
        bbox: annotation.bbox,
        segmentation: annotation.segmentation,
        labelId: annotation.category_id,
        id:generateUUID(),
        isVisible: true,
      })
    );
    imagesData[0].labelPolygons = [
      ...imagesData[0].labelPolygons,
      ...customimageData,
    ];
    debugger;
    // Dispatch actions to update Redux store
    // updateImageDataAction(imageData);
    updateLabelNamesAction(labelNames);
    updateActiveLabelTypeAction(LabelType.POLYGON);
  };

  const onAccept = async () => {
    setIsSaved(true);
    const params = new URLSearchParams(window.location.search);
    const encodedData = params.get("d");
    const decodedString = atob(encodedData);
    const jsonData = JSON.parse(decodedString);

    const body = {
      view: jsonData.imageType,
      image_url: jsonData.url,
    };
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
    const response = await fetch(
      "https://f0s4h9tgjb.execute-api.ap-south-1.amazonaws.com/dev-apis/get_image_annotations",
      options
    );
    const returnResponse = await response.json();
    if (returnResponse.statusCode === 200) {
      const annotationsData =
        returnResponse?.body?.result?.thinning_details.annotations;
      debugger;
      if (annotationsData) {
        processAnnotationsData(annotationsData);
      }
    }
    setIsSaved(false);
    debugger;
  };

  if (isSaved) {
    return (
      <div style={savedStyle}>
        <div className="Marker" />
        Generating...
      </div>
    );
  }
  return (
    <div
      style={style}
      onClick={() => {
        onAccept();
      }}
    >
      <div className="Marker" />
      Generate Annotation
    </div>
  );
};
const mapDispatchToProps = {
  updateImageDataAction: updateImageData,
  updateLabelNamesAction: updateLabelNames,
  updateActiveLabelTypeAction: updateActiveLabelType,
};
const mapStateToProps = (state: AppState) => ({
  activeLabelType: state.labels.activeLabelType,
});
export default connect(mapStateToProps, mapDispatchToProps)(GenerateAnnotation);
