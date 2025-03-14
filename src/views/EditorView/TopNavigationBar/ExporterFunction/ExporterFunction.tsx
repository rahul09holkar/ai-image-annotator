import { connect } from "react-redux";
import { AppState } from "src/store";
import { COCOExporter } from "../../../../logic/export/polygon/COCOExporter";
import { useState } from "react";
const ExporterFunction: React.FC = () => {
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

  const postTheData = async (
    token: string,
    notationData: any,
    image_name: string,
    type: string
  ) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      image_category: type,
      image_name: image_name,
      json_data: notationData,
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    const response = await (
      await fetch(
        "http://api-dev.adonhaircare.com/v1/batch/saveAnnotation",
        requestOptions
      )
    ).json();
    return response;
  };

  const onAccept = async () => {
    const notationData = COCOExporter.returnJson();
    const params = new URLSearchParams(window.location.search);
    const encodedData = params.get("d");
    const decodedString = atob(encodedData);
    const jsonData = JSON.parse(decodedString);
    const response = await postTheData(
      jsonData.token,
      notationData,
      jsonData.name,
      jsonData.imageType
    );
    if (response.code === 200) {
      setIsSaved(true);

      setTimeout(() => {
        setIsSaved(false);
      }, 5000);
    }
  };

  if (isSaved) {
    return (
      <div style={savedStyle}>
        <div className="Marker" />
        Saved
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
      Save
    </div>
  );
};
const mapDispatchToProps = {};
const mapStateToProps = (state: AppState) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(ExporterFunction);
